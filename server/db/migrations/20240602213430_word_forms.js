/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('word_forms', (table) => {
    table.increments('id').primary()
    table.integer('word_id').references('vocabulary.id')
    table.string('inflected_form').notNullable()
    table.string('grammatical_form', 255).notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('word_forms')
}
