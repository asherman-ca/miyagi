import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Topbar() {
  const navigate = useNavigate()
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null)

  // onauthstatechanged works like useEffect here
  onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
     const uid = user.uid;
     console.log('found', uid)
     setCurrentUser(user)
    // ...
  } else {
    // User is signed out
    // ...
    setCurrentUser(null)
  }
});

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  return (
    <nav className="topbar">
      <ul className="topbarListItems">
        <li className="topbarListItem">
          <h1>Miyagi.com</h1>
        </li>
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