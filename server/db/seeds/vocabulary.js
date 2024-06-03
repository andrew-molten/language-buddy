/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('vocabulary').del()
  await knex('vocabulary').insert([
    { id: 1, word: 'kommen', language: 'German' },
    { id: 2, word: 'gehen', language: 'German' },
    { id: 3, word: 'essen', language: 'German' },
  ])
}
