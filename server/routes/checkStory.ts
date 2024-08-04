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
      gpt4: 'gpt-4o',
    }

    // create a preference for spelling accuracy

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

    The response MUST be JSON formatted like this so that it is easy to parse: '{correctTranslatedStory: "string", corrections: PhraseCorrection[], wordsToAddToVocabulary: NewWord[], wellUsedWords: Word[], shortSummary: string}'

    interface PhraseCorrection {
      sentenceCorrection: "string",
      translation: "string",
      explanations: "string[]"
      }
 
    interface NewWord {
    word: "string",
    gender: "string",
    definition: "string",
    grammaticalForm: "string",
    lemma: "string",
    lemmaDefinition: "string"
    }

    interface Word {
      word: "string"
      lemma: "string"
    }

    sentenceCorrection, correctTranslatedStory, lemma & word is in ${learningLanguage}
    grammaticalForm is in English
    everything else including definition & translation is in ${nativeLanguage}
    
    shortSummary is a shortSummary of how well I did.
    explanations is an array of explanations about why I was wrong, and why the translation is correct, including any grammar lessons.
    wordsToAddToVocabulary should only include words that I didn't use. 
    grammaticalForm should indicate the grammatical form of a word if not a lemma, e.g. past participle, second person singular, plural etc.
    gender is only for nouns, otherwise value should be "".

    wellUsedWords has a max length of 5 & only returns words that I used perfectly in my ${learningLanguage} story, return more complex words first, don't return names of people or places.

    ${nativeLanguage} story:
    ${nativeStory}

    ${learningLanguage} story: ${learningLanguageStory}`,
          },
        ],
        // max_tokens: 300, //having the max tokens can cause it to stop writing mid json.
      })
    const tokenUsage = response.body.usage
    console.log(tokenUsage)
    const messageContent = response.body.choices[0].message.content
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
    console.log('existingAssociations', existingAssociations)
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
