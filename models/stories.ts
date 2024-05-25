export interface CheckedStory {
  translatedGermanStory: string
  corrections: Correction[]
  wordsToAddToVocabulary: NewWord[]
}

export interface Correction {
  original: 'string'
  correction: 'string'
}

export interface NewWord {
  word: 'string'
  meaning: 'string'
}

export interface Stories {
  englishStory: string
  germanStory: string
}
