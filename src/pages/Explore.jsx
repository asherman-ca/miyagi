import React, { useEffect, useState } from 'react'
import { Row, Col, Container, Image } from 'react-bootstrap'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import PostItem from '../components/PostItem'
import { toast } from 'react-toastify'

export default function Explore() {
  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'posts')

        const q = query(
          postsRef,
          orderBy('timestamp', 'desc'),
          limit(10)
        )

        const querySnap = await getDocs(q)

        const posts = []

        querySnap.forEach((doc) => {
          return posts.push({
            id: doc.id,
            data: doc.data()
          })
        })

        setPosts(posts)
        setLoading(false)

      } catch (error) {
        toast.error('Could not fetch posts')
      }
    }

    fetchPosts()
  }, [])

  return (
    <Container>
      <Row className="exploreContainer">
        <Col md={{ span: 6, offset: 3 }}>
        {!loading && posts?.length > 0 && (
          <Row>
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
