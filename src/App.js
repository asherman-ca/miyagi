import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Topbar from './components/Topbar'
import Navbar from './components/Navbar'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Create from './pages/Create'

function App() {
  return (
    <>
      <div className="heighter">
      <Router>
        <Topbar />
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/create' element={<Create />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer/>
      </div>
    </>
  );
}

export default App;
