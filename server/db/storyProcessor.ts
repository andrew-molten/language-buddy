import {
  BackendStory,
  DBWord,
  Id,
  Lemma,
  NewWord,
  WordToAdd,
  WordToAddWithDefinition,
} from '../../models/stories.ts'
import connection from './connection.ts'

const db = connection
// collect the original stories from the request, to add with the data we get back (fs.writefile maybe?)
export async function saveStory(data: BackendStory) {
  console.log('language_learning: ', data.language_learning)
  try {
    await db.transaction(async (trx) => {
      // INSERT TO STORY HISTORY
      const storyHistoryId = await trx('story_history')
        .insert({
          user_id: 1,
          story_one: data.story_one,
          story_two: data.story_two,
          language_native: data.language_native,
          language_learning: data.language_learning,
          corrections: JSON.stringify(data.corrections),
          new_words: JSON.stringify(data.wordsToAddToVocabulary),
          well_used_words: JSON.stringify(data.wellUsedWords),
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
          .returning(['id', 'word', 'language']) // [{id:3}, {id:4}]
      }

      // ADD LEMMA IDS BEFORE INSERT
      const wordsWithLemmaIds = data.wordsData.wordsToAdd.map((word) => {
        if (word.lemma_id === null) {
          const lemma = newLemmaIds.find((lemma) => lemma.word === word.word)
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

      // INSERT TO DEFINITIONS
      let definitionIds: Id[] = []
      if (newWordsWithWordIds.length > 0) {
        definitionIds = await trx('definitions')
          .insert(
            newWordsWithWordIds.map((word) => ({
              word_id: word.word_id,
              definition: word.definition,
              definition_language: data.language_native,
            })),
          )
          .returning('id')
      }

      console.log('storyHistoryId: ', storyHistoryId)
      console.log('newWordIds: ', newWordIds)
      console.log('usersNewWordIds: ', usersNewWordIds)
      console.log('definitionIds: ', definitionIds)

      await trx.commit()
    })
    console.log('data inserted successfully')
  } catch (error) {
    console.error('Error inserting data', error)
  }
}

// QUERY FUNCTIONS
export async function checkLemmas(words: string[], trx = connection) {
  return trx('lemmas').select().whereIn('word', words)
}
export async function checkWords(words: string[], trx = connection) {
  return trx('words').select().whereIn('word', words)
}

export async function checkWordsInUserVocab(
  ids: number[],
  user_id: number,
  trx = connection,
) {
  return trx('user_vocabulary')
    .select()
    .where({ user_id })
    .whereIn('word_id', ids)
}

export async function getDefinitionsById(ids: DBWord[], trx = connection) {
  const justIds = ids.map((id) => id.id)
  return trx('definitions')
    .select()
    .whereIn('word_id', justIds)
    .join('words', 'definitions.word_id', 'words.id')
}
