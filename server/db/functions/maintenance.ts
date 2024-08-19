import { PhraseCorrectionWithId } from '../../../models/stories.ts'
import connection from '../connection.ts'
const db = connection

export const trimAllPhrases = async () => {
  return await db('phrases')
    .update({
      phrase: db.raw('TRIM(phrase)'),
    })
    .then(() => {
      console.log('Phrases updated successfully')
    })
    .catch((err) => {
      console.error('Error updating phrases:', err)
    })
}

export const extractExplanations = async () => {
  // get the corrections from story_history
  const corrections = await db('story_history').select(
    'corrections',
    'language_native',
  )
  const parsed = corrections.flatMap((element) => {
    const correctionArr = JSON.parse(element.corrections)
    correctionArr.forEach(
      (phrase: PhraseCorrectionWithId) =>
        (phrase.language = element.language_native),
    )
    return correctionArr
  })

  const justPhraseArr = parsed.map(
    (correction) => correction.sentenceCorrection,
  )
  const phraseIds = await findPhraseIds(justPhraseArr)
  const correctionsAndIds = phraseIds.map((phrase) => {
    const object = parsed.find((corrections) => {
      return corrections.sentenceCorrection === phrase.phrase
    })
    object.id = phrase.id
    return object
  })
  await insertExplanations(correctionsAndIds)
}

export const findPhraseIds = async (phrases: string[]) => {
  return await db('phrases').select('id', 'phrase').whereIn('phrase', phrases)
}

export const insertExplanations = async (
  corrections: PhraseCorrectionWithId[],
) => {
  await db.transaction(async (trx) => {
    const explanationsFromDB = await trx('explanations').select()
    if (explanationsFromDB.length > 0 || corrections.length < 1) return
    // add all explanations for each phrase
    for (const correction of corrections) {
      const insertedExplanations = await trx('explanations')
        .insert(
          correction.explanations.map((explanation) => ({
            explanation,
            language: correction.language,
          })),
        )
        .returning('id')

      await trx('explanations_phrases').insert(
        insertedExplanations.map((explanation) => ({
          explanation_id: explanation.id,
          phrase_id: correction.id,
        })),
      )
    }
  })
}
