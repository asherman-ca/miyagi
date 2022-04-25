import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import {  useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Navbar, Container, Nav } from 'react-bootstrap';

function Topbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState({})
  const [loading, setLoading] = useState(true)
  const demoCreds = {
    email: 'genki@gmail.com',
    password: 'neo123'
  }

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

  const onDemo = async () => {
    try {
      const { email, password } = demoCreds
      let userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      
      if (userCredentials.user) {
        navigate('/profile')
      }
    } catch (error) {
      toast.error('Login failed')
    }
    console.log('hits')
  }

  let authButton
  if(currentUser){
    authButton = <Nav.Link className="topbarLink" onClick={onLogout}>Sign Out</Nav.Link>
  }else if(location.pathname === '/sign-in'){
    authButton = <Nav.Link className="topbarLink" onClick={() => navigate('/sign-up')}>Sign Up</Nav.Link>
  } else {
    authButton = <Nav.Link className="topbarLink" onClick={() => navigate('/sign-in')}>Sign In</Nav.Link>
  }

  return (
    <Navbar className="topbar" bg="white" fixed="top">
      <Container>
        <Nav.Link className="logoLink" onClick={() => navigate('/')}>
          <Navbar.Brand className="topbarTitle">
            Miyagi.tech
          </Navbar.Brand>
        </Nav.Link>
        <Nav>
          {!currentUser && <Nav.Link className="topbarLink" style={{marginRight: '5px'}} onClick={onDemo}>Demo</Nav.Link>}
          {/* <div onClick={onDemo}>Demo</div> */}
          {loading ? <></> : authButton}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Topbar