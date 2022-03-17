import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Topbar() {
  // const auth = getAuth()
  // console.log('auth1', auth)
  // const [user, setUser] = useState(auth)
  // console.log('auth2', user)
  const navigate = useNavigate()

  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null)


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
    console.log('not found')
    setCurrentUser(null)
  }
});

  // useEffect(() => {
  // }, [auth.currentUser])

  const onLogout = () => {
    auth.signOut()
    // setCurrentUser(null)
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