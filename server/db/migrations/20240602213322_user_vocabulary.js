/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema
    .createTable('user_vocabulary', (table) => {
      table.increments('id').primary()
      table.integer('user_id').references('users.id').notNullable()
      table.integer('word_id').references('vocabulary.id').notNullable()
      table.integer('proficiency').notNullable()
      // table.index(['user_id', 'word_id'], 'user_word_idx')
    })
    .then(() => {
      return knex.schema.raw(
        'CREATE UNIQUE INDEX user_word_idx ON user_vocabulary (user_id, word_id)',
      )
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('user_vocabulary')
}
