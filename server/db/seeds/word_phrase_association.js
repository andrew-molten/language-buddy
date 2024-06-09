/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('word_phrase_association').del()
  await knex('word_phrase_association').insert([
    { id: 1, phrase_id: 1, word_id: 1 },
    { id: 2, phrase_id: 2, word_id: 2 },
    { id: 3, phrase_id: 3, word_id: 3 },
  ])
}
