import { BackendStory, NewWord } from '../../models/stories.ts'
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

      let lemmaIds
      if (data.lemmasData && data.lemmasData.lemmasToAdd.length > 0) {
        lemmaIds = await trx('lemmas')
          .insert(
            data.lemmasData.lemmasToAdd.map((word: NewWord) => ({
              word: word.lemma,
              language: data.language_learning,
            })),
          )
          .returning('id') // [{id:3}, {id:4}]
      }
      console.log('storyHistoryId: ', storyHistoryId)
      console.log('lemmaIds: ', lemmaIds)

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
