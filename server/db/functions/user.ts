import connection from '../connection.ts'

const db = connection

export async function getUserByAuthId(authId: string) {
  return db('users').select().where('auth_id', authId)
}
