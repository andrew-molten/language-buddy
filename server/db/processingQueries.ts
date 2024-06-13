import { DefinitionToAdd } from '../../models/stories.ts'
import connection from './connection.ts'

// QUERY FUNCTIONS
export const checkLemmas = async (words: string[], trx = connection) => {
  return trx('lemmas').select().whereIn('word', words)
}
export const checkWords = async (words: string[], trx = connection) => {
  return trx('words').select().whereIn('word', words)
}

export const checkWordsInUserVocab = async (
  ids: number[],
  user_id: number,
  trx = connection,
) => {
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

export const checkDefinitionsExist = async (
  definitions: DefinitionToAdd[],
  trx = connection,
) => {
  const query = trx('definitions').select()

  definitions.forEach(({ id, definition }, index) => {
    if (index === 0) {
      query.where({ word_id: id, definition })
    } else {
      query.orWhere({ word_id: id, definition })
    }
  })
  return query
}

// export const checkPhraseExists = async (
//   phrases: Phrase[],
//   trx = connection,
// ) => {}
