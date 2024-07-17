import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import { useGetUser } from '../hooks/useUser'
import Registration from './Registration'
import { useAuth0 } from '@auth0/auth0-react'

// if a user exists with this Auth Id then set the user id

// If signed in then display NavBar

// Otherwise display registration

function App() {
  const { isAuthenticated } = useAuth0()
  const user = useGetUser()
  if (isAuthenticated && user.isPending) {
    return (
      <div className="app">
        <header className="header">
          <h1>Language buddy </h1>
        </header>
        <p>Loading...</p>
      </div>
    )
  }

  if (isAuthenticated && !user.data.id)
    // for new user
    return (
      <div className="app">
        <header className="header">
          <h1>Language buddy </h1>
        </header>
        <Registration />
      </div>
    )

  return (
    <>
      <div className="app">
        <header className="header">
          <h1>Language buddy </h1>
          <NavBar />
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default App
