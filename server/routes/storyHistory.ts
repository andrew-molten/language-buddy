import express from 'express'
import * as queries from '../db/functions/queries.ts'
import * as maintenance from '../db/functions/maintenance.ts'
import { JwtRequest } from '../auth0.ts'
import checkJwt from '../auth0.ts'
import { getUserIdByAuthId } from '../db/functions/user.ts'

const router = express.Router()

router.get('/', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub

  if (!authId) {
    return res.status(401).send('unauthorized')
  }

  try {
    const userId = await getUserIdByAuthId(authId)
    const result = await queries.getAllStoriesByUserId(userId)
    res.json(result)
    await maintenance.extractExplanations()
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
