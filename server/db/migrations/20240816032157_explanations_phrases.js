/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('explanations_phrases', (table) => {
    table.increments('id').primary()
    table.integer('explanation_id').notNullable().references('explanations.id')
    table.integer('phrase_id').notNullable().references('phrases.id')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('explanations_phrases')
}
