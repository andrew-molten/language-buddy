export interface PhraseProficiency {
  points: number
  passed: boolean
}

export interface ProgressState {
  currentWord: number
  lessonsNeedRetry: boolean
  attemptedAll: boolean
  failedLessons: number[]
  proficiencyChange: PhraseProficiency[]
}
