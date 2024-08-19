export interface PhraseProficiency {
  points: number
}

export interface ProgressState {
  lessonStarted: boolean
  currentSentence: number
  lessonsNeedRetry: boolean
  attemptedAll: boolean
  failedLessons: number[]
  proficiencyChange: PhraseProficiency[]
}

export interface PhraseToUpdate {
  id: number
  proficiency: number
}

export interface Phrase {
  userPhraseId: number
  userId: number
  phraseId: number
  proficiency: number
  phrase: string
  translation: string
  explanations?: string[]
}
