import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Explore from './pages/Explore'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Topbar from './components/Topbar'

function App() {
  return (
    <>
      <Router>
        <Topbar />
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer/>
    </>
  );
}

export default App;
