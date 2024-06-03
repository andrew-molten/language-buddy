/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('definitions', (table) => {
    table.increments('id').primary()
    table.integer('word_id').references('vocabulary.id')
    table.text('definition').notNullable()
    table.string('definition_language').notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('definitions')
}
