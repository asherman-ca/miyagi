import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { Container, Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'

const Post = () => {
  const auth = getAuth()
  const navigate = useNavigate()
  const params = useParams()
  const isMounted = useRef(true)
  const [post, setPost] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    images: {}
  })

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
  
  useEffect(() => {
    if (post && post.userRef !== auth.currentUser.uid) {
      toast.error('You can\'t edit that post')
      navigate('/')
    }
  })

  return(
    <div>Edit Post
      {console.log('post', post)}
    </div>
  )
}

export default Post