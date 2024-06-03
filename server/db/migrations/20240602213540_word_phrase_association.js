/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('word_phrase_association', (table) => {
    table.increments('id').primary()
    table.integer('phrase_id').references('phrases.id').notNullable()
    table.integer('word_id').references('vocabulary.id').notNullable()
    table.integer('word_form_id').references('word_forms.id').nullable()
    table.index(['word_id', 'phrase_id'], 'word_phrase_idx').unique()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('word_phrase_association')
}
