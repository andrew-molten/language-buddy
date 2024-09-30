import express from 'express'
import request from 'superagent'
import { JwtRequest } from '../auth0.ts'
import checkJwt from '../auth0.ts'
import 'dotenv/config'
import type {
  BackendCheckedStory,
  BackendStory,
  CheckedStory,
  DBPhrase,
  DBWord,
  DBWordPhraseAssociation,
  Id,
  Lemma,
  NewWord,
  PhraseCorrection,
  Stories,
  TokenUsage,
  WordToAdd,
} from '../../models/stories'
import * as storyProcessor from '../db/functions/storyProcessor'
import * as processingQueries from '../db/functions/processingQueries'
import { getUserIdByAuthId } from '../db/functions/user'

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
      nativeStory,
      learningLanguageStory,
      nativeLanguage,
      learningLanguage,
    }: Stories = req.body
    // const learningLanguage = 'German'
    // const nativeLanguage = 'English'
    const response = await request
      .post('https://api.openai.com/v1/chat/completions')
      .set('Authorization', `Bearer ${apiKey}`)
      .send({
        model: gptModels.gpt4,
        messages: [
          {
            role: 'user',
            content: `
    I'm going to give you 2 stories, one in ${nativeLanguage}, and one in ${learningLanguage}. I'm learning ${learningLanguage} so please tell me how to improve my ${learningLanguage} story so that it translates to the ${nativeLanguage} story.

    ${nativeLanguage} story:
    ${nativeStory}

    ${learningLanguage} story: ${learningLanguageStory}`,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'translated_story',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                correctTranslatedStory: {
                  type: 'string',
                  description: `The correct translation in ${learningLanguage}`,
                },
                corrections: {
                  type: 'array',
                  description:
                    'A list of sentences that needed to be corrected, or were not even attempted, do not include sentences that I translated correctly',
                  items: {
                    type: 'object',
                    properties: {
                      sentenceCorrection: {
                        type: 'string',
                        description: `corrected sentence in ${learningLanguage}`,
                      },
                      translation: {
                        type: 'string',
                        description: `the translation in ${nativeLanguage}`,
                      },
                      explanations: {
                        type: 'array',
                        description: `A list of explanations about why I was wrong, and why the translation is correct, including any grammar lessons. Use single quotation marks to reference any words or parts of sentences`,
                        items: { type: 'string' },
                      },
                    },
                    required: [
                      'sentenceCorrection',
                      'translation',
                      'explanations',
                    ],
                    additionalProperties: false,
                  },
                },
                wordsToAddToVocabulary: {
                  type: 'array',
                  description:
                    'A list of words that I should have used or used incorrectly. This list does not include any words that were used correctly',
                  items: {
                    type: 'object',
                    properties: {
                      word: {
                        type: 'string',
                        description: `is in ${learningLanguage}`,
                      },
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
                'correctTranslatedStory',
                'corrections',
                'wordsToAddToVocabulary',
                'shortSummary',
              ],

              additionalProperties: false,
            },
          },
        },
      })

    // wellUsedWords: {
    //   type: 'array',
    //   description: `a list of words that I used perfectly in my ${learningLanguage} story, especially complex words, don't return names of people or places.`,
    //   items: {
    //     type: 'object',
    //     properties: {
    //       word: { type: 'string' },
    //       lemma: { type: 'string' },
    //     },
    //     required: ['word', 'lemma'],

    //     additionalProperties: false,
    //   },
    // },
    const tokenUsage = response.body.usage
    // console.log(tokenUsage)
    // console.log('response.body: ', response.body)
    const messageContent = response.body.choices[0].message.content
    // console.log('messageContent: ', messageContent)
    const preprocessedResponse = preprocessResponse(messageContent)
    const parsedContent = JSON.parse(preprocessedResponse)
    res.json(response.body)
    saveToDB(
      parsedContent,
      nativeStory,
      learningLanguageStory,
      nativeLanguage,
      learningLanguage,
      authId,
      tokenUsage,
    )
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

const preprocessResponse = (response: string): string => {
  // Remove any triple backticks and newlines associated with code blocks
  return response.replace(/^```json\s*|\s*```$/g, '')
}

const saveToDB = async (
  parsedContent: CheckedStory,
  story_one: string,
  story_two: string,
  nativeLanguage: string,
  learningLanguage: string,
  authId: string,
  tokenUsage: TokenUsage,
) => {
  const userId = await getUserIdByAuthId(authId)
  console.log('userId: ', userId)
  const data: BackendCheckedStory = {
    ...parsedContent,
    story_one,
    story_two,
    language_native: nativeLanguage,
    language_learning: learningLanguage,
    user_id: userId,
    date_added: addDate(),
    token_usage: tokenUsage,
  }
  const lemmasData = await checkLemmas(data.wordsToAddToVocabulary)
  const wordsData = await checkWords(
    data.wordsToAddToVocabulary,
    lemmasData.existingLemmas,
  )
  const usersNewWordIds = await checkUserVocab(
    wordsData.existingWords,
    data.user_id,
  )

  const definitionsToAdd = await checkDefinitionsExist(
    wordsData.existingWords,
    data.wordsToAddToVocabulary,
  )
  const phraseData = await checkPhrases(data.corrections)

  const usersNewPhraseIds = await checkUsersPhrases(
    phraseData.existingPhrases,
    data.user_id,
  )

  const dataToSend: BackendStory = {
    ...data,
    lemmasData,
    wordsData,
    usersNewWordIds,
    definitionsToAdd,
    phraseData,
    usersNewPhraseIds,
  }

  await storyProcessor.saveStory(dataToSend)
  getWordPhraseAssociations(data.wordsToAddToVocabulary, data.user_id)
}

// CHECK IF PHRASE CONTAINS WORD
// run after storyProcessor, to make code easier.
const getWordPhraseAssociations = async (words: NewWord[], userId: number) => {
  const wordsArr = getStringArray(words, 'word')
  // get the id's of all the wordsToaddToVocabulary
  const wordsWithIds = await processingQueries.getMatchingWords(wordsArr)

  // const wordPhraseAssociations: WordPhraseAssociation[] = []
  // const existingWordPhraseAssociations = []

  wordsWithIds.forEach(async (wordObj) => {
    const phrases = await processingQueries.checkWordInPhrases(
      wordObj.word,
      userId,
    )
    const phraseIdArr = phrases.map((phrase) => phrase.id)
    const wordId = wordObj.id
    const wordPhraseAssociations = { wordId, phraseIdArr }
    const existingAssociations: DBWordPhraseAssociation[] =
      await processingQueries.checkWordPhraseAssociations(
        wordPhraseAssociations,
      )
    // filter existingAssociations out of wordPhraseAssociations
    const associationPhrasesToAdd = wordPhraseAssociations.phraseIdArr.filter(
      (phraseId) =>
        !existingAssociations.find(
          (existing) => existing.phrase_id === phraseId,
        ),
    )

    // add associations
    if (associationPhrasesToAdd.length > 0) {
      storyProcessor.insertWordPhraseAssociations({
        wordId,
        phraseIdArr: associationPhrasesToAdd,
      })
    }
    // console.log('existingAssociations', existingAssociations)
  })
}

const checkUsersPhrases = async (
  existingPhrases: DBPhrase[],
  userId: number,
) => {
  const existingPhraseIds = existingPhrases.map((phrase) => phrase.id)
  const usersExistingPhrases = await processingQueries.checkUserPhrases(
    existingPhraseIds,
    userId,
  )
  const usersExistingNumArr = usersExistingPhrases.map(
    (phrase) => phrase.phrase_id,
  )
  const usersNewExistingPhrase = existingPhrases.filter(
    (phrase) => !usersExistingNumArr.includes(phrase.id),
  )
  return usersNewExistingPhrase
}

const checkPhrases = async (phrases: PhraseCorrection[]) => {
  const phraseStringArr = phrases.map((correction) =>
    correction.sentenceCorrection.trim(),
  )
  const existingPhrases =
    await processingQueries.checkPhrasesExists(phraseStringArr)
  const existingPhraseStrings = existingPhrases.map((phrase) =>
    phrase.phrase.trim(),
  )
  const phrasesToAdd = phrases
    .filter(
      (phrase) =>
        !existingPhraseStrings.includes(phrase.sentenceCorrection.trim()),
    )
    .map((phrase) => {
      return { ...phrase, sentenceCorrection: phrase.sentenceCorrection.trim() }
    })
  return { phrasesToAdd, existingPhrases }
}
// some existing phrases might get some extra explanations here or might have some that already exist.

// some phrasesToAdd might have explanations that already exist.

// need a function to check each phrase as a string if it exists - flat map explanations

const checkLemmas = async (newWords: NewWord[]) => {
  const lemmaArr: string[] = getStringArray(newWords, 'lemma')
  const existingLemmas = await processingQueries.checkLemmas(lemmaArr)
  const existingLemmaStrings = getStringArray(existingLemmas, 'word')
  const lemmasToAdd = newWords.filter(
    (newWord) => !existingLemmaStrings.includes(newWord.lemma),
  )
  return { lemmasToAdd, existingLemmas }
}

function getStringArray(wordObjArray: NewWord[], property: keyof NewWord) {
  return wordObjArray.map((wordObj) => wordObj[property])
}

const checkWords = async (newWords: NewWord[], existingLemmas: Lemma[]) => {
  const stringArr: string[] = getStringArray(newWords, 'word')
  const existingWords = await processingQueries.getMatchingWords(stringArr)
  const existingWordStrings = getStringArray(existingWords, 'word')
  const actualNewWords = newWords.filter(
    (newWord) => !existingWordStrings.includes(newWord.word),
  )
  const wordsToAdd = giveWordsLemmaIDs(actualNewWords, existingLemmas)

  return { wordsToAdd, existingWords }
}

const giveWordsLemmaIDs = (wordsToAdd: NewWord[], existingLemmas: Lemma[]) => {
  const formattedWordsToAdd = wordsToAdd.map((word) => {
    const lemma = existingLemmas.find((lemma) => lemma.word === word.lemma)
    const grammaticalForm =
      word.word === lemma?.word ? 'lemma' : word.grammaticalForm
    return {
      ...word,
      lemma_id: lemma && lemma.id ? lemma.id : null,
      grammaticalForm: grammaticalForm,
    }
  })
  return formattedWordsToAdd
}

const checkUserVocab = async (existingWords: DBWord[], userId: number) => {
  let usersNewWordIds: Id[] = []
  if (existingWords.length > 0) {
    const wordIds = existingWords.map((word) => word.id)
    const usersExistingWordIds = await processingQueries.checkWordsInUserVocab(
      wordIds,
      userId,
    )
    const existingIdsNumArr = usersExistingWordIds.map((id) => id.word_id)
    const idsToAdd = wordIds.filter((id) => !existingIdsNumArr.includes(id))
    usersNewWordIds = idsToAdd.map((id: number) => {
      return { id: id }
    })
  }
  return usersNewWordIds
}

const checkDefinitionsExist = async (
  existingWords: DBWord[],
  wordsToAdd: WordToAdd[],
) => {
  const definitionsAndIds = existingWords.map((existing) => {
    const sameWord = wordsToAdd.find((toAdd) => existing.word === toAdd.word)
    return {
      ...existing,
      definition: sameWord ? sameWord.definition : '',
      word_id: existing.id,
    }
  })
  const existingDefinitions =
    await processingQueries.checkDefinitionsExist(definitionsAndIds)
  const idsOfExistingDefinitions = existingDefinitions.map(
    (word) => word.word_id,
  )
  const definitionsToAdd = definitionsAndIds.filter(
    (obj) => !idsOfExistingDefinitions.includes(obj.id),
  )
  return definitionsToAdd
}

function addDate() {
  const today = new Date()
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return todayString
}

export default router
