import express from 'express'
import { JwtRequest } from '../auth0.ts'
import checkJwt from '../auth0.ts'
import {
  checkUserName,
  createUser,
  getUserByAuthId,
} from '../db/functions/user.ts'
import { NewUser } from '../../models/admin.ts'

const router = express.Router()

router.get('/', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub

  if (!authId) {
    console.log('No auth0Id')
    return res.status(401).send('unauthorized')
  }

  try {
    const user = await getUserByAuthId(authId)
    res.json(user)
  } catch (err) {
    if (err instanceof Error) {
      console.log('error: ', err)
      res.status(500).send('Something went wrong')
    } else {
      console.log('error: ', err)
      res.status(500).send('Something went wrong')
    }
  }
})

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub
  const newUser: NewUser = req.body

  // TODO: double check that all of the newUser fields have length

  if (!authId) {
    console.log('No auth0Id')
    return res.status(401).send('unauthorized')
  }

  try {
    const usernameExists = await checkUserName(newUser.username)
    if (usernameExists) {
      return res.status(409).json({ error: 'Username already exists' })
    }

    const userId = await createUser(newUser, authId)
    res.json(userId)
  } catch (err) {
    if (err instanceof Error) {
      console.log('error: ', err)
      res.status(500).send('Something went wrong')
    } else {
      console.log('error: ', err)
      res.status(500).send('Something went wrong')
    }
  }
})

export default router
