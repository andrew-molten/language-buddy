/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema
    .createTable('word_phrase_association', (table) => {
      table.increments('id').primary()
      table.integer('phrase_id').references('phrases.id').notNullable()
      table.integer('word_id').references('words.id').nullable()
      // table.index(['word_id', 'phrase_id'], 'word_phrase_idx').unique()
    })
    .then(() => {
      return knex.schema.raw(
        'CREATE UNIQUE INDEX word_phrase_idx ON word_phrase_association (word_id, phrase_id)',
      )
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('word_phrase_association')
}
