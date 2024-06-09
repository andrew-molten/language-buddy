import connection from './connection'

const db = connection

export const getAllStoriesByUserId = async (user_id: number) => {
  console.log('databsse id:', user_id)
  return db('story_history').select().where({ user_id })
}
