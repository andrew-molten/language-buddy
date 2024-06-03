/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema
    .createTable('vocabulary', (table) => {
      table.increments('id').primary()
      table.string('word').notNullable()
      table.string('language').notNullable()
      // table.index(['word', 'language']).unique('word_language_idx')
    })
    .then(() => {
      return knex.schema.raw(
        'CREATE UNIQUE INDEX word_language_idx ON vocabulary (word, language)',
      )
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('vocabulary')
}
