import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Topbar() {
  const auth = getAuth()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(auth)

  useEffect(() => {
    setCurrentUser(auth.currentUser)
  }, [auth.currentUser])

  const onLogout = () => {
    auth.signOut()
    setCurrentUser(null)
    navigate('/')
  }

  return (
    <nav className="topBar">
      <ul className="navbarListItems">
        <li className="navbarListItem">
          Miyagi.com
        </li>
        {currentUser ?
          <li className="navbarListItem" onClick={onLogout}>
            Logout
          </li> : <div>{' '}</div>
        }
      </ul>
    </nav>
  )
}

export default Topbar