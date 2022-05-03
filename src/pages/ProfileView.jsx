import { useState, useEffect } from 'react'
import { db } from '../firebase.config'
import { useParams } from 'react-router-dom'
import { doc, collection, getDocs, query, where, orderBy, getDoc, limit } from 'firebase/firestore'
import { Row, Col, Container, Image, Card, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import PostItem from '../components/PostItem'
import { onFollow } from '../actions/profileViewActions'
import { getAuth } from 'firebase/auth'


function ProfileView() {
  const auth = getAuth()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState(null)
  const [user, setUser] = useState(null)
  const [userFollow, setUserFollow] = useState([])

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      // fetch and set posts
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
      setPosts(posts)

      // fetch and set user
      const docRef = doc(db, 'users', params.profileId)
      const docSnap = await getDoc(docRef)
      setUser(docSnap.data())

      // fetch and set current user follow
      if (auth.currentUser) {
        const followRef = collection(db, 'follows')
        const followQ = query(
          followRef,
          where('followedUserRef', '==', params.profileId),
          where('userRef', '==', auth.currentUser.uid),
          limit(10)
        )
        const followSnap = await getDocs(followQ)
        followSnap.forEach((doc) => {
          setUserFollow([{
            data: doc.data(),
            id: doc.id
          }])
        })
        console.log('userFollow', userFollow)
      }
      setLoading(false)
    }

    fetchUserAndPosts()
  }, [params.profileId])

  if (loading) {
    return ( 
      <Container className="spinnerContainer">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
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
          <Row className="profileHeader profileViewHeader">
            <Col xs={4} className="profileImageCol">
              <Image 
                className="profileImage"
                src={profileImage}
                alt="Change Profile Photo"
              />
            </Col>            
            <Col xs={8} className="profileHeaderCol">
              <Card className="profileHeaderCard" style={{border: '0px'}}>
                <Card.Text className="profileHeaderTitle">
                  <div>
                    <i class="bi bi-person-circle profileIcon" style={{paddingRight: '4px'}} />{user.name}
                  </div>
                  {auth.currentUser?.uid !== params.profileId && 
                  <i 
                    onClick={(e) => onFollow(e, auth, userFollow, setUserFollow, params.profileId, setUser, user.follows)} 
                    className={userFollow.length === 0 ? "bi bi-bookmark editIcon" : "bi bi-bookmark-check-fill editIcon"} />}
                  <i onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('Link copied')
                  }} className="bi bi-upload uploadButton"/>
                </Card.Text>
                <Card.Text>
                  <i className="bi bi-calendar2-check profileIcon"></i> {creationTime}
                </Card.Text>
                <Card.Text>
                  <i className="bi bi-stickies profileIcon"></i> {posts.length} posts
                </Card.Text>
                <Card.Text>
                  <i className="bi bi-stickies profileIcon"></i> {user.follows} follows
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