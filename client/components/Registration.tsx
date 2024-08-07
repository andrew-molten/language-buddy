import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import Select from 'react-select'
import FormField from './FormField'
import { ConflictError, NewUser } from '../../models/admin'
import { useCreateUser } from '../hooks/useUser'
import { learningLanguages } from '../data/languages'

function Registration() {
  const { user } = useAuth0()
  const createUser = useCreateUser()
  const [formState, setFormState] = useState({
    username: user?.nickname ? user.nickname : '',
    givenName: user?.given_name ? user?.given_name : '',
    familyName: user?.family_name ? user?.family_name : '',
    birthdate: '',
  })
  const [languageLearning, setLanguageLearning] = useState<{
    value: string
    label: string
  } | null>(null)
  const [languageNative, setLanguageNative] = useState<{
    value: string
    label: string
  } | null>(null)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormState({ ...formState, [event.target.name]: event.target.value })
    // console.log(event.target.value)
  }

  function checkStateValues() {
    if (
      formState.username.length > 0 &&
      formState.givenName.length > 0 &&
      formState.familyName.length > 0 &&
      formState.birthdate.length > 0 &&
      languageLearning !== null &&
      languageNative !== null
    ) {
      return true
    } else {
      return false
    }
  }

  function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (!checkStateValues()) return alert('Plese fill in all values')

    // create user object
    const newUser: NewUser = {
      email: user!.email!,
      givenName: formState.givenName,
      familyName: formState.familyName,
      username: formState.username,
      birthdate: formState.birthdate,
      learningLanguage: languageLearning!.value,
      nativeLanguage: languageNative!.value,
    }

    createUser.mutateAsync(newUser)
  }

  return (
    <div className=" page">
      <h2 className="page-heading">Registration</h2>
      <form>
        <FormField
          fieldName="givenName"
          labelName="Given Name"
          type="text"
          formState={formState}
          handleChange={handleChange}
        />
        <FormField
          fieldName="familyName"
          labelName="Family Name"
          type="text"
          formState={formState}
          handleChange={handleChange}
        />
        <FormField
          fieldName="username"
          labelName="Username"
          type="text"
          formState={formState}
          handleChange={handleChange}
        />
        {createUser.error &&
        (createUser.error as ConflictError).status === 409 ? (
          <p className="text-sm text-red-600">{`Sorry, that username already exists.`}</p>
        ) : (
          ''
        )}
        <FormField
          fieldName="birthdate"
          labelName="Birthdate"
          type="date"
          formState={formState}
          handleChange={handleChange}
        />
        <label htmlFor="languageLearning" className="mt-4 inline-block">
          What language are you learning?
        </label>
        <Select
          name="languageLearning"
          defaultValue={languageLearning}
          onChange={setLanguageLearning}
          options={learningLanguages}
          className="text-black"
        />
        <label
          htmlFor="languageNative"
          className="mt-4 inline-block"
        >{`What's your native language?`}</label>
        <Select
          name="languageNative"
          defaultValue={languageNative}
          onChange={setLanguageNative}
          options={learningLanguages}
          className="text-black"
        />
        <button
          className="primary-btn py-2 px-4 mt-4"
          onClick={handleSubmit}
        >{`Let's go`}</button>
      </form>
    </div>
  )
}

export default Registration
