import express from 'express'
import * as dojoQueries from '../db/functions/dojoQueries.ts'

const router = express.Router()

router.get('/:userid/:languageLearning/:languageNative', async (req, res) => {
  try {
    const userid = Number(req.params.userid)
    const languageLearning = req.params.languageLearning
    const languageNative = req.params.languageNative
    const phrases = await dojoQueries.getLowestProficiencyPhrasesToTrain(
      userid,
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
})

export default router
