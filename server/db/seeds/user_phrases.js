/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('user_phrases').del()
  await knex('user_phrases').insert([
    { id: 1, user_id: 1, phrase_id: 1, proficiency: 5 },
    { id: 2, user_id: 1, phrase_id: 2, proficiency: 3 },
    { id: 3, user_id: 2, phrase_id: 3, proficiency: 4 },
  ])
}
