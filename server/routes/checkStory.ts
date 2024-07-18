import express from 'express'
import request from 'superagent'
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
  WordToAdd,
} from '../../models/stories'
import * as storyProcessor from '../db/functions/storyProcessor'
import * as processingQueries from '../db/functions/processingQueries'

const router = express.Router()

const apiKey = process.env.API_KEY
// Don't include any new line notation, t

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
    const languageLearning = 'German'
    const languageNative = 'English'
    const response = await request
      .post('https://api.openai.com/v1/chat/completions')
      .set('Authorization', `Bearer ${apiKey}`)
      .send({
        model: gptModels.gpt4,
        messages: [
          {
            role: 'user',
            content: `
    I'm going to give you 2 stories, one in ${languageNative}, and one in ${languageLearning}. I'm learning ${languageLearning} so please tell me how to improve my ${languageLearning} story so that it translates to the ${languageNative} story.

    The response MUST be JSON formatted like this so that it is easy to parse: '{translatedGermanStory: "string", corrections: PhraseCorrection[], wordsToAddToVocabulary: NewWord[], wellUsedWords: Word[]}'

    interface PhraseCorrection {
      sentenceCorrection: "string",
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

    sentenceCorrection is in ${languageLearning}
    translation is in ${languageNative}

    grammaticalForm should indicate the grammatical form of a word if not a lemma, e.g. past participle, second person singular, plural etc.

    wellUsedWords has a max length of 5 & only returns words that were used perfectly in the ${languageLearning} story, return more complex words first, don't return names of people or places.

    ${languageNative} story:
    ${englishStory}

    ${languageLearning} story: ${germanStory}`,
          },
        ],
        // max_tokens: 300, //having the max tokens can cause it to stop writing mid json.
      })

    const messageContent = response.body.choices[0].message.content
    const preprocessedResponse = preprocessResponse(messageContent)
    const parsedContent = JSON.parse(preprocessedResponse)
    res.json(response.body)
    saveToDB(parsedContent, englishStory, germanStory)
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
) => {
  const data: BackendCheckedStory = {
    ...parsedContent,
    story_one,
    story_two,
    language_native: 'English',
    language_learning: 'German',
    user_id: 1,
    date_added: addDate(),
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

  console.log(dataToSend)
  await storyProcessor.saveStory(dataToSend)
  // run getWordPhraseAssociations etc. here
  getWordPhraseAssociations(data.wordsToAddToVocabulary)
}

// CHECK IF PHRASE CONTAINS WORD
// run after storyProcessor, to make code easier.
const getWordPhraseAssociations = async (words: NewWord[]) => {
  const wordsArr = getStringArray(words, 'word')
  // get the id's of all the wordsToaddToVocabulary
  const wordsWithIds = await processingQueries.getMatchingWords(wordsArr)

  // const wordPhraseAssociations: WordPhraseAssociation[] = []
  // const existingWordPhraseAssociations = []

  wordsWithIds.forEach(async (wordObj) => {
    const phrases = await processingQueries.checkWordInPhrases(wordObj.word)
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

    if (associationPhrasesToAdd.length > 0) {
      storyProcessor.insertWordPhraseAssociations({
        wordId,
        phraseIdArr: associationPhrasesToAdd,
      })
    }
    console.log('existingAssociations', existingAssociations)
  })

  // add associations
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
  const phraseStringArr = phrases.map(
    (correction) => correction.sentenceCorrection,
  )
  const existingPhrases =
    await processingQueries.checkPhrasesExists(phraseStringArr)
  const existingPhraseStrings = existingPhrases.map((phrase) => phrase.phrase)
  const phrasesToAdd = phrases.filter(
    (phrase) => !existingPhraseStrings.includes(phrase.sentenceCorrection),
  )
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
