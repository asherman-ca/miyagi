// import React from 'react'
import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc, getDoc } from 'firebase/firestore'
import { Row, Col, Container, Image, Button } from 'react-bootstrap'
import PostItem from '../components/PostItem'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'

function ProfileView() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState(null)
  const [user, setUser] = useState(null)

  // let profileImage = auth.currentUser.profileImage
  // if (!profileImage && auth.currentUser.photoURL) {
  //   profileImage = auth.currentUser.photoURL
  // } else if (!profileImage) {
  //   profileImage = 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-1024.png'
  // }

  useEffect(() => {
    const fetchUserPosts = async () => {
      // console.log('hitssss')
      const postsRef = collection(db, 'posts')
      const q = query(
        postsRef,
        where('userRef', '==', params.profileId),
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

      console.log('hitts post', posts)
      setPosts(posts)
      setLoading(false)
    }

    // TODO figure out how to add userDoc id when creating posts so that it can be fetched
    // it should work the way I was trying - turned out that tester@gmail didn't have an associated user doc

    fetchUserPosts()
    
    // setLoading(false)
  }, [params.profileId])

  if (loading) {
    return <div><Spinner/></div>
  }

  // const creationTime = auth.currentUser.metadata.creationTime.split(' ').slice(0, 4).join(' ')

  const creationTime = '123'

  return (
    <Container>
      {console.log('posts', posts)}
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Row className="profileHeader mb-3">
            <Col md={3}>
              {/* <Image 
                rounded
                className="profileImage"
                src={profileImage}
                alt="Change Profile Photo"
              /> */}
            </Col>            
            <Col md={9} className="profileHeaderText">
              <div className="profileHeaderInfo">
                <span className="profileHeaderName">{user.name}</span>
                <span className="profileHeaderEmail">{user.email}</span>
              </div>
              <div>
                <span className="asdasvrw">{posts.length} posts</span>
              </div>
              <div>
                <span className="asdasvrw">Joined {creationTime}</span>
              </div>
              <Link className="editButton" to={'/edit-profile'}>
                <Button variant="outline-dark">Edit</Button>
              </Link>
            </Col>
          </Row>
          {!loading && posts?.length > 0 && (
            <Row>
              {posts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post.data}
                  id={post.id}
                />
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ProfileView