import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

function App() {
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
