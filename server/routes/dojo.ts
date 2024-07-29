import express from 'express'
import * as dojoQueries from '../db/functions/dojoQueries.ts'
import checkJwt, { JwtRequest } from '../auth0.ts'
import { getUserIdByAuthId } from '../db/functions/user.ts'

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
      await dojoQueries.trimAllPhrases()
      const userId = await getUserIdByAuthId(authId)
      const languageLearning = req.params.languageLearning
      const languageNative = req.params.languageNative
      const phrases = await dojoQueries.getLowestProficiencyPhrasesToTrain(
        userId,
        languageLearning,
        languageNative,
      )
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

export default router
