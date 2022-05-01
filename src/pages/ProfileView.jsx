import { useState, useEffect } from 'react'
import { db } from '../firebase.config'
import { useParams } from 'react-router-dom'
import { doc, collection, getDocs, query, where, orderBy, getDoc } from 'firebase/firestore'
import { Row, Col, Container, Image, Card, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import PostItem from '../components/PostItem'
// import Spinner from '../components/Spinner'


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
                rounded
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