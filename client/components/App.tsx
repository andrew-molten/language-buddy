import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import { useGetUser } from '../hooks/useUser'

// if a user exists with this Auth Id then set the user id

// If signed in then display NavBar

// Otherwise display registration

function App() {
  // check user exists
  const user = useGetUser()
  console.log(user.data)
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
