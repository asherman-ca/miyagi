import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { Container, Row, Col, Image, Card, Button } from 'react-bootstrap'

const Post = () => {
  const params = useParams()
  const auth = getAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newInsta, setNewInsta] = useState('')
  const [newYouTube, setNewYouTube] = useState('')


  
  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, 'posts', params.postId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setPost(docSnap.data())
        setLoading(false)
      }
    }
    fetchPost()
  }, [params.postId])

  const onSubmit = async (e) => {
    e.preventDefault()
    console.log(e)
    // setLoading(true)
  }

  if (loading) {
    return <Container>Loading</Container>
  }

  const instagramUrl = 'https://www.instagram.com/p/CcVbPCDDZbS/'
  const youTubeUrl = 'https://www.youtube.com/watch?v=oeF6KLRARzQ'

  return(
    <Container>
      {console.log('poster', post)}
      <Row>
        <Col md={{ span: 8, offset: 2}}>
            <Row className="postHeader">
              <Col md={4}>
                <Image
                  rounded
                  className="postImage"
                  src={post.imgUrls[0]}
                  alt="Post Image"
                />
              </Col>

              <Col md={8} className="postCardCol">
                <Card border="secondary" className="postCard">
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>
                    {post.notes}
                  </Card.Text>
                </Card>
                {post.userRef == auth.currentUser.uid ?
                  <Link className="editButton" to={`/edit-post/${params.postId}`}>
                    <Button variant="outline-dark">Edit</Button>
                  </Link> : null
                }
              </Col>
            </Row>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 8, offset: 2}}>
          <Row>
            <Col className="socialColumn" md={6}>
              <span>Instagrams</span>
              <iframe src={`${instagramUrl}embed`} height="500" frameborder="0" scrolling="no" allowtransparency="true" className="previewFrame" />
            </Col>
            <Col className="socialColumn" md={6}>
              <span>YouTubes</span>
              <iframe height="500" src={`https://www.youtube.com/embed/${youTubeUrl.split("=")[1]}`} title="YouTube video player" frameborder="0" className="previewFrame" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Post