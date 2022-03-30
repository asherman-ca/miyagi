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
  const instaUrl = 'https://www.instagram.com/p/CaVixB0A206/'
  const youtubeUrl = 'https://www.youtube.com/watch?v=3thEXIXTHyY'
  const youtubeId = youtubeUrl.split("=")[1]
  // console.log('id',youtubeId)

  let profileImage = auth.currentUser.profileImage
  if (!profileImage && auth.currentUser.providerData[0].photoURL) {
    profileImage = auth.currentUser.providerData[0].photoURL
  } else if (!profileImage) {
    profileImage = 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-1024.png'
  }

  return (
    <div className="pageContainer">
      <div className="contentContainer">
        <header className="profileHeader">
          <div className="profileImageContainer">
            <button className="profileImageButton">
              <img src={profileImage} alt="Change Profile Photo" className="profileImage" />
            </button>
          </div>

          <div className="profileCard">
            <div className="profileCardTitle">
              <div className="profileCardName">
                {formData.name}
              </div>
              <div className="profileCardEmail">
                {formData.email}
              </div>
            </div>
            <div className="profileCardDetails">
              10 posts
            </div>
            <div className="profileCardFooter">
              joined 2022
            </div>
          </div>
        </header>
        <iframe src={`${instaUrl}embed`} width="400" height="480" frameborder="0" scrolling="no" allowtransparency="true">
        </iframe>

        <iframe width="943" height="530" src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>

    </div>
  )
}

export default Profile