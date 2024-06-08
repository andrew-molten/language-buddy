import express from 'express'
import request from 'superagent'
import 'dotenv/config'
import type { NewWord, Stories } from '../../models/stories'
import * as storyProcessor from '../db/storyProcessor'

const router = express.Router()

const apiKey = process.env.API_KEY

router.post('/', async (req, res) => {
  try {
    if (apiKey === undefined) {
      throw new Error('missing apiKey from environment variables..')
    }

    const gptModels = {
      gpt35: 'gpt-3.5-turbo-0613',
      gpt4: 'gpt-4o',
    }

    // create a preference for spelling accuracy

    const { englishStory, germanStory }: Stories = req.body
    const response = await request
      .post('https://api.openai.com/v1/chat/completions')
      .set('Authorization', `Bearer ${apiKey}`)
      .send({
        model: gptModels.gpt4,
        messages: [
          {
            role: 'user',
            content: `
    I'm going to give you 2 stories, one in English, and one in German. I'm learning german so please tell me how to improve my German story so that it translates to the english story.

    Don't include any new line notation, the response MUST be JSON formatted like this so that it is easy to parse: '{translatedGermanStory: "string", corrections: PhraseCorrection[], wordsToAddToVocabulary: NewWord[], wellUsedWords: Word[]}'

    interface PhraseCorrection {
      germanSentenceCorrection: "string"
      translation: "string",
      }
 
    interface NewWord {
    word: "string",
    definition: "string",
    grammaticalForm: "string",
    lemma: "string",
    lemmaDefinition: "string"
    }

    interface Word {
      word: "string"
      lemma: "string"
    }

    grammaticalForm should indicate the grammatical form of a word if not a lemma, e.g. past participle, second person singular, plural etc.

    wellUsedWords has a max length of 5 & only returns words that were used perfectly in the german story, return more complex words first, don't return names of people or places.

    English story:
    ${englishStory}

    German story: ${germanStory}`,
          },
        ],
        // max_tokens: 300, //having the max tokens can cause it to stop writing mid json.
      })
    const messageContent = response.body.choices[0].message.content
    const parsedContent = JSON.parse(messageContent)
    const data = {
      ...parsedContent,
      story_one: englishStory,
      story_two: germanStory,
      language_native: 'English',
      language_learning: 'German',
    }
    console.log(data)
    res.json(response.body)
    const wordsToAdd = await checkWords(data.wordsToAddToVocabulary)
    data.wordsToAdd = wordsToAdd
    storyProcessor.saveStory(data)
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

const checkWords = async (newWords: NewWord[]) => {
  const lemmaArr: string[] = newWords.map((newWord) => newWord.lemma)
  console.log('lemmaArr: ', lemmaArr)
  // check for lemma
  const existingWords = await storyProcessor.checkWordsInVocab(lemmaArr)

  console.log('existingWords: ', existingWords)

  const existingWordsStrings = existingWords.map((word) => word.word)

  const wordsToAdd = newWords.filter(
    (newWord) => !existingWordsStrings.includes(newWord.lemma),
  )
  console.log('wordsToAdd: ', wordsToAdd)
  // need to check for word form
  return wordsToAdd
}

export default router

// const promptAttemptOne = `
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

// German story: ${germanStory}`
