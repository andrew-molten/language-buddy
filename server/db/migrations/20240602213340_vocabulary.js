/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('vocabulary', (table) => {
    table.increments('id').primary()
    table.string('word').notNullable()
    table.string('language').notNullable()
    table.index(['word', 'language'], 'word_language_idx').unique()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('vocabulary')
}
