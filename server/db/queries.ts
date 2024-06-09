import connection from './connection'

const db = connection

export const getAllStoriesByUserId = async (user_id: number) => {
  return db('story_history').select().where({ user_id })
}

export const getVocabularyByUserId = async (user_id: number) => {
  return db('user_vocabulary')
    .select()
    .where({ user_id })
    .join('words', 'user_vocabulary.word_id', 'words.id')
    .join('definitions', 'user_vocabulary.word_id', 'definitions.word_id')
}
