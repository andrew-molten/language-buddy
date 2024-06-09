/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('phrase_translation', (table) => {
    table.increments('id').primary()
    table.integer('phrase_id').references('phrases.id').notNullable()
    table.text('translation').notNullable()
    table.string('translation_language').notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('phrase_translation')
}
