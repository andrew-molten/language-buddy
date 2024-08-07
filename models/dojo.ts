export interface PhraseProficiency {
  points: number
}

export interface ProgressState {
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
