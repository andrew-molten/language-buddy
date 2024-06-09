import express from 'express'
import * as queries from '../db/queries.ts'

const router = express.Router()

// router.get('/')

router.get('/:id', async (req, res) => {
  console.log('storyHistory')
  try {
    const id = Number(req.params.id)
    // const id = 1
    console.log('id: ', id)
    const result = await queries.getAllStoriesByUserId(id)
    console.log(result)
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
