import {
  BackendStory,
  Lemma,
  NewWord,
  WordToAdd,
} from '../../models/stories.ts'
import connection from './connection.ts'

const db = connection
// collect the original stories from the request, to add with the data we get back (fs.writefile maybe?)
export async function saveStory(data: BackendStory) {
  console.log('language_learning: ', data.language_learning)
  try {
    await db.transaction(async (trx) => {
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

      // give words lemma id's
      const wordsWithLemmaIds = data.wordsData.wordsToAdd.map((word) => {
        if (word.lemma_id === null) {
          const lemma = newLemmaIds.find((lemma) => lemma.word === word.word)
          word.lemma_id = lemma?.id
        }
        return word
      })

      // insert words
      const newWordIds = await trx('words')
        .insert(
          wordsWithLemmaIds.map((word: WordToAdd) => ({
            lemma_id: word.lemma_id,
            word: word.word,
            grammatical_form: word.grammaticalForm,
          })),
        )
        .returning('id')

      console.log('storyHistoryId: ', storyHistoryId)
      console.log('newWordIds: ', newWordIds)
      // console.log('lemmaIds: ', newLemmaIds)

      await trx.commit()
    })
    console.log('data inserted successfully')
  } catch (error) {
    console.error('Error inserting data', error)
  }
}

// query function for vocab and phrases
export async function checkLemmas(words: string[], trx = connection) {
  return trx('lemmas').select().whereIn('word', words)
}
export async function checkWords(words: string[], trx = connection) {
  return trx('words').select().whereIn('word', words)
}

export async function checkWordsInUserVocab(words: string[], trx = connection) {
  return trx('user_vocabulary').select().whereIn('word', words) //needcto check for id
}

// add server functions inside of storyProcessor to check whether the words exist and send back an object of their locations etc.
