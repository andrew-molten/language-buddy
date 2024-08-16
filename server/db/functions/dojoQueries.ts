import { PhraseToUpdate } from '../../../models/dojo.ts'
import connection from '../connection.ts'
const db = connection

export const getPhrasesByProficiency = async (
  user_id: number,
  languageLearning: string,
  languageNative: string,
  proficiency: number,
  operator: string,
  proficiency2: number,
  operator2: string,
) => {
  return await db('user_phrases')
    .where({
      user_id,
    })
    .andWhere({ language: languageLearning })
    .andWhere({ translation_language: languageNative })
    .andWhere(function () {
      this.where('proficiency', operator, proficiency)
    })
    .andWhere(function () {
      this.where('proficiency', operator2, proficiency2)
    })
    .join('phrases', 'user_phrases.phrase_id', 'phrases.id')
    .join(
      'phrase_translation',
      'user_phrases.phrase_id',
      'phrase_translation.phrase_id',
    )
    .select(
      'user_phrases.id as userPhraseId',
      'user_phrases.user_id as userId',
      'user_phrases.phrase_id as phraseId',
      'user_phrases.proficiency',
      'phrases.phrase',
      'phrase_translation.translation',
    )
}

export const updatePhraseProficiency = async (
  phrasesToUpdate: PhraseToUpdate[],
  user_id: number,
) => {
  for (const phrase of phrasesToUpdate) {
    await db('user_phrases')
      .where({ id: phrase.id })
      .where({ user_id })
      .update({ proficiency: phrase.proficiency })
  }
  return
}
