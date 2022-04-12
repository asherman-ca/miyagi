import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { Container, Row, Col } from 'react-bootstrap'

const Post = () => {
  return(
    <div>Edit Post</div>
  )
}

export default Post