import { Link } from 'react-router-dom'

function NavBar() {
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
    </div>
  )
}

export default NavBar
