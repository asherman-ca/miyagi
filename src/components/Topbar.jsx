import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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
    toast.info('Logged out')
  }

  return (
    <nav className="topbar">
      <ul className="topbarListItems">
        <li className="topbarListItem topbarTitle">
          <h1>Miyagi.com</h1>
        </li>
        {currentUser ?
          <li className="topbarListItem logoutButton" onClick={onLogout}>
            {/* <i className="fa-solid fa-arrow-right-from-bracket fa-lg" /> */}
            Sign Out
          </li> : 
          <li className="topbarListItem logoutButton" onClick={() => navigate('/sign-in')}>
            {/* <i class="fa-solid fa-arrow-right-to-bracket fa-lg"></i> */}
            Sign In
          </li>
        }
      </ul>
    </nav>
  )
}

export default Topbar