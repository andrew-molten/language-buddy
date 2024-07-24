import { NewUser, UpdatedUser } from '../../../models/admin.ts'
import connection from '../connection.ts'

const db = connection

export async function getUserByAuthId(authId: string) {
  return db('users')
    .select(
      'auth_id as authId',
      'date_of_birth as dateOfBirth',
      'email',
      'first_name as firstName',
      'id',
      'is_premium as isPremium',
      'last_name as lastName',
      'learning_language as learningLanguage',
      'native_language as nativeLanguage',
      'username',
    )
    .where('auth_id', authId)
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
    learning_language: newUser.languageLearning,
    native_language: newUser.languageNative,
  })
}

export async function checkUserName(username: string) {
  const result = await db('users').count('id as count').where({ username })
  const count = Number(result[0].count)
  return count > 0
}

export async function updateUser(updatedUser: UpdatedUser, authId: string) {
  return db('users').where({ auth_id: authId }).update({
    learning_language: updatedUser.learningLanguage,
    native_language: updatedUser.nativeLanguage,
  })
}
