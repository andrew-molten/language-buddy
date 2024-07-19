import express from 'express'
import * as queries from '../db/functions/queries.ts'
import { getUserIdByAuthId } from '../db/functions/user.ts'
import checkJwt, { JwtRequest } from '../auth0.ts'

const router = express.Router()

router.get('/', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub

  if (!authId) {
    console.log('No auth0Id')
    return res.status(401).send('unauthorized')
  }

  try {
    const userId = await getUserIdByAuthId(authId)
    const result = await queries.getVocabularyByUserId(userId)
    res.json(result)
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

export default router
