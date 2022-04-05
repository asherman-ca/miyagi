import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {  useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Navbar, Container, Nav } from 'react-bootstrap';

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

  let authButton
  if(currentUser){
    // authButton = <li className="topbarListItem logoutButton" onClick={onLogout}>Sign Out</li>
    authButton = <Nav.Link onClick={onLogout}>Sign Out</Nav.Link>
  }else{
    // authButton = <li className="topbarListItem logoutButton" onClick={() => navigate('/sign-in')}>Sign In</li>
    authButton = <Nav.Link onClick={() => navigate('/sign-in')}>Sign In</Nav.Link>
  }

  return (
    // <nav className="topbar">
    //   <ul className="topbarListItems">
    //     <li className="topbarListItem topbarTitle">
    //       <h1>Miyagi.com</h1>
    //     </li>
    //     {loading ? <></> : authButton}
    //   </ul>
    // </nav>
    <Navbar bg="light">
      <Container>
        <Navbar.Brand className="topbarTitle">
          Miyagi.com
        </Navbar.Brand>
        <Navbar.Collapse id="basic.navbar-nav">
          <Nav className="marginLeftAuto">
            {loading ? <></> : authButton}
          </Nav>
        </Navbar.Collapse>  
      </Container>
    </Navbar>
  )
}

export default Topbar