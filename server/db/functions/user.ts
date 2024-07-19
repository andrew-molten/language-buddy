import { NewUser } from '../../../models/admin.ts'
import connection from '../connection.ts'

const db = connection

export async function getUserByAuthId(authId: string) {
  return db('users').select().where('auth_id', authId)
}

export async function getUserIdByAuthId(authId: string) {
  const id = await db('users').select('id').where('auth_id', authId).first()
  return id.id
}

export async function createUser(newUser: NewUser, authId: string) {
  return db('users').insert({
    first_name: newUser.givenName,
    last_name: newUser.familyName,
    username: newUser.username,
    email: newUser.email,
    date_of_birth: newUser.birthdate,
    auth_id: authId,
    is_premium: 0,
  })
}

export async function checkUserName(username: string) {
  const result = await db('users').count('id as count').where({ username })
  const count = Number(result[0].count)
  return count > 0
}
