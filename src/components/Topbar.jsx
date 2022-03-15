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
    <nav className="topbar">
      <ul className="topbarListItems">
        <li className="topbarListItem">
          <h1>Miyagi.com</h1>
        </li>
        {/* {currentUser ?
          <li className="topbarListItem" onClick={onLogout}>
            Logout
          </li> : <div>{' '}</div>
        } */}
        {currentUser ?
          <li className="topbarListItem" onClick={onLogout}>
            X
          </li> : <div>{' '}</div>
        }
      </ul>
    </nav>
  )
}

export default Topbar