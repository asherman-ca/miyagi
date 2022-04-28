// import React from 'react'
import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { useNavigate, Link } from 'react-router-dom'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { Row, Col, Container, Image, Button, Card } from 'react-bootstrap'
import PostItem from '../components/PostItem'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ProfileImageModal from '../components/ProfileImageModal'

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState(null)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const [urlForm, setUrlForm] = useState({})

  const {name, email} = formData

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  // const onChange = (e) => {
  //   e.preventDefault()
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [e.target.id]: e.target.value
  //   }))
  // }

  const onImageSubmit = (e) => {
    e.preventDefault()
    console.log('submit hit', urlForm)
  }

  const onImageUpdate = (e) => {
    e.preventDefault()
    setUrlForm(() => (e.target.files))
    console.log(urlForm)
  }

  if (loading) {
    return <div><Spinner/></div>
  }

  // let profileImage
  // if (imageUrl) {
  //   profileImage = imageUrl
  // } else if (!profileImage) {
  //   profileImage = 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-1024.png'
  // }

  const creationTime = auth.currentUser.metadata.creationTime.split(' ').slice(0, 4).join(' ')

  return (
    <Container>
      <ProfileImageModal 
        show={show}
        onImageSubmit={onImageSubmit}
        onImageUpdate={onImageUpdate}
        handleClose={handleClose}
      />
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Row className="profileHeader">
            <Col xs={4} className="profileImageCol" onClick={handleShow}>
              <Image 
                rounded
                className="profileImage"
                src={auth.currentUser?.photoURL || 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-1024.png'}
                alt="Change Profile Photo"
                style={{cursor: 'pointer'}}
              />
            </Col>            
            <Col xs={8}>
              <Card className="profileHeaderCard" style={{border: '0px'}}>
                <Card.Text className="profileHeaderTitle">
                  @ {auth.currentUser.displayName}
                </Card.Text>
                <Card.Text>
                  <i className="bi bi-calendar2-check"></i> {creationTime}
                </Card.Text>
                <Card.Text>
                  <i className="bi bi-stickies"></i> {posts.length} posts
                </Card.Text>
              </Card>
              <Link className="editButton" to={'/edit-profile'}>
                <Button variant="outline-dark">Edit</Button>
              </Link>
            </Col>
          </Row>
          {!loading && !posts.length && (
            <Row>
              <span style={{textAlign: 'center'}}>Create your first post</span>
            </Row>
          )}
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

export default Profile