/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex.raw('PRAGMA foreign_keys = OFF')
  await knex('lemma_definitions').del()
  await knex('lemma_definitions').insert([
    {
      id: 1,
      lemma_id: 1,
      definition: 'to come',
      definition_language: 'English',
    },
    { id: 2, lemma_id: 2, definition: 'to go', definition_language: 'English' },
    {
      id: 3,
      lemma_id: 3,
      definition: 'to eat',
      definition_language: 'English',
    },
  ])
  await knex.raw('PRAGMA foreign_keys = ON')
}
