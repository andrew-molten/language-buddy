/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('story_history', (table) => {
    table.increments('id').primary()
    table.integer('user_id').references('users.id').notNullable()
    table.text('story_one')
    table.text('story_two')
    table.string('language_learning')
    table.string('language_native')
    table.text('corrections')
    table.text('new_words')
    table.text('well_used_words')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('story_history')
}
