import {
  BackendStory,
  DBWord,
  Id,
  Lemma,
  NewWord,
  WordPhraseAssociation,
  WordToAdd,
  WordToAddWithDefinition,
} from '../../../models/stories.ts'
import connection from '../connection.ts'

const db = connection
// collect the original stories from the request, to add with the data we get back (fs.writefile maybe?)
export async function saveStory(data: BackendStory) {
  try {
    await db.transaction(async (trx) => {
      // INSERT TO STORY HISTORY
      const storyHistoryId = await trx('story_history')
        .insert({
          user_id: data.user_id,
          story_one: data.story_one,
          story_two: data.story_two,
          story_translated: data.correctTranslatedStory,
          language_native: data.language_native,
          language_learning: data.language_learning,
          corrections: JSON.stringify(data.corrections),
          new_words: JSON.stringify(data.wordsToAddToVocabulary),
          well_used_words: JSON.stringify(data.wellUsedWords),
          date_added: data.date_added,
        })
        .returning('id') //[{id:3}]

      // INSERT TO LEMMAS
      let newLemmaIds: Lemma[]
      if (data.lemmasData.lemmasToAdd.length > 0) {
        newLemmaIds = await trx('lemmas')
          .insert(
            data.lemmasData.lemmasToAdd.map((word: NewWord) => ({
              word: word.lemma,
              language: data.language_learning,
            })),
          )
          .returning(['id', 'word', 'language'])
        // insertlemma definitions
        await trx('lemma_definitions').insert(
          newLemmaIds.map((lemmaId, index) => ({
            lemma_id: lemmaId.id,
            definition: data.lemmasData.lemmasToAdd[index].definition,
            definition_language: data.language_native,
          })),
        )
      }

      // ADD LEMMA IDS BEFORE INSERT
      const wordsWithLemmaIds = data.wordsData.wordsToAdd.map((word) => {
        if (word.lemma_id === null || undefined) {
          const lemma = newLemmaIds.find((lemma) => lemma.word === word.lemma)
          word.lemma_id = lemma?.id
        }
        return word
      })

      // INSERT TO WORDS
      let newWordIds: DBWord[] = []
      if (wordsWithLemmaIds.length > 0) {
        newWordIds = await trx('words')
          .insert(
            wordsWithLemmaIds.map((word: WordToAdd) => ({
              lemma_id: word.lemma_id,
              word: word.word,
              grammatical_form: word.grammaticalForm,
              language: data.language_learning,
              gender: word.gender,
            })),
          )
          .returning(['id', 'word']) // all new word ids - definitely add these definitions
      }

      // INSERT TO USERS VOCAB
      const usersWordIdsToInsert = [...newWordIds, ...data.usersNewWordIds]
      let usersNewWordIds
      if (usersWordIdsToInsert.length > 0) {
        usersNewWordIds = await trx('user_vocabulary')
          .insert(
            usersWordIdsToInsert.map((id) => ({
              user_id: data.user_id,
              word_id: id.id,
              proficiency: 0,
            })),
          )
          .returning('id')
      }

      // Combine definitions with word_id's
      let newWordsWithWordIds: WordToAddWithDefinition[] = []
      if (wordsWithLemmaIds.length > 0) {
        newWordsWithWordIds = wordsWithLemmaIds.map((word) => {
          const thisWord = newWordIds.find(
            (newWord) => newWord.word === word.word,
          )
          if (thisWord) {
            return { ...word, word_id: thisWord.id }
          } else return { ...word }
        })
      }
      // combine this with definitions to add

      const definitionsToAdd = [
        ...newWordsWithWordIds,
        ...data.definitionsToAdd,
      ]
      // INSERT TO DEFINITIONS
      let definitionIds: Id[] = []
      if (definitionsToAdd.length > 0) {
        definitionIds = await trx('definitions')
          .insert(
            definitionsToAdd.map((word) => ({
              word_id: word.word_id,
              definition: word.definition,
              definition_language: data.language_native,
            })),
          )
          .returning('id')
      }

      // INSERT PHRASES
      let correctionIds: Id[] = []
      if (data.phraseData.phrasesToAdd.length > 0) {
        correctionIds = await trx('phrases')
          .insert(
            data.phraseData.phrasesToAdd.map((correction) => ({
              phrase: correction.sentenceCorrection,
              language: data.language_learning,
            })),
          )
          .returning('id')

        // INSERT PHRASE TRANSLATIONS
        await trx('phrase_translation').insert(
          data.phraseData.phrasesToAdd.map((phrase, index) => ({
            phrase_id: correctionIds[index].id,
            translation: phrase.translation,
            translation_language: data.language_native,
          })),
        )
      }

      // USERS NEW PHRASES
      const usersNewPhrases = [...correctionIds, ...data.usersNewPhraseIds]
      if (usersNewPhrases.length > 0) {
        await trx('user_phrases').insert(
          usersNewPhrases.map((phrase) => ({
            user_id: data.user_id,
            phrase_id: phrase.id,
            proficiency: 0,
          })),
        )
      }

      console.log('storyHistoryId: ', storyHistoryId)
      console.log('newWordIds: ', newWordIds)
      console.log('usersNewWordIds: ', usersNewWordIds)
      console.log('definitionIds: ', definitionIds)
      console.log('correctionIds', correctionIds)

      await trx.commit()
    })
    console.log('data inserted successfully')
  } catch (error) {
    console.error('Error inserting data', error)
  }
}

export const insertWordPhraseAssociations = async (
  wordPhraseObj: WordPhraseAssociation,
  trx = connection,
) => {
  await trx('word_phrase_association').insert(
    wordPhraseObj.phraseIdArr.map((phraseId) => ({
      word_id: wordPhraseObj.wordId,
      phrase_id: phraseId,
    })),
  )
}
