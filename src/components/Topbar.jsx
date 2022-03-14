import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Topbar() {
  const auth = getAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  return (
    <nav className="topBar">
      <ul className="navbarListItems">
        <li className="navbarListItem">
          Miyagi.com
        </li>
        <li className="navbarListItem" onClick={onLogout}>
          Logout
        </li>
      </ul>
    </nav>
  )
}

export default Topbar