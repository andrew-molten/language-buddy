import express from 'express'
import request from 'superagent'
import { JwtRequest } from '../auth0.ts'
import checkJwt from '../auth0.ts'
import 'dotenv/config'
import { JournalEntryCheck } from '../../models/journal.ts'

const router = express.Router()

const apiKey = process.env.API_KEY
// Don't include any new line notation, t

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub
  try {
    if (apiKey === undefined) {
      throw new Error('missing apiKey from environment variables..')
    }

    if (!authId) {
      console.log('No auth0Id')
      return res.status(401).send('unauthorized')
    }

    const gptModels = {
      gpt35: 'gpt-3.5-turbo-0613',
      gpt4: 'gpt-4o-2024-08-06',
    }

    const {
      journalEntry,
      nativeLanguage,
      learningLanguage,
    }: JournalEntryCheck = req.body

    const response = await request
      .post('https://api.openai.com/v1/chat/completions')
      .set('Authorization', `Bearer ${apiKey}`)
      .send({
        model: gptModels.gpt4,
        messages: [
          {
            role: 'user',
            content: `
    Here is a journal entry, I've tried my best to write it in ${learningLanguage} which I am learning so defaulted to ${nativeLanguage} (my native language) when needed. Please analyze it and give me a correct translation in both languages, and some feedback.

    Journal entry: ${journalEntry}`,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'journal_entry_check',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                correctJournalEntryLearning: {
                  type: 'string',
                  description: `the journal entry in correct ${learningLanguage}`,
                },
                correctJournalEntryNative: {
                  type: 'string',
                  description: `the journal entry in correct ${nativeLanguage}`,
                },
                learningLanguageSentences: {
                  type: 'array',
                  description: `A list of my corrected & translated ${learningLanguage} sentences.`,
                  items: {
                    type: 'object',
                    properties: {
                      learningLanguageSentence: {
                        type: 'string',
                        description: `sentence in ${learningLanguage} with correct grammar`,
                      },
                      nativeLanguageSentence: {
                        type: 'string',
                        description: `the translation in ${nativeLanguage}`,
                      },
                      explanations: {
                        type: 'array',
                        description: `A list of explanations if my grammar was incorrect, about why I was wrong, and a grammar lesson to help me. Use single quotation marks to reference any words or parts of sentences`,
                        items: { type: 'string' },
                      },
                    },
                    required: [
                      'learningLanguageSentence',
                      'nativeLanguageSentence',
                      'explanations',
                    ],
                    additionalProperties: false,
                  },
                },
                nativeLanguageSentences: {
                  type: 'array',
                  description: `A list of my translated ${nativeLanguage} sentences.`,
                  items: {
                    type: 'object',
                    properties: {
                      translatedSentence: {
                        type: 'string',
                        description: `sentence translated into ${learningLanguage}`,
                      },
                      nativeLanguageSentence: {
                        type: 'string',
                        description: `My original ${nativeLanguage} sentence`,
                      },
                      explanations: {
                        type: 'array',
                        description: `A list of helpul explanations or tips about the translations to help me remember how to say that next time.`,
                        items: { type: 'string' },
                      },
                    },
                    required: [
                      'translatedSentence',
                      'nativeLanguageSentence',
                      'explanations',
                    ],
                    additionalProperties: false,
                  },
                },
                wordsToAddToVocabulary: {
                  type: 'array',
                  description:
                    'A list of words that I need to learn to use based on what I wrote. Do not include any words I used correctly. Leave array empty if there are none to add',
                  items: {
                    type: 'object',
                    properties: {
                      word: {
                        type: 'string',
                        description: `is in ${learningLanguage}`,
                      },
                      // Will need to give more accurate gender definition later
                      gender: {
                        type: 'string',
                        description:
                          "gender is only for nouns, otherwise value should be ''",
                      },
                      definition: {
                        type: 'string',
                        description: `is in ${nativeLanguage}`,
                      },
                      grammaticalForm: {
                        type: 'string',
                        description: `is in ${nativeLanguage} & indicates the grammatical form of a word if not a lemma, e.g. past participle, second person singular, plural etc. otherwise return ""`,
                      },
                      lemma: {
                        type: 'string',
                        description: `is in ${learningLanguage}`,
                      },
                      lemmaDefinition: { type: 'string' },
                    },
                    required: [
                      'word',
                      'gender',
                      'definition',
                      'grammaticalForm',
                      'lemma',
                      'lemmaDefinition',
                    ],

                    additionalProperties: false,
                  },
                },

                shortSummary: {
                  type: 'string',
                  description: `A short summary of how well I did in ${nativeLanguage}`,
                },
              },
              required: [
                'correctJournalEntryLearning',
                'correctJournalEntryNative',
                'learningLanguageSentences',
                'nativeLanguageSentences',
                'wordsToAddToVocabulary',
                'shortSummary',
              ],

              additionalProperties: false,
            },
          },
        },
      })

    // const tokenUsage = response.body.usage
    // const messageContent = response.body.choices[0].message.content
    // // console.log('messageContent: ', messageContent)
    // const preprocessedResponse = preprocessResponse(messageContent)
    // const parsedContent = JSON.parse(preprocessedResponse)
    console.log(response.body.choices[0].message.content)
    res.json(response.body)
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
