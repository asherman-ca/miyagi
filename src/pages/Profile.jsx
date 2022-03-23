// import React from 'react'
import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { updateDoc, doc } from 'firebase/firestore'
import { toast } from 'react-toastify'

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const { name, email } = formData

  const navigate = useNavigate()

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name
        })
        toast.info('Profile update successfull')
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Could not update profile details')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <div className="profilePage">
      <div className="profileContainer">
        <header className="profileHeader">
          <div className="profileImageContainer">
            <button className="profileImageButton">
              <img src="" alt="Change Profile Photo" />
            </button>
          </div>
          <div className="profileCard">
            {name}
          </div>
        </header>
      </div>

    </div>
    // <div className="profile">
    //   <header className="profileHeader">
    //     <p className="pageHeader">My Profile</p>
    //     <button type="button" className="logOut" onClick={onLogout}>Logout</button>
    //   </header>
    // </div>
  )
}

export default Profile