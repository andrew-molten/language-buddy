import express from 'express'
import request from 'superagent'
import 'dotenv/config'

const router = express.Router()

const apiKey = process.env.API_KEY

router.post('/', async (req, res) => {
  try {
    if (apiKey === undefined) {
      throw new Error('missing apiKey from environment variables..')
    }
    const gpt35 = 'gpt-3.5-turbo-0613'
    // const gpt4 = 'gpt-4o'

    // Just need to figure out how to send these 2 stories to the server and then use them here`
    console.log(req.body)
    // englishStory: string,
    // germanStory: string,

    // const response = await request
    //   .post('https://api.openai.com/v1/chat/completions')
    //   .set('Authorization', `Bearer ${apiKey}`)
    //   .send({
    //     model: gpt35,
    //     messages: [
    //       {
    //         role: 'user',
    //         content: `
    // I am going to give you 2 stories, one in English, and one in German, I'm not very good at speaking german so please can you tell me what I could improve in my German story so that it translates to the english story.

    // Don't include any new line notation, the response MUST be JSON formatted like this so that it is easy to parse: '{translatedGermanStory: "string", corrections: Correction[], wordsToAddToVocabulary: NewWord[]}'

    // interface Correction {
    // original: "string",
    // correction: "string"
    // }

    // interface NewWord {
    // word: "string",
    // meaning: "string",
    // }

    // English story:
    // ${englishStory}

    // German story: ${germanStory}`,
    //       },
    //     ],
    //     // max_tokens: 300, //having the max tokens can cause it to stop writing mid json.
    //   })

    // return response.body
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send((err as Error).message)
    } else {
      res.status(500).send('Something went wrong')
    }
  }
})

export default router
