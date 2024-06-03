/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      date_of_birth: '1990-01-01',
      is_premium: true,
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
      date_of_birth: '1992-02-02',
      is_premium: false,
    },
  ])
}
