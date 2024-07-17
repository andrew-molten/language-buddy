import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'

function Registration() {
  const { user } = useAuth0()
  const [formState, setFormState] = useState({
    username: user?.nickname ? user.nickname : '',
    birthdate: '',
  })

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormState({ ...formState, [event.target.name]: event.target.value })
    console.log(event.target.value)
  }

  console.log(user)
  return (
    <div className=" page">
      <h2 className="page-heading">Registration</h2>
      <form>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          name="username"
          id="username"
          value={formState.username}
          onChange={handleChange}
        ></input>{' '}
        <br />
        <span className="mt-3">
          <label className="text-sky-400/100" htmlFor="birthdate">
            Birthdate:{' '}
          </label>
          <input
            name="birthdate"
            id="birthdate"
            type="date"
            value={formState.birthdate}
            onChange={handleChange}
          />
        </span>
      </form>
    </div>
  )
}

export default Registration
