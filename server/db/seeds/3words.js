/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('words').del()
  await knex('words').insert([
    {
      id: 1,
      lemma_id: 1,
      word: 'komme',
      grammatical_form: 'first person singular',
    },
    {
      id: 2,
      lemma_id: 1,
      word: 'kommst',
      grammatical_form: 'second person singular',
    },
    {
      id: 3,
      lemma_id: 1,
      word: 'kommt',
      grammatical_form: 'third person singular',
    },
    {
      id: 4,
      lemma_id: 2,
      word: 'gehe',
      grammatical_form: 'first person singular',
    },
    {
      id: 5,
      lemma_id: 2,
      word: 'gehst',
      grammatical_form: 'second person singular',
    },
    {
      id: 6,
      lemma_id: 2,
      word: 'geht',
      grammatical_form: 'third person singular',
    },
    {
      id: 7,
      lemma_id: 3,
      word: 'esse',
      grammatical_form: 'first person singular',
    },
    {
      id: 8,
      lemma_id: 3,
      word: 'isst',
      grammatical_form: 'third person singular',
    },
  ])
}
