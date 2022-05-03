import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, limit, writeBatch, getDoc } from 'firebase/firestore'
import { Row, Col, Container, Image, Button, Card, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import PostItem from '../components/PostItem'
import ProfileImageModal from '../components/ProfileImageModal'
import ProfileEditModal from '../components/ProfileEditModal'

import {onNameSubmit, onNameChange, onImageSubmit, onImageUpdate, onSearchChange} from '../actions/profileActions'

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState(null)
  const [nameForm, setNameForm] = useState(auth.currentUser.displayName)
  const [urlForm, setUrlForm] = useState({})
  const [searchType, setSearchType] = useState('posts')
  const [postTotal, setPostTotal] = useState(0)
  const [user, setUser] = useState(null)

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [editShow, setEditShow] = useState(false);
  const handleEditClose = () => setEditShow(false);
  const handleEditShow = () => setEditShow(true);

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

      const userRef = doc(db, 'users', auth.currentUser.uid)
      const userSnap = await getDoc(userRef)
      setUser(userSnap.data())
      
      setPosts(posts)
      setPostTotal(posts.length)
      setLoading(false)
    }

    fetchUserPosts()
  }, [auth.currentUser.uid])

  if (loading) {
    return ( 
      <Container className="spinnerContainer">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  const creationVar = auth.currentUser.metadata.creationTime.split(' ')

  const creationTime = creationVar.slice(1, 3).join(' ')

  const creationYear = creationVar[3]

  return (
    <Container>
      <ProfileImageModal 
        show={show}
        onImageSubmit={(e) => onImageSubmit(e, auth, setLoading, urlForm, handleClose)}
        onImageUpdate={(e) => onImageUpdate(e, setUrlForm)}
        handleClose={handleClose}
      />
      <ProfileEditModal
        editShow={editShow}
        onNameChange={(e) => onNameChange(e, setNameForm)}
        onNameSubmit={(e) => onNameSubmit(e, auth, nameForm, posts, handleEditClose)}
        handleEditClose={handleEditClose}
        placeHolder={auth.currentUser.displayName}
      />
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Row className="profileHeader">
            <Col xs={4} className="profileImageCol" onClick={handleShow}>
              <Image 
                className="profileImage"
                src={auth.currentUser?.photoURL || 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-1024.png'}
                alt="Change Profile Photo"
                style={{cursor: 'pointer'}}
              />
            </Col>            
            <Col xs={8} className="profileHeaderCol">
              <Card className="profileHeaderCard" style={{border: '0px'}}>
                <Card.Text className="profileHeaderTitle">
                  <div>
                    {auth.currentUser.displayName}
                  </div>
                  <i onClick={handleEditShow} className="bi bi-gear editIcon"></i>
                  <i onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('Link copied')
                  }} className="bi bi-upload uploadButton"/>
                </Card.Text>
                <Card.Text>
                  <i className="bi bi-calendar2-check"></i> {creationTime}, {creationYear}
                </Card.Text>
                <Card.Text>
                  <i className="bi bi-stickies"></i> {postTotal} posts
                </Card.Text>
                <Card.Text>
                  <i className="bi bi-bookmark profileIcon"> {user.follows} follower{user.follows === 1 ? '' : 's'}</i>
                </Card.Text>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="profileNavTabs">
              <i onClick={() => onSearchChange('posts', auth, setPosts, setSearchType)} className={searchType == 'posts' ? "bi bi-grid-3x3 profileNavIcon searched" : "bi bi-grid-3x3 profileNavIcon"}> Posts</i>
              <i onClick={() => onSearchChange('likes', auth, setPosts, setSearchType)} className={searchType == 'likes' ? "bi bi-heart-fill profileNavIcon searched" : "bi bi-heart-fill profileNavIcon"}> Likes</i>
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