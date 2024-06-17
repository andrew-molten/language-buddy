import connection from '../connection.ts'

export const getLowestProficiencyPhrasesToTrain = async (
  user_id: number,
  languageLearning: string,
  languageNative: string,
  trx = connection,
) => {
  return await trx('user_phrases')
    .where({
      user_id,
      language: languageLearning,
      translation_language: languageNative,
    })
    .orderBy('proficiency', 'desc')
    .limit(10)
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
