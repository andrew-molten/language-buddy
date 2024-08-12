import Select from 'react-select'
import { learningLanguages } from '../data/languages'
import { useState } from 'react'
import { useGetUser, useUpdateUser } from '../hooks/useUser'
import SignOutBtn from '../components/buttons/SignOut'

function Settings() {
  const user = useGetUser()
  const updateUser = useUpdateUser()

  const [learningLanguage, setLearningLanguage] = useState<{
    value: string
    label: string
  } | null>(null)
  const [nativeLanguage, setNativeLanguage] = useState<{
    value: string
    label: string
  } | null>(null)

  if (user.isPending) {
    return (
      <div className="page">
        <h1 className="page-heading">Settings</h1>
        <p>Loading...</p>
      </div>
    )
  }

  // Update state with user data
  if (
    user.data[0].learningLanguage &&
    learningLanguage === null &&
    nativeLanguage === null
  ) {
    setLearningLanguage({
      value: user.data[0].learningLanguage,
      label: user.data[0].learningLanguage,
    })
    setNativeLanguage({
      value: user.data[0].nativeLanguage,
      label: user.data[0].nativeLanguage,
    })
  }

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (learningLanguage === null || nativeLanguage === null)
      return alert("Please make sure you've selected your languages")
    updateUser.mutateAsync({
      learningLanguage: learningLanguage.value,
      nativeLanguage: nativeLanguage.value,
    })
  }

  return (
    <div className="page">
      <h1 className="page-heading">Settings</h1>
      <form>
        <label
          htmlFor="nativeLanguage"
          className="mt-4 inline-block"
        >{`What's your native language?`}</label>
        <Select
          name="nativeLanguage"
          defaultValue={nativeLanguage}
          onChange={setNativeLanguage}
          options={learningLanguages}
          className="text-black"
        />
        <label htmlFor="learningLanguage" className="mt-4 inline-block">
          What language are you learning?
        </label>
        <Select
          name="learningLanguage"
          defaultValue={learningLanguage}
          onChange={setLearningLanguage}
          options={learningLanguages}
          className="text-black"
        />

        <button
          className="primary-btn py-2 px-4 mt-4"
          onClick={handleSubmit}
        >{`Update me`}</button>
        <SignOutBtn text="Sign out" />
      </form>
    </div>
  )
}

export default Settings
