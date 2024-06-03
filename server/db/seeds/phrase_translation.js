/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('phrase_translation').del()
  await knex('phrase_translation').insert([
    {
      id: 1,
      phrase_id: 1,
      translation: 'I come',
      translation_language: 'English',
    },
    {
      id: 2,
      phrase_id: 2,
      translation: 'You go',
      translation_language: 'English',
    },
    {
      id: 3,
      phrase_id: 3,
      translation: 'He eats',
      translation_language: 'English',
    },
  ])
}
