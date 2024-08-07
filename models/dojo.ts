export interface PhraseProficiency {
  points: number
}

export interface ProgressState {
  currentWord: number
  lessonsNeedRetry: boolean
  attemptedAll: boolean
  failedLessons: number[]
  proficiencyChange: PhraseProficiency[]
}
