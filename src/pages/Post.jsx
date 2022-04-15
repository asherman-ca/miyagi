import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { Container, Row, Col, Image, Card, Button, Modal, Form } from 'react-bootstrap'
import EditModal from '../components/EditModal'

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

  const onInstaRemove = async (url) => {
    setFormData((prevState) => ({
      ...prevState,
      instaUrls: instaUrls.filter((prev) => prev === url)
    }))
    setLoading(true)
    const docRef = doc(db, 'posts', params.postId)
    await updateDoc(docRef, formData)
    setLoading(false)
    // console.log('instaremoved', instaUrls.filter((prev) => prev === url))
  }

  const onYouTubeRemove = async (url) => {
    setFormData((prevState) => ({
      ...prevState,
      youTubeUrls: youTubeUrls.filter((prev) => prev === url)
    }))
    const formDataCopy = {
      ...formData,
      youTubeUrls: youTubeUrls.filter((prev) => prev === url)
    }
    setLoading(true)
    const docRef = doc(db, 'posts', params.postId)
    await updateDoc(docRef, formDataCopy)
    setLoading(false)
    // console.log('formdataonremove', formData)
    // console.log('instaremoved', instaUrls.filter((prev) => prev === url))
  }

  if (loading) {
    return <Container>Loading</Container>
  }

  const { instaUrls, youTubeUrls, title, notes, imgUrls } = post

  return(
    <Container>
      {console.log('formdata', formData)}
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
                <EditModal 
                  show={show}
                  title={title}
                  notes={notes}
                  handleClose={handleClose}
                  onSubmit={onSubmit}
                  onChange={onChange}
                />
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
                  <Button variant="outline-danger" onClick={(url) => onInstaRemove(url)}>Remove</Button>
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
                  <Button variant="outline-danger" onClick={(url) => onYouTubeRemove(url)}>Remove</Button>
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