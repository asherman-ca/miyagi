import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { Container, Row, Col, Image, Card, Button } from 'react-bootstrap'
import EditModal from '../components/EditModal'
import AddInstaModal from '../components/AddInstaModal'
import AddYouTubeModal from '../components/AddYouTubeModal'
import InstaGramTile from '../components/InstagramTile'
import YouTubeTile from '../components/YouTubeTile'
import { toast } from 'react-toastify'

const Post = () => {
  const navigate = useNavigate()
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

  const [youTubeAddShow, setYouTubeAddShow] = useState(false);
  const handleYouTubeAddClose = () => setYouTubeAddShow(false);
  const handleYouTubeAddShow = () => setYouTubeAddShow(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, 'posts', params.postId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log('id', docSnap.id)
        setPost({
          id: docSnap.id,
          ...docSnap.data()
        })
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

  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'posts', id))
      toast.success('Post deleted')
      navigate('/profile')
    }
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
    console.log(url)
    setLoading(true)
    youTubeUrls.push(url)
    const youTubeUrlsCopy = youTubeUrls
    const formDataCopy = {
      ...formData,
      youTubeUrls: youTubeUrlsCopy
    }
    const docRef = doc(db, 'posts', params.postId)
    await updateDoc(docRef, formDataCopy)
    setPost(() => ({
      ...formDataCopy
    }))
    setFormData(() => ({
      ...formDataCopy
    }))
    handleYouTubeAddClose()
    setLoading(false)
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
    setPost({...formDataCopy})
    setLoading(false)
  }

  const onYouTubeRemove = async (url) => {
    setLoading(true)
    setFormData((prevState) => ({
      ...prevState,
      youTubeUrls: youTubeUrls.filter((prev) => prev !== url)
    }))
    const formDataCopy = {
      ...formData,
      youTubeUrls: youTubeUrls.filter((prev) => prev !== url)
    }
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
  
  const { instaUrls, youTubeUrls, title, notes, imgUrls, id, userName, userRef } = post
  
  return(
    <Container>
      <Row>
        <Col md={{ span: 8, offset: 2}}>
            <Row className="postHeader">
              <Col xs={4}>
                <Image
                  rounded
                  className="postImage"
                  src={imgUrls[0]}
                  alt="Post Image"
                />
              </Col>
              <Col xs={8} className="postCardCol">
                <Card border="secondary" className="postCard">
                  <Card.Title className="postCardHeader">
                    <span className="postCardTitle">{title}</span>
                    <Link className="postCardHeaderLink" to={`/profile/${userRef}`}>@{userName}</Link>
                  </Card.Title>
                  <Card.Text>
                    {notes}
                  </Card.Text>
                </Card>
                {post.userRef == auth.currentUser?.uid &&
                    <Button className="editButton" variant="outline-dark" onClick={handleShow}>Edit</Button>
                }
                <EditModal 
                  show={show}
                  title={title}
                  notes={notes}
                  handleClose={handleClose}
                  onSubmit={onSubmit}
                  onChange={onChange}
                  onDelete={onDelete}
                  id={id}
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
                {post.userRef == auth.currentUser?.uid &&
                  <Button variant="outline-dark" onClick={handleInstaAddShow}>+</Button>
                }
                <AddInstaModal
                  instaAddShow={instaAddShow}
                  handleInstaAddClose={handleInstaAddClose}
                  onInstaAdd={onInstaAdd}
                />
              </div>
              {instaUrls.map((url) => (
                <InstaGramTile 
                  url={url}
                  onInstaRemove={onInstaRemove}
                  postUser={post.userRef}
                  currentUser={auth.currentUser?.uid}
                />
              ))}
            </Col>
            <Col className="socialColumn" md={6}>
              <div className="socialColumnTitle">
                <span>YouTube</span>
                {post.userRef == auth.currentUser?.uid &&
                  <Button variant="outline-dark" onClick={handleYouTubeAddShow}>+</Button>
                }
                <AddYouTubeModal
                  youTubeAddShow={youTubeAddShow}
                  handleYouTubeAddClose={handleYouTubeAddClose}
                  onYouTubeAdd={onYouTubeAdd}
                />
              </div>
              {youTubeUrls.map((url) => (
                <YouTubeTile
                  postUser={post.userRef}
                  currentUser={auth.currentUser?.uid}
                  url={url}
                  onYouTubeRemove={onYouTubeRemove}
                />
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Post