import express from 'express'
import * as dojoQueries from '../db/functions/dojoQueries.ts'
import checkJwt, { JwtRequest } from '../auth0.ts'
import { getUserIdByAuthId } from '../db/functions/user.ts'
import { PracticePhrase } from '../../models/stories.ts'

const router = express.Router()

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
      selectPhrases(phrases)
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
function selectPhrases(phrases: PracticePhrase[]) {
  // if proficiency > 10 put into highProficiency array
  // <= 10 && >5 = mediumProficiency
  // <5 = lowProficiency

  // randomly select 1 from 10, 5 from medium, & 4 from low - (if any have -proficiency pick them) otherwise the highest proficiency from low

  // if the array does not make up 10 repeat algorithm until it does
  // or check each array and add as many as possible starting with medium, low then high

  // return array
  console.log(phrases)
}

export default router
