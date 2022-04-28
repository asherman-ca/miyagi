  import { useState, useEffect, useRef } from 'react'
  import { getAuth, onAuthStateChanged } from 'firebase/auth'
  import { Navigate, useNavigate } from 'react-router-dom'
  import Spinner from '../components/Spinner'
  import { toast } from 'react-toastify'
  import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from 'firebase/storage'
  import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
  import { db } from '../firebase.config'
  import { v4 as uuidv4 } from 'uuid'
  import { Form, Container, Row, Col, Button } from 'react-bootstrap';
  
  export default function Create() {
    const navigate = useNavigate()
    const isMounted = useRef(true)
    const auth = getAuth();

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
      title: '',
      images: {},
      notes: "",
      instagramUrl: '',
      youTubeUrl: '',
      likes: 0
    })

    useEffect(() => {
      if (isMounted) {
        onAuthStateChanged(auth, (user) => {
          if(user) {
            console.log('user', user)
            setFormData({...formData, userRef: user.uid, userName: user.displayName })
          } else {
            Navigate('/sign-in')
          }
        })
      }
      return () => {
        isMounted.current = false
      }
    }, [isMounted])

    const onSubmit = async (e) => {
      e.preventDefault()
      console.log('formdata', formData)
      setLoading(true)

      const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage()
          const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
  
          const storageRef = ref(storage, 'images/' + fileName)
  
          const uploadTask = uploadBytesResumable(storageRef, image)
  
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log('Upload is ' + progress + '% done')
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused')
                  break
                case 'running':
                  console.log('Upload is running')
                  break
                default:
                  break  
              }
            },
            (error) => {
              reject(error)
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL)
              })
            }
          )
        })
      }

      const imgUrls = await Promise.all(
        [...formData.images].map((image) => storeImage(image))
      ).catch(() => {
        setLoading(false)
        toast.error('Images not uploaded')
        return
      })

      const instaUrls = formData.instagramUrl ? [formData.instagramUrl] : []
      const youTubeUrls = formData.youTubeUrl ? [formData.youTubeUrl] : []

      const formDataCopy = {
        ...formData,
        imgUrls,
        instaUrls,
        youTubeUrls,
        timestamp: serverTimestamp()
      }
      delete formDataCopy.images
      delete formDataCopy.instagramUrl
      delete formDataCopy.youTubeUrl

      await addDoc(collection(db, 'posts'), formDataCopy)

      setLoading(false)
      toast.success('Post Saved')
      navigate('/profile')
    }

    const onMutate = (e) => {
      if (e.target.files) {
        setFormData((prevState) => ({
          ...prevState,
          images: e.target.files
        }))
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: e.target.value,
      }))}
    }

    if (loading) {
      return <Spinner />
    }

    return (
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }} className="formBorder">
            <div className="formHeader">Create Post</div>
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Text className="text-muted">
                  Create a title for your post
                </Form.Text>
                <Form.Control
                  type="title"
                  placeholder="Enter title"
                  id="title"
                  onChange={onMutate}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Text className="text-muted">
                  Add an image to your post
                </Form.Text>
                <Form.Control 
                  type="file"
                  id="images"
                  accept=".jpg,.png,.jpeg"
                  onChange={onMutate}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Text className="text-muted">
                  Add an Instagram page to your post
                </Form.Text>
                <Form.Control
                  type="instagram"
                  placeholder="Enter Instagram address"
                  id="instagramUrl"
                  onChange={onMutate}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Text className="text-muted">
                  Add a YouTube page to your post
                </Form.Text>
                <Form.Control
                  type="youtube"
                  placeholder="Enter YouTube address"
                  id="youTubeUrl"
                  onChange={onMutate}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Text className="text-muted">
                  Add notes to your post
                </Form.Text>
                <Form.Control
                  as="textarea" 
                  rows={3}
                  placeholder="Enter notes"
                  id="notes"
                  onChange={onMutate}
                />
              </Form.Group>

              <Button
                variant="outline-dark"
                type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    )
  }
  