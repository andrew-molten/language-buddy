// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// export async function up(knex) {
//   return knex.schema.alterTable('story_history', (table) => {
//     table.string('token_usage').defaultTo('')
//   })
// }

// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// export async function down(knex) {
//   return knex.schema.alterTable('story_history', (table) => {
//     table.dropColumn('token_usage')
//   })
// }
// should maybe include all 3 token usages separately for each story, or at least the total usage separate

// For the user:
// I want to track the daily usage, so that if they hit a limit then it stops them from doing more until the next day unless they are paying
//  But that also seems like a short sighted plan that wouldn't encourage users to pay, where as if it limited them on a weekly basis that might encourage them to pay more - although short term I just want people using it.
// Maybe I should make it a weeks_token_usage with a high limit now that can be changed later
