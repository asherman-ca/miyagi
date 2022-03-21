import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Topbar() {
  const navigate = useNavigate()
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState({})
  const [loading, setLoading] = useState(true)

  // onauthstatechanged works like useEffect here
  onAuthStateChanged(auth, (user) => {
    setLoading(false)
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      setCurrentUser(user)
    } else {
      // User is signed out
      setCurrentUser(null)
    }
  });

  const onLogout = () => {
    auth.signOut()
    navigate('/')
    toast.info('Logged out')
  }

  // TODO: authbutton logic refactor
  let authButton
  if(currentUser){
    authButton = <li className="topbarListItem logoutButton" onClick={onLogout}>Sign Out</li>
  }else{
    authButton = <li className="topbarListItem logoutButton" onClick={() => navigate('/sign-in')}>Sign In</li>
  }

  return (
    <nav className="topbar">
      <ul className="topbarListItems">
        <li className="topbarListItem topbarTitle">
          <h1>Miyagi.com</h1>
        </li>
        {console.log('loading', loading)}
        {loading && <></>}
        {currentUser && !loading ?
          <li className="topbarListItem logoutButton" onClick={onLogout}>
            Sign Out
          </li> : null }
        {!currentUser && !loading ?  <li className="topbarListItem logoutButton" onClick={() => navigate('/sign-in')}>
            Sign In
          </li> : null } 
      </ul>
    </nav>
  )
}

export default Topbar