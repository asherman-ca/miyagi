import { useNavigate, useLocation } from 'react-router-dom'
import { ReactComponent as OfferIcon } from '../assets/localOfferIcon.svg'
import { ReactComponent as ExploreIcon } from '../assets/exploreIcon.svg'
import { ReactComponent as PersonOutlineIcon } from '../assets/personOutlineIcon.svg'
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap'

function Navbottom() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true
    }
  }

  return (
    <Navbar bg="white" className="bottombar" fixed="bottom">
      <Container>
        <Nav>
          <Nav.Link 
            onClick={() => navigate('/')}
            className={pathMatchRoute('/') ? 'navbarLinkActive' : 'navbarLink'}
          >
            <span
              className={pathMatchRoute('/') ? 'navbarLinkTextActive' : 'navbarLinkText'}
            >Explore</span>
          </Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link 
            onClick={() => navigate('/create')}
            className={pathMatchRoute('/create') ? 'navbarLinkActive' : 'navbarLink'}
          >
            <span
              className={pathMatchRoute('/create') ? 'navbarLinkTextActive' : 'navbarLinkText'}
            >Create</span>
          </Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link 
            onClick={() => navigate('/profile')}
            className={pathMatchRoute('/profile') ? 'navbarLinkActive' : 'navbarLink'}
          >
            <span
              className={pathMatchRoute('/profile') ? 'navbarLinkTextActive' : 'navbarLinkText'}
            >Profile</span>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
    // <footer className='navbar'>
    //   <nav className='navbarNav'>
    //     <ul className='navbarListItems'>
    //       <li className='navbarListItem' onClick={() => navigate('/')}>
    //         <ExploreIcon
    //           fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'}
    //           width='36px'
    //           height='36px'
    //         />
    //         <p
    //           className={
    //             pathMatchRoute('/')
    //               ? 'navbarListItemNameActive'
    //               : 'navbarListItemName'
    //           }
    //         >
    //           Explore
    //         </p>
    //       </li>
    //       <li className='navbarListItem' onClick={() => navigate('/create')}>
    //         <OfferIcon
    //           fill={pathMatchRoute('/create') ? '#2c2c2c' : '#8f8f8f'}
    //           width='36px'
    //           height='36px'
    //         />
    //         <p
    //           className={
    //             pathMatchRoute('/create')
    //               ? 'navbarListItemNameActive'
    //               : 'navbarListItemName'
    //           }
    //         >
    //           Create
    //         </p>
    //       </li>
    //       <li className='navbarListItem' onClick={() => navigate('/profile')}>
    //         <PersonOutlineIcon
    //           fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'}
    //           width='36px'
    //           height='36px'
    //         />
    //         <p
    //           className={
    //             pathMatchRoute('/profile')
    //               ? 'navbarListItemNameActive'
    //               : 'navbarListItemName'
    //           }
    //         >
    //           Profile
    //         </p>
    //       </li>
    //     </ul>
    //   </nav>
    // </footer>
  )
}

export default Navbottom