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
import ForgotPassword from './pages/ForgotPassword'
import Post from './pages/Post'
import EditPost from './pages/EditPost'

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
          <Route path='/create' element={<Create />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/post/:postId' element={<Post />} />
          <Route path='/edit-post/:postId' element={<EditPost />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer/>
    </>
  );
}

export default App;
