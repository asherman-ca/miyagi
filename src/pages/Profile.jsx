// import React from 'react'
import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { Row, Col, Container, Image } from 'react-bootstrap'
import PostItem from '../components/PostItem'
import { toast } from 'react-toastify'

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const [posts, setPosts] = useState(null)
  const instaUrl = 'https://www.instagram.com/p/CaVixB0A206/'
  const youtubeUrl = 'https://www.youtube.com/watch?v=3thEXIXTHyY'
  const youtubeId = youtubeUrl.split("=")[1]


  console.log('currnetuser', auth.currentUser)
  let profileImage = auth.currentUser.profileImage
  if (!profileImage && auth.currentUser.photoURL) {
    profileImage = auth.currentUser.photoURL
  } else if (!profileImage) {
    profileImage = 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-1024.png'
  }

  useEffect(() => {
    const fetchUserPosts = async () => {
      const postsRef = collection(db, 'posts')

      const q = query(
        postsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      )

      const querySnap = await getDocs(q)

      let posts = []

      querySnap.forEach((doc) => {
        return posts.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setPosts(posts)
      setLoading(false)
    }

    fetchUserPosts()
  }, [auth.currentUser.uid])

  return (
    <Container>
      {console.log('posts', posts)}
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Row className="profileHeader mb-3">
            <Col md={3}>
              <Image 
                rounded
                className="profileImage"
                src={profileImage}
                alt="Change Profile Photo"
              />
            </Col>            
            <Col md={9} className="profileHeaderText">
              <span>{auth.currentUser.displayName}</span>
              <span>{auth.currentUser.email}</span>
              <span>Joined a while ago</span>
            </Col>
          </Row>
          {!loading && posts?.length > 0 && (
            <Row>
              {posts.map((post) => (
                <Col md={4}>
                  <PostItem />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
    // <div className="pageContainer">
    //   <div className="contentContainer">
    //     <header className="profileHeader">
    //       <div className="profileImageContainer">
    //         <button className="profileImageButton">
    //           <img src={profileImage} alt="Change Profile Photo" className="profileImage" />
    //         </button>
    //       </div>

    //       <div className="profileCard">
    //         <div className="profileCardTitle">
    //           <div className="profileCardName">
    //             {formData.name}
    //           </div>
    //           <div className="profileCardEmail">
    //             {formData.email}
    //           </div>
    //         </div>
    //         <div className="profileCardDetails">
    //           10 posts
    //         </div>
    //         <div className="profileCardFooter">
    //           joined 2022
    //         </div>
    //       </div>
    //     </header>
    //     <iframe src={`${instaUrl}embed`} width="400" height="480" frameborder="0" scrolling="no" allowtransparency="true" />

    //     <iframe width="943" height="530" src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
    //   </div>

    // </div>
  )
}

export default Profile