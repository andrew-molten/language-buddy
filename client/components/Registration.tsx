import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import FormField from './FormField'
import { ConflictError, NewUser } from '../../models/admin'
import { useCreateUser } from '../hooks/useUser'

function Registration() {
  const { user } = useAuth0()
  const createUser = useCreateUser()
  const [formState, setFormState] = useState({
    username: user?.nickname ? user.nickname : '',
    givenName: user?.given_name ? user?.given_name : '',
    familyName: user?.family_name ? user?.family_name : '',
    birthdate: '',
  })

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormState({ ...formState, [event.target.name]: event.target.value })
    // console.log(event.target.value)
  }

  function checkStateValues() {
    if (
      formState.username.length > 0 &&
      formState.givenName.length > 0 &&
      formState.familyName.length > 0 &&
      formState.birthdate.length > 0
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
        <button
          className="primary-btn py-2 px-4 mt-4"
          onClick={handleSubmit}
        >{`Let's go`}</button>
      </form>
    </div>
  )
}

export default Registration
