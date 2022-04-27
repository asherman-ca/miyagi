// import React from 'react'
import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc, getDoc } from 'firebase/firestore'
import { Row, Col, Container, Image, Button, Card } from 'react-bootstrap'
import PostItem from '../components/PostItem'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'

function ProfileView() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUserAndPosts = async () => {
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

      const docRef = doc(db, 'users', params.profileId)
      const docSnap = await getDoc(docRef)
      console.log('docsnap data', docSnap.data())
      setUser(docSnap.data())

      setPosts(posts)
      setLoading(false)
    }

    fetchUserAndPosts()
  }, [params.profileId])

  if (loading) {
    return <div><Spinner/></div>
  }

  const creationTime = user.timestamp.toDate().toString().split(' ').slice(0, 4).join(' ')

  // TODO: add provider images to profileimage key in user records
  let profileImage
  if (user.imageUrl) {
    profileImage = user.imageUrl
  } else {
    profileImage = 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-1024.png'
  }

  return (
    <Container>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Row className="profileHeader mb-2">
            <Col xs={4} className="profileImageCol">
              <Image 
                rounded
                className="profileImage"
                src={profileImage}
                alt="Change Profile Photo"
              />
            </Col>            
            <Col xs={8}>
              <Card className="profileHeaderCard" style={{border: '0px'}}>
                <Card.Text className="profileHeaderTitle">
                  @ {user.name}
                </Card.Text>
                <Card.Text>
                  <i className="bi bi-calendar2-check"></i> {creationTime}
                </Card.Text>
                <Card.Text>
                  <i className="bi bi-stickies"></i> {posts.length} posts
                </Card.Text>
              </Card>
            </Col>
          </Row>
          {!loading && posts?.length > 0 && (
            <Row className="postItemRow">
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