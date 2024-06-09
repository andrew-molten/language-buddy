/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('story_history').del()
  await knex('story_history').insert([
    {
      id: 1,
      user_id: 1,
      story_one: 'Story One',
      story_two: 'Story Two',
      story_translated: 'Story translated',
      language_learning: 'German',
      language_native: 'English',
      corrections: 'Corrections',
      new_words: 'New Words',
      date_added: '2024-05-06',
    },
    {
      id: 2,
      user_id: 2,
      story_one: 'Story Three',
      story_two: 'Story Four',
      story_translated: 'Story translated',
      language_learning: 'German',
      language_native: 'English',
      corrections: 'Corrections',
      new_words: 'New Words',
      date_added: '2024-04-05',
    },
  ])
}
