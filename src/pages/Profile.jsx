import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, limit, writeBatch } from 'firebase/firestore'
import { Row, Col, Container, Image, Button, Card, Spinner } from 'react-bootstrap'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import PostItem from '../components/PostItem'
import ProfileImageModal from '../components/ProfileImageModal'
import ProfileEditModal from '../components/ProfileEditModal'

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState(null)
  const [nameForm, setNameForm] = useState(auth.currentUser.displayName)
  const [urlForm, setUrlForm] = useState({})

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [editShow, setEditShow] = useState(false);
  const handleEditClose = () => setEditShow(false);
  const handleEditShow = () => setEditShow(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const postsRef = collection(db, 'posts')

      const q = query(
        postsRef,
        where('userRef', '==', auth.currentUser.uid),
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
      setLoading(false)
    }

    fetchUserPosts()
  }, [auth.currentUser.uid])

  const onNameSubmit = async (e) => {
    e.preventDefault()
    if (auth.currentUser?.uid === 'cvT4fO1bQIR8HykmCmHYz82IlAu1') {
      toast.error('Demo account locked')
    } else {
    const existingUserRef = collection(db, 'users')
    const q = query(
      existingUserRef,
      where('name', '==', nameForm),
      limit(10)
    )
    
    const existingUserSnap = await getDocs(q)
    if(existingUserSnap.empty){
      await updateProfile(auth.currentUser, {
        displayName: nameForm,
      })

      const userRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userRef, {
        name: nameForm
      })

      if(posts.length > 0) {
        const batch = writeBatch(db)
        posts.forEach((post) => {
          const postRef = doc(db, 'posts', post.id)
          batch.update(postRef, {userName: nameForm})
        })
        await batch.commit()
      }
      
      toast.success('Name updated')
      handleEditClose()
    } else {
      toast.error('Name unavailable')
    }
    }
  }

  const onNameChange = (e) => {
    e.preventDefault()
    setNameForm(() => (e.target.value))
  }

  const onImageSubmit = async (e) => {
    e.preventDefault()
    if (auth.currentUser?.uid === 'cvT4fO1bQIR8HykmCmHYz82IlAu1') {
      toast.error('Demo account locked')
    } else {
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
      [...urlForm].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false)
      toast.error('Images not uploaded')
      return
    })

    await updateProfile(auth.currentUser, {
      photoURL: imgUrls[0],
    })

    const userRef = doc(db, 'users', auth.currentUser.uid)
    await updateDoc(userRef, {
      imageUrl: imgUrls[0]
    })

    setLoading(false)  
    handleClose()
    toast.success('Image saved')
    }
  }

  const onImageUpdate = (e) => {
    e.preventDefault()
    setUrlForm(() => (e.target.files))
  }

  if (loading) {
    return ( 
      <Container className="spinnerContainer">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  const creationTime = auth.currentUser.metadata.creationTime.split(' ').slice(0, 4).join(' ')

  return (
    <Container>
      <ProfileImageModal 
        show={show}
        onImageSubmit={onImageSubmit}
        onImageUpdate={onImageUpdate}
        handleClose={handleClose}
      />
      <ProfileEditModal
        editShow={editShow}
        onNameChange={onNameChange}
        onNameSubmit={onNameSubmit}
        handleEditClose={handleEditClose}
        placeHolder={auth.currentUser.displayName}
      />
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Row className="profileHeader">
            <Col xs={4} className="profileImageCol" onClick={handleShow}>
              <Image 
                rounded
                className="profileImage"
                src={auth.currentUser?.photoURL || 'https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-1024.png'}
                alt="Change Profile Photo"
                style={{cursor: 'pointer'}}
              />
            </Col>            
            <Col xs={8} className="profileHeaderCol">
              <Card className="profileHeaderCard" style={{border: '0px'}}>
                <Card.Text className="profileHeaderTitle">
                  <div>
                    <i class="bi bi-person-circle profileIcon" style={{paddingRight: '4px'}} />{auth.currentUser.displayName}
                  </div>
                  <i onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('Link copied')
                  }} className="bi bi-upload uploadButton"/>
                </Card.Text>
                <Card.Text>
                  <i className="bi bi-calendar2-check"></i> {creationTime}
                </Card.Text>
                <Card.Text>
                  <i className="bi bi-stickies"></i> {posts.length} posts
                </Card.Text>
              </Card>
              <Button variant="outline-dark" className="editButton" onClick={handleEditShow}>Edit</Button>
            </Col>
          </Row>
          {!loading && !posts.length && (
            <Row>
              <span style={{textAlign: 'center'}}>Create your first post</span>
            </Row>
          )}
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

export default Profile