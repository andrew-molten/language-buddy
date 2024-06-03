/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('definitions').del()
  await knex('definitions').insert([
    {
      id: 1,
      word_id: 1,
      definition: 'to come',
      definition_language: 'English',
    },
    { id: 2, word_id: 2, definition: 'to go', definition_language: 'English' },
    { id: 3, word_id: 3, definition: 'to eat', definition_language: 'English' },
  ])
}
