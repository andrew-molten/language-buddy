/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema
    .createTable('user_phrases', (table) => {
      table.increments('id').primary()
      table.integer('user_id').references('users.id')
      table.integer('phrase_id').references('phrases.id')
      table.integer('proficiency')
      // table.index(['user_id', 'phrase_id'], 'user_phrase_idx').unique()
    })
    .then(() => {
      return knex.schema.raw(
        'CREATE UNIQUE INDEX user_phrase_idx ON user_phrases (user_id, phrase_id)',
      )
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('user_phrases')
}
