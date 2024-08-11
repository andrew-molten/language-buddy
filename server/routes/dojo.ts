import express from 'express'
import * as dojoQueries from '../db/functions/dojoQueries.ts'
import checkJwt, { JwtRequest } from '../auth0.ts'
import { getUserIdByAuthId } from '../db/functions/user.ts'
import { popAndPushPhrase, shuffleArr } from '../helperFunctions/helper.ts'
import { Phrase } from '../../models/dojo.ts'

const router = express.Router()

// GET DOJO PHRASES
router.get(
  '/:languageLearning/:languageNative',
  checkJwt,
  async (req: JwtRequest, res) => {
    const authId = req.auth?.sub

    if (!authId) {
      console.log('no authId')
      return res.status(401).send('unauthorized')
    }

    try {
      const userId = await getUserIdByAuthId(authId)
      const languageLearning = req.params.languageLearning
      const languageNative = req.params.languageNative
      const phrases = await selectPhrases(
        userId,
        languageLearning,
        languageNative,
      )
      await selectPhrases(userId, languageLearning, languageNative)
      res.json(phrases)
    } catch (err) {
      if (err instanceof Error) {
        console.log('error: ', err)
        res.status(500).send((err as Error).message)
      } else {
        console.log('error: ', err)
        res.status(500).send('Something went wrong')
      }
    }
  },
)

// UPDATE DOJO PHRASES
router.patch('/', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub

  if (!authId) {
    console.log('no authId')
    return res.status(401).send('unauthorized')
  }

  try {
    const phrasesToUpdate = req.body
    const userId = await getUserIdByAuthId(authId)
    await dojoQueries.updatePhraseProficiency(phrasesToUpdate, userId)
    res.status(200).send('Successfully updated')
  } catch (err) {
    if (err instanceof Error) {
      console.log('error: ', err)
      res.status(500).send((err as Error).message)
    } else {
      console.log('error: ', err)
      res.status(500).send('Something went wrong')
    }
  }
})

async function selectPhrases(
  userId: number,
  languageLearning: string,
  languageNative: string,
) {
  // if proficiency > 10 put into highProficiency array
  const high = await dojoQueries.getPhrasesByProficiency(
    userId,
    languageLearning,
    languageNative,
    11,
    '>',
    11,
    '>',
  )
  // <= 10 && >5 = mediumProficiency
  const medium = await dojoQueries.getPhrasesByProficiency(
    userId,
    languageLearning,
    languageNative,
    11,
    '<=',
    5,
    '>',
  )
  // <=5 = lowProficiency
  const lowDB = await dojoQueries.getPhrasesByProficiency(
    userId,
    languageLearning,
    languageNative,
    5,
    '<=',
    5,
    '<=',
  )

  // randomly select 1 from high, 5 from medium, & 4 from low
  shuffleArr(high)
  shuffleArr(medium)
  const low = sortLow(lowDB)
  const phrases: Phrase[] = []
  let phraseCount = 10 // decreases every time a phrase is added
  phraseCount = popAndPushPhrase(high, phrases, 1, phraseCount)
  phraseCount = popAndPushPhrase(medium, phrases, 5, phraseCount)
  phraseCount = popAndPushPhrase(low, phrases, 4, phraseCount)
  // if that hasn't filled the quota:
  if (phraseCount > 0) {
    phraseCount = popAndPushPhrase(medium, phrases, phraseCount, phraseCount)
    phraseCount = popAndPushPhrase(low, phrases, phraseCount, phraseCount)
    popAndPushPhrase(high, phrases, phraseCount, phraseCount)
  }
  shuffleArr<Phrase>(phrases)

  return phrases
}

function sortLow(lowArr: Phrase[]) {
  lowArr.sort((a, b) => a.proficiency - b.proficiency)
  const isNonNegative = (phrase: Phrase) => phrase.proficiency > -1
  const firstNonNegativeIndex = lowArr.findIndex(isNonNegative)
  // put negative proficiency at end of []
  if (firstNonNegativeIndex > -1) {
    for (let i = 0; i < firstNonNegativeIndex; i++) {
      const phrase = lowArr[0]
      lowArr.push(phrase)
      lowArr.splice(0, 1)
    }
  }
  return lowArr
}

export default router
