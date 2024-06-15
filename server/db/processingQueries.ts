import { DefinitionToAdd, WordPhraseAssociation } from '../../models/stories.ts'
import connection from './connection.ts'

// QUERY FUNCTIONS
export const checkLemmas = async (words: string[], trx = connection) => {
  return trx('lemmas').select().whereIn('word', words)
}
export const getMatchingWords = async (words: string[], trx = connection) => {
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

export const checkUserPhrases = async (
  existingIds: number[],
  user_id: number,
  trx = connection,
) => {
  return trx('user_phrases')
    .select()
    .where({ user_id })
    .whereIn('phrase_id', existingIds)
}

export const checkWordInPhrases = async (word: string, trx = connection) => {
  return trx('phrases').select().where('phrase', 'like', `%${word}%`)
}

export const checkWordPhraseAssociations = async (
  wordPhraseObj: WordPhraseAssociation,
  trx = connection,
) => {
  return trx('word_phrase_association')
    .select()
    .where({ word_id: wordPhraseObj.wordId })
    .whereIn('phrase_id', wordPhraseObj.phraseIdArr)
}
