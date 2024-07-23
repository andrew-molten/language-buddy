/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('learning_language').defaultTo('German')
    table.string('native_language').defaultTo('English')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('native_language')
    table.dropColumn('learning_language')
  })
}
