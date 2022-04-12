import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { Container, Row, Col, Image, Card, Button } from 'react-bootstrap'

const Post = () => {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  const params = useParams()
  const auth = getAuth()

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

  return(
    <Container>
      {console.log('post', post)}
      {console.log('auth', auth)}
      <Row>
        <Col md={{ span: 8, offset: 2}}>
          {loading ? <></> :
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
          }
        </Col>
      </Row>
    </Container>
  )
}

export default Post