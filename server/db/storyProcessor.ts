import connection from './connection.ts'

export async function saveStory(data, db = connection) {
  try {
    await db.transaction(async (trx) => {
      const storyHistoryId = await trx('story_history')
        .insert({
          user_id: 1,
          story_one: data.story_one,
          story_two: data.story_two,
          language_native: 'English',
          language_learning: 'German',
          corrections: JSON.stringify(data.corrections),
          new_words: JSON.stringify(data.wordsToAddToVocabulary),
          well_used_words: JSON.stringify(data.wellUsedWords),
        })
        .returning('id')

      console.log('storyHisoryId: ', storyHistoryId)

      await trx.commit()
    })
    console.log('data inserted successfully')
  } catch (error) {
    console.error('Error inserting data', error)
  }
}
// will need to use a transaction

// collect the original stories from the request, to add with the data we get back (fs.writefile maybe?)
