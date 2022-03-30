  import { useState, useEffect, useRef } from 'react'
  import { getAuth, onAuthStateChanged } from 'firebase/auth'
  import { Navigate, useNavigate } from 'react-router-dom'
  import Spinner from '../components/Spinner'
  import { toast } from 'react-toastify'



  export default function Create() {
    const isMounted = useRef(true)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
      title: '',
      image: '',
      notes: '',
      instagramUrls: [],
      youTubeUrls: []
    })
    const auth = getAuth();

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
    }

    const onMutate = (e) => {
      if (e.target.files) {
        console.log('file hites')
      } else {
        console.log('non file hits')
      }
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
              type="text" 
              className="createFormInput"
              onChange={onMutate}
            />
            <label className="createFormLabel">Image</label>
            <input 
              type='file' 
              className="createFormImage"
              id='imageUrl'
              accept='.jpg,.png,.jpeg'
              onChange={onMutate}
            />
            <label className="createFormLabel">Notes</label>
            <textarea 
              type="text"
              className="createFormInput"
            />
            <label className="createFormLabel">Instagram</label>
            <input 
              type="text" 
              className="createFormInput" 
            />
            <label className="createFormLabel">YouTube</label>
            <input 
              type="text" 
              className="createFormInput" 
            />
            <button className="primaryButton">
              Submit
            </button>
          </form>
        </div>
      </div>
      
    )
  }
  