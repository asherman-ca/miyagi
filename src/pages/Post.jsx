import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { Container, Row, Col, Image, Card, Button, Modal, Form } from 'react-bootstrap'

const Post = () => {
  const params = useParams()
  const auth = getAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    userRef: '',
    instaUrls: [],
    youTubeUrls: [],
    images: []
  })

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, 'posts', params.postId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setPost(docSnap.data())
        setFormData({...docSnap.data()})
        setLoading(false)
      }
    }
    fetchPost()
  }, [params.postId])

  const onSubmit = async (e) => {
    console.log('submitted form data', formData)
    handleClose()
    e.preventDefault()
    // console.log(e)
    // setLoading(true)
  }

  const onChange = (e) => {
    e.preventDefault()
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  if (loading) {
    return <Container>Loading</Container>
  }

  const { instaUrls, youTubeUrls, title, notes, imgUrls } = post

  return(
    <Container>
      <Row>
        <Col md={{ span: 8, offset: 2}}>
            <Row className="postHeader">
              <Col md={4}>
                <Image
                  rounded
                  className="postImage"
                  src={imgUrls[0]}
                  alt="Post Image"
                />
              </Col>
              <Col md={8} className="postCardCol">
                <Card border="secondary" className="postCard">
                  <Card.Title className="postCardTitle">{title}</Card.Title>
                  <Card.Text>
                    {notes}
                  </Card.Text>
                </Card>
                {post.userRef == auth.currentUser.uid &&
                    <Button className="editButton" variant="outline-dark" onClick={handleShow}>Edit</Button>
                }
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={onSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          id="title"
                          placeholder={title}
                          onChange={onChange}
                          autoFocus
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                      >
                        <Form.Label>Notes</Form.Label>
                        <Form.Control 
                          onChange={onChange} id="notes" placeholder={notes} as="textarea" rows={3} />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Col>
            </Row>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 8, offset: 2}}>
          <Row>
            <Col className="socialColumn" md={6}>
              <div>
                <span>Instagram</span>
                <Button variant="outline-dark">+</Button>
              </div>
              {instaUrls.map((url) => (
                <>
                <iframe src={`${url}embed`} height="480" frameborder="0" scrolling="yes" allowtransparency="true" className="previewFrame" />
                <Button variant="outline-danger">Remove</Button>
                </>
              ))}
            </Col>
            <Col className="socialColumn" md={6}>
              <div>
                <span>YouTube</span>
                <Button variant="outline-dark">+</Button>
              </div>
              {youTubeUrls.map((url) => (
                <>
                  <iframe width="420" height="315" width="100%" src={`https://www.youtube.com/embed/${url.split("=")[1]}`} title="YouTube video player" frameborder="0" className="previewFrame" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
                  <Button variant="outline-danger">Remove</Button>
                </>
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Post