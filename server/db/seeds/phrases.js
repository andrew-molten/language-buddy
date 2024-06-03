/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('phrases').del()
  await knex('phrases').insert([
    { id: 1, phrase: 'Ich komme', language: 'German' },
    { id: 2, phrase: 'Du gehst', language: 'German' },
    { id: 3, phrase: 'Er isst', language: 'German' },
  ])
}
