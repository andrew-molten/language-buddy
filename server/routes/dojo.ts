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
      const phrases = await dojoQueries.getLowestProficiencyPhrasesToTrain(
        userId,
        languageLearning,
        languageNative,
      )
      console.log('before')
      await selectPhrases(userId, languageLearning, languageNative)
      console.log('after')
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
    10,
    '>',
    10,
    '>',
  )
  // <= 10 && >5 = mediumProficiency
  const medium = await dojoQueries.getPhrasesByProficiency(
    userId,
    languageLearning,
    languageNative,
    10,
    '<=',
    5,
    '>',
  )
  // <5 = lowProficiency
  const low = await dojoQueries.getPhrasesByProficiency(
    userId,
    languageLearning,
    languageNative,
    5,
    '<',
    5,
    '<',
  )
  console.log(high)
  console.log(medium)
  console.log(low)

  // randomly select 1 from high, 5 from medium, & 4 from low - (if any have -proficiency pick them) otherwise the highest proficiency from low
  shuffleArr(high)
  shuffleArr(medium)
  const phrases: Phrase[] = []
  popAndPushPhrase(high, phrases)
  popAndPushPhrase(medium, phrases)
  popAndPushPhrase(low, phrases)

  console.log('Phrases: ', phrases)
  // if the array does not make up 10 repeat algorithm until it does
  // or check each array and add as many as possible starting with medium, low then high

  // return array
  // console.log(phrases)
}

export default router
