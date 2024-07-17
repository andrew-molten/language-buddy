import express from 'express'
import { JwtRequest } from '../auth0.ts'
import checkJwt from '../auth0.ts'
import { getUserByAuthId } from '../db/functions/user.ts'

const router = express.Router()

router.get('/', checkJwt, async (req: JwtRequest, res) => {
  const auth0Id = req.auth?.sub

  if (!auth0Id) {
    console.log('No auth0Id')
    return res.status(401).send('unauthorized')
  }

  try {
    const user = getUserByAuthId(auth0Id)
    res.json(user)
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
