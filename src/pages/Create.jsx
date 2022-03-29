  import { useState, useEffect, useRef } from 'react'
  import { getAuth, onAuthStateChanged } from 'firebase/auth'
  import { useNavigate } from 'react-router-dom'
  import Spinner from '../components/Spinner'
  import { toast } from 'react-toastify'



  export default function Create() {
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
      e.preventDefault()
      console.log('submit')
      setLoading(true)
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
            />
            <label className="createFormLabel">Image</label>
            <input 
              type='file' 
              className="createFormImage"
              id='imageUrl'
              accept='.jpg,.png,.jpeg'
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
  