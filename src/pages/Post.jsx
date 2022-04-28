import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getDoc, doc, updateDoc, deleteDoc, query, where, collection, getDocs, limit, addDoc } from 'firebase/firestore'
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
    images: [],
    likes: 0
  })
  const [userLike, setUserLike] = useState([])

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
        setPost({
          id: docSnap.id,
          ...docSnap.data()
        })
        setFormData({...docSnap.data()})
        setLoading(false)
      }
      const likesRef = collection(db, 'likes')
      const q = query(
        likesRef,
        where('postRef', '==', params.postId),
        where('userRef', '==', auth.currentUser.uid),
        limit(20)
      )
      const querySnap = await getDocs(q)
      querySnap.forEach((doc) => {
        setUserLike([{
          data: doc.data(),
          id: doc.id
        }])
      })
    }
    fetchPost()
  }, [params.postId])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (auth.currentUser?.uid === 'cvT4fO1bQIR8HykmCmHYz82IlAu1') {
      toast.error('Demo account locked')
    } else {
    const docRef = doc(db, 'posts', params.postId)
    await updateDoc(docRef, formData)
    setPost(() => ({
      ...formData
    }))
    handleClose()
    }
  }

  const onDelete = async (id) => {
    if (auth.currentUser?.uid === 'cvT4fO1bQIR8HykmCmHYz82IlAu1') {
      toast.error('Demo account locked')
    } else {
      if (window.confirm('Are you sure you want to delete?')) {
        await deleteDoc(doc(db, 'posts', id))
        toast.success('Post deleted')
        navigate('/profile')
      }
    }
  }

  const onChange = (e) => {
    e.preventDefault()
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onLike = async () => {
    if (auth.currentUser?.uid === 'cvT4fO1bQIR8HykmCmHYz82IlAu1') {
      toast.error('Demo account locked')
    } else {
      if(!auth.currentUser) {
        toast.error('Must be logged in')
      } else {
        const docRef = doc(db, 'posts', params.postId)
        if (userLike.length < 1){
          await updateDoc(docRef, {
            likes: likes + 1
          })
          const newDoc = await addDoc(collection(db, 'likes'), {
            userRef: auth.currentUser.uid,
            postRef: params.postId,
            postUserRef: userRef
          })
          setPost((prev) => ({
            ...prev,
            likes: likes + 1
          }))
          setUserLike([
          {
            data: {
            userRef: auth.currentUser.uid,
            postRef: params.postId,
            postUserRef: userRef
            },
            id: newDoc.id
          }
          ])
        } else {
          await updateDoc(docRef, {
            likes: likes - 1
          })
          await deleteDoc(doc(db, 'likes', userLike[0].id))
          setPost((prev) => ({
            ...prev,
            likes: likes - 1
          }))
          setUserLike([])
        }
      }
    }
  }

  const onInstaAdd = async (url) => {
    if (auth.currentUser?.uid === 'cvT4fO1bQIR8HykmCmHYz82IlAu1') {
      toast.error('Demo account locked')
    } else {

    instaUrls.push(url)
    const urls = instaUrls
    const docRef = doc(db, 'posts', params.postId)
    await updateDoc(docRef, {
      ...post,
      instaUrls: urls
    })
    setPost((prev) => ({
      ...prev,
      instaUrls: urls
    }))
    setFormData(() => ({
      ...post
    }))
    handleInstaAddClose()
    toast.success('Instagram post added')
    }
  }

  const onYouTubeAdd = async (url) => {
    if (auth.currentUser?.uid === 'cvT4fO1bQIR8HykmCmHYz82IlAu1') {
      toast.error('Demo account locked')
    } else {
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
    toast.success('YouTube post added')
    }
  }

  const onInstaRemove = async (url) => {
    if (auth.currentUser?.uid === 'cvT4fO1bQIR8HykmCmHYz82IlAu1') {
      toast.error('Demo account locked')
    } else {

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
    }
  }

  const onYouTubeRemove = async (url) => {
    if (auth.currentUser?.uid === 'cvT4fO1bQIR8HykmCmHYz82IlAu1') {
      toast.error('Demo account locked')
    } else {

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
    }
  }

  if (loading) {
    return <Container>Loading</Container>
  }
  
  const { instaUrls, youTubeUrls, title, notes, imgUrls, id, userName, userRef, likes } = post
  
  return(
    <Container>
      <Row>
        <Col md={{ span: 8, offset: 2}}>
            <Row className="postHeader">
              <Col style={{paddingRight: '0px', paddingLeft: '0px'}} xs={4}>
                <Card>
                  <Card.Img
                    className="cardImage" variant="top" src={imgUrls[0]}/>
                  <Card.Body className="postItemBody">
                    <span className="postItemTitleSpan">{title}</span>
                    <span>{likes}</span>
                    <i onClick={onLike} style={{marginLeft: '3px', paddingTop: '1.25px', cursor: 'pointer'}} className={userLike.length ? 'bi bi-heart-fill' : 'bi bi-heart'}></i>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={8} className="postCardDetailsCol">
                <Card border="secondary" className="postCard">
                  <Card.Title className="postCardHeader">
                    <Link className="postCardHeaderLink" to={`/profile/${userRef}`}><span>@{userName}</span></Link>
                    {post.userRef == auth.currentUser?.uid &&
                      <Button variant="outline-dark" className="editButton" onClick={handleShow}>Edit</Button>
                    }
                  </Card.Title>
                  <Card.Text>
                    {notes}
                  </Card.Text>
                </Card>
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
            <Col className="socialColumn youTubeColumn" md={6}>
              <div className="socialColumnTitle">
                <span className="socialColumnEmbedTitle">YouTube</span>
                {post.userRef == auth.currentUser?.uid &&
                  <i onClick={handleYouTubeAddShow} className="bi bi-plus-circle socialEmbedAddButton"></i>
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
            <Col className="socialColumn instaColumn" md={6}>
              <div className="socialColumnTitle">
                <span className="socialColumnEmbedTitle">Instagram</span>
                {post.userRef == auth.currentUser?.uid &&
                  <i onClick={handleInstaAddShow} className="bi bi-plus-circle socialEmbedAddButton"></i>
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
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Post