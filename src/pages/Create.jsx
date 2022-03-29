  import { useState, useEffect, useRef } from 'react'
  import { getAuth, onAuthStateChanged } from 'firebase/auth'
  import { useNavigate } from 'react-router-dom'
  import Spinner from '../components/Spinner'
  import { toast } from 'react-toastify'

  export default function Create() {
    return (
      <div className="pageContainer">
        <div className="contentContainer">
          <form className="createFormContainer" onSubmit={() => console.log('hits')}>
            <label className="createFormLabel">Image</label>
            <input 
              type='file' 
              className='createFormInput'
              id='imageUrl'
              accept='.jpg,.png,.jpeg'
            />
            <label className="createFormLabel">Title</label>
            <input 
              type="text" 
              className="createFormInput" 
            />
            <label className="createFormLabel">Note</label>
            <input 
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
  