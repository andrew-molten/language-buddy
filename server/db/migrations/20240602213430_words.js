/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('words', (table) => {
    table.increments('id').primary()
    table.integer('lemma_id').references('lemmas.id')
    table.string('word').notNullable()
    table.string('grammatical_form', 255).notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('words')
}
