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

  export default function Create() {
    const navigate = useNavigate()
    const isMounted = useRef(true)
    const auth = getAuth();

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
      title: '',
      images: {},
      notes: '',
      instagramUrls: [],
      youTubeUrls: []
    })

    useEffect(() => {
      if (isMounted) {
        onAuthStateChanged(auth, (user) => {
          if(user) {
            setFormData({...formData, userRef: user.uid })
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

      const formDataCopy = {
        ...formData,
        imgUrls,
        timestamp: serverTimestamp()
      }
      delete formDataCopy.images

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
      <div className="pageContainer">
        <div className="contentContainer">
          <form className="createFormContainer" onSubmit={onSubmit}>
            <label className="createFormLabel">Title</label>
            <input 
              id='title'
              type="text" 
              className="createFormInput"
              onChange={onMutate}
              minLength='3'
              maxLength='30'
              required
            />
            <label className="createFormLabel">Image</label>
            <input 
              id='imageUrl'
              type='file' 
              className="createFormImage"
              accept='.jpg,.png,.jpeg'
              onChange={onMutate}
            />
            <label className="createFormLabel">Notes</label>
            <textarea 
              id='notes'
              type="text"
              className="createFormInput"
              onChange={onMutate}
            />
            <label className="createFormLabel">Instagram</label>
            <input
              id='instagramUrl' 
              type="text" 
              className="createFormInput" 
              onChange={onMutate}
            />
            <label className="createFormLabel">YouTube</label>
            <input 
              id='youTubeUrl'
              type="text" 
              className="createFormInput" 
              onChange={onMutate}
            />
            <button className="primaryButton">
              Submit
            </button>
          </form>
        </div>
      </div>
      
    )
  }
  