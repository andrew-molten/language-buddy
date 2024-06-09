/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex.raw('PRAGMA foreign_keys = OFF')
  await knex('lemmas').del()
  await knex('lemmas').insert([
    { id: 1, word: 'kommen', language: 'German' },
    { id: 2, word: 'gehen', language: 'German' },
    { id: 3, word: 'essen', language: 'German' },
  ])
  await knex.raw('PRAGMA foreign_keys = ON')
}
