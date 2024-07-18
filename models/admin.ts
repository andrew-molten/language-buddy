export interface NewUser {
  email: string
  givenName: string
  familyName: string
  username: string
  birthdate: string
}

export interface RegistrationForm {
  username: string
  givenName: string
  familyName: string
  birthdate: string
}

export interface ConflictError extends Error {
  status: number
}