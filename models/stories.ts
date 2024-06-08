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

export interface Stories {
  englishStory: string
  germanStory: string
}

export interface Message {
  message: { content: string; role: string }
}

export interface BackendStory extends CheckedStory {
  story_one: string
  story_two: string
  wordsToAdd: NewWord[]
  language_native: string
  language_learning: string
}
