/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.alterTable('words', (table) => {
    table.string('language').defaultTo('German')
    table.string('gender')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.alterTable('words', (table) => {
    table.dropColumn('language')
    table.dropColumn('gender')
  })
}
