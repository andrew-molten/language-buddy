export interface JournalEntryCheck {
  journalEntry: string
  nativeLanguage: string
  learningLanguage: string
}

export interface LearningLanguageSentence {
  learningLanguageSentence: string
  nativeLanguageSentence: string
  explanations: string[]
}

export interface NativeLanguageSentence {
  nativeLanguageSentence: string
  translatedSentence: string
  explanations: string[]
}
