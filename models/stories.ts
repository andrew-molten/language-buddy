export interface CheckedStory {
  translatedGermanStory: string
  corrections: PhraseCorrection[]
  wordsToAddToVocabulary: NewWord[]
  wellUsedWords: Word[]
}

export interface PhraseCorrection {
  germanSentenceCorrection: 'string'
  translation: 'string'
}

export interface NewWord {
  word: string
  definition: string
  grammaticalForm: string
  lemma: string
  lemmaDefinition: string
}

export interface Word {
  word: string
}

export interface Id {
  id: number
}

export interface Stories {
  englishStory: string
  germanStory: string
}

export interface Message {
  message: { content: string; role: string }
}

export interface Lemma {
  id: number
  word: string
  language: string
}

export interface LemmasData {
  lemmasToAdd: NewWord[]
  existingLemmas: Lemma[]
}

export interface WordsData {
  wordsToAdd: WordToAdd[]
  existingWords: DBWord[]
}
// export interface UsersVocabData {
//   usersWordsToAdd: WordToAdd[]
//   usersNewWordIds: number[]
// }

export interface WordToAdd extends NewWord {
  lemma_id?: number | null
}

export interface DBWord {
  id: number
  lemma_id: number
  word: string
  grammatical_form: string
}

export interface BackendCheckedStory extends CheckedStory {
  story_one: string
  story_two: string
  language_native: string
  language_learning: string
  user_id: number
}

export interface BackendStory extends BackendCheckedStory {
  lemmasData: LemmasData
  wordsData: WordsData
  usersNewWordIds: Id[]
}
