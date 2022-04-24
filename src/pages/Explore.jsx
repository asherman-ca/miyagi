import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Container, Nav, Form } from 'react-bootstrap'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import PostItem from '../components/PostItem'
import { toast } from 'react-toastify'

export default function Explore() {
  const params = useParams()
  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'posts')

        let q
        if (params.exploreParam == 'liked') {
          q = query(
            postsRef,
            orderBy('likes', 'desc'),
            limit(20)
          )
        } else {
          q = query(
            postsRef,
            orderBy('timestamp', 'desc'),
            limit(20)
          )
        }

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
  }, [params.exploreParam])

  const onSearch = async (e) => {
    e.preventDefault()
    const postsRef = collection(db, 'posts')
    let q
    if (params.exploreParam == 'liked') {
      q = query(
        postsRef,
        where('userName', '==', e.target.value),
        orderBy('likes', 'desc'),
        limit(10)
      )
    } else {
      q = query(
        postsRef,
        where('userName','==', e.target.value),
        orderBy('timestamp', 'desc'),
        limit(10)
      )
    }
    const querySnap = await getDocs(q)
    console.log('hits', querySnap)
    if(!querySnap.empty){
      let postArray = []
      querySnap.forEach(el => postArray.push({data: el.data(), id: el.id}))
      setPosts(postArray)
    }
  }

  return (
    <Container>
      <Row className="exploreContainer">
        <Col md={{ span: 8, offset: 2 }}>
        <Nav variant="tabs" defaultActiveKey="/" activeKey={params.exploreParam} className="mb-2">
          <Nav.Item>
            <Nav.Link eventKey="/" href="/" className="tabLink">Newest</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="liked" href="/liked" className="tabLink">Liked</Nav.Link>
          </Nav.Item>
          
          <Form className="exploreSearchBar">
            <Form.Control
              placeholder="Search User" 
              type="text"
              id="url"
              onChange={onSearch}
            />
          </Form>
        </Nav>
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
