/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('lemma_definitions', (table) => {
    table.increments('id').primary()
    table.integer('lemma_id').notNullable().references('lemmas.id')
    table.string('definition').notNullable()
    table.string('definition_language').notNullable()
    // table.index(['word', 'language']).unique('word_language_idx')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('lemma_definitions')
}
