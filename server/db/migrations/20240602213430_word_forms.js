/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('word_forms', (table) => {
    table.increments('id').primary()
    table.integer('word_id').references('vocabulary.id')
    table.string('word_form').notNullable()
    table.string('extra_meaning')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('word_forms')
}
