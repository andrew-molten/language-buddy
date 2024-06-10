import { DefinitionToAdd } from '../../models/stories.ts'
import connection from './connection.ts'
const db = connection

// QUERY FUNCTIONS
export async function checkLemmas(words: string[], trx = connection) {
  return trx('lemmas').select().whereIn('word', words)
}
export async function checkWords(words: string[], trx = connection) {
  return trx('words').select().whereIn('word', words)
}

export async function checkWordsInUserVocab(
  ids: number[],
  user_id: number,
  trx = connection,
) {
  return trx('user_vocabulary')
    .select()
    .where({ user_id })
    .whereIn('word_id', ids)
}

// export async function getDefinitionsById(ids: DBWord[], trx = connection) {
//   const justIds = ids.map((id) => id.id)
//   return trx('definitions')
//     .select()
//     .whereIn('word_id', justIds)
//     .join('words', 'definitions.word_id', 'words.id')
// }

export async function checkDefinitionsExist(definitions: DefinitionToAdd[]) {
  const query = db('definitions').select()

  definitions.forEach(({ id, definition }, index) => {
    if (index === 0) {
      query.where({ word_id: id, definition })
    } else {
      query.orWhere({ word_id: id, definition })
    }
  })
  return query
}
