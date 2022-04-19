import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { Container, Row, Col, Image, Card, Button, Modal, Form } from 'react-bootstrap'
import EditModal from '../components/EditModal'
import AddInstaModal from '../components/AddInstaModal'

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

  const [instaAddShow, setInstaAddShow] = useState(false);
  const handleInstaAddClose = () => setInstaAddShow(false);
  const handleInstaAddShow = () => setInstaAddShow(true);
  
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
    e.preventDefault()
    const docRef = doc(db, 'posts', params.postId)
    await updateDoc(docRef, formData)
    setPost(() => ({
      ...formData
    }))
    handleClose()
  }

  const onChange = (e) => {
    e.preventDefault()
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onInstaAdd = async (url) => {
    setLoading(true)
    instaUrls.push(url)
    const instaUrlsCopy = instaUrls
    const formDataCopy = {
      ...formData,
      instaUrls: instaUrlsCopy
    }
    const docRef = doc(db, 'posts', params.postId)
    await updateDoc(docRef, formDataCopy)
    setPost(() => ({
      ...formDataCopy
    }))
    setFormData(() => ({
      ...formDataCopy
    }))
    handleInstaAddClose()
    setLoading(false)
  }

  const onYouTubeAdd = async (url) => {

  }

  const onInstaRemove = async (url) => {
    setLoading(true)
    setFormData((prevState) => ({
      ...prevState,
      instaUrls: formData.instaUrls.filter((prev) => prev !== url)
    }))
    const formDataCopy = {
      ...formData,
      instaUrls: formData.instaUrls.filter((prev) => prev !== url)
    }
    const docRef = doc(db, 'posts', params.postId)
    await updateDoc(docRef, formDataCopy)
    setPost((prevState) => ({
      ...formDataCopy
    }))
    setLoading(false)
    
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
    setPost((prevState) => ({
      ...formDataCopy
    }))
    setLoading(false)
  }

  if (loading) {
    return <Container>Loading</Container>
  }

  const { instaUrls, youTubeUrls, title, notes, imgUrls } = post

  return(
    <Container>
      {console.log('renderdata', formData)}
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
              <div className="socialColumnTitle">
                <span>Instagram</span>
                {post.userRef == auth.currentUser.uid &&
                  <Button variant="outline-dark" onClick={handleInstaAddShow}>+</Button>
                }
                <AddInstaModal
                  instaAddShow={instaAddShow}
                  handleInstaAddClose={handleInstaAddClose}
                  onInstaAdd={onInstaAdd}
                />
              </div>
              {instaUrls.map((url) => (
                <>
                  <iframe src={`${url}embed`} height="480" frameborder="0" scrolling="yes" allowtransparency="true" className="previewFrame" />
                  {post.userRef == auth.currentUser.uid &&
                    <Button variant="outline-danger" onClick={() => onInstaRemove(url)}>Remove</Button>
                  }
                </>
              ))}
            </Col>
            <Col className="socialColumn" md={6}>
              <div className="socialColumnTitle">
                <span>YouTube</span>
                <Button variant="outline-dark">+</Button>
              </div>
              {youTubeUrls.map((url) => (
                <>
                  <iframe height="315" width="100%" src={`https://www.youtube.com/embed/${url.split("=")[1]}`} title="YouTube video player" frameborder="0" className="previewFrame" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
                  {post.userRef == auth.currentUser.uid &&
                    <Button variant="outline-danger socialColumnDelete" onClick={() => onYouTubeRemove(url)}>Remove</Button>
                  }
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