import { Link } from 'react-router-dom'
import { IfAuthenticated, IfNotAuthenticated } from './Authenticated'
import { useAuth0 } from '@auth0/auth0-react'
import settingsIcon from '../icons/settings.svg'

function NavBar() {
  const { user, logout, loginWithRedirect } = useAuth0()

  const handleSignOut = () => {
    logout()
  }

  const handleSignIn = () => {
    loginWithRedirect()
  }

  return (
    <div>
      <Link to={'/'} className="nav-link">
        Story checker
      </Link>
      <Link to={'/story-history'} className="nav-link">
        History
      </Link>
      <Link to={'/vocabulary'} className="nav-link">
        Vocabulary
      </Link>
      <Link to={'/dojo'} className="nav-link">
        Dojo
      </Link>
      <Link to={'/settings'} className="nav-link">
        <img src={settingsIcon} alt="settings icon" className="inline-block" />
      </Link>
      <div className="auth">
        <IfAuthenticated>
          {user && <p>Hi {user?.given_name}</p>}
          <button onClick={handleSignOut}>Sign out</button>
        </IfAuthenticated>
        <IfNotAuthenticated>
          <button onClick={handleSignIn}>Sign in</button>
        </IfNotAuthenticated>
      </div>
    </div>
  )
}

export default NavBar
