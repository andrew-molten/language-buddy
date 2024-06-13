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

export const checkPhrasesExists = async (
  phrases: string[],
  trx = connection,
) => {
  return trx('phrases').select().whereIn('phrase', phrases)
}
