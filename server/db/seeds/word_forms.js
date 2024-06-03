/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('word_forms').del()
  await knex('word_forms').insert([
    {
      id: 1,
      word_id: 1,
      inflected_form: 'komme',
      grammatical_form: 'first person singular',
    },
    {
      id: 2,
      word_id: 1,
      inflected_form: 'kommst',
      grammatical_form: 'second person singular',
    },
    {
      id: 3,
      word_id: 1,
      inflected_form: 'kommt',
      grammatical_form: 'third person singular',
    },
    {
      id: 4,
      word_id: 2,
      inflected_form: 'gehe',
      grammatical_form: 'first person singular',
    },
    {
      id: 5,
      word_id: 2,
      inflected_form: 'gehst',
      grammatical_form: 'second person singular',
    },
    {
      id: 6,
      word_id: 2,
      inflected_form: 'geht',
      grammatical_form: 'third person singular',
    },
    {
      id: 7,
      word_id: 3,
      inflected_form: 'esse',
      grammatical_form: 'first person singular',
    },
    {
      id: 8,
      word_id: 3,
      inflected_form: 'isst',
      grammatical_form: 'third person singular',
    },
  ])
}
