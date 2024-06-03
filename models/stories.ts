export interface CheckedStory {
  translatedGermanStory: string
  corrections: PhraseCorrection[]
  wordsToAddToVocabulary: NewWord[]
  wellUsedWords: Word[]
}

export interface PhraseCorrection {
  germanSentence: 'string'
  translation: 'string'
}

export interface NewWord {
  word: string
  meaning: string
  wordForm: string
  lemma: string
}

export interface Word {
  word: string
}

export interface Stories {
  englishStory: string
  germanStory: string
}

export interface Message {
  message: { content: string; role: string }
}
