import { NewWord } from '../../models/stories.ts'
import connection from './connection.ts'

const db = connection
// collect the original stories from the request, to add with the data we get back (fs.writefile maybe?)
export async function saveStory(data) {
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
        .returning('id')

      const vocabularyIds = await trx('vocabulary')
        .insert(
          data.wordsToAdd.map((word: NewWord) => ({
            word: word.lemma,
            language: data.language_learning,
          })),
        )
        .returning('id')

      console.log('storyHistoryId: ', storyHistoryId)
      console.log('vocabularyIds: ', vocabularyIds)

      await trx.commit()
    })
    console.log('data inserted successfully')
  } catch (error) {
    console.error('Error inserting data', error)
  }
}

// query function for vocab and phrases
export async function checkWordsInVocab(words: string[]) {
  return db('vocabulary').select().whereIn('word', words)
}

// add server functions inside of storyProcessor to check whether the words exist and send back an object of their locations etc.
