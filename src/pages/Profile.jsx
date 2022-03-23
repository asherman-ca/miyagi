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

  console.log('auth', auth)

  let profileImage = auth.currentUser.profileImage
  if (!profileImage && auth.currentUser.providerData[0].photoURL) {
    profileImage = auth.currentUser.providerData[0].photoURL
  } else if (!profileImage) {
    profileImage = 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-1024.png'
  }

  return (
    <div className="profilePage">
      <div className="profileContainer">
        <header className="profileHeader">
          <div className="profileImageContainer">
            <button className="profileImageButton">
              <img src={profileImage} alt="Change Profile Photo" className="profileImage" />
            </button>
          </div>
          <div className="profileCard">
            Alex Sherman
          </div>
        </header>
      </div>

    </div>
  )
}

export default Profile