import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import { useGetUser } from '../hooks/useUser'
import Registration from './Registration'
import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const { isAuthenticated } = useAuth0()
  const user = useGetUser()
  console.log(user.data)

  // Loading
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

  // New user
  if (isAuthenticated && !user.data[0]) {
    return (
      <div className="app">
        <header className="header">
          <h1>Language buddy </h1>
        </header>
        <Registration />
      </div>
    )
  }

  // Logged in
  if (isAuthenticated && user.data[0]) {
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

  // Sign in please
  return (
    <>
      <div className="app">
        <header className="header">
          <h1>Language buddy </h1>
          <NavBar />
        </header>

        <main>
          <p className="text-center">Please Sign In</p>
        </main>
      </div>
    </>
  )
}

export default App
