import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Container, Nav, Form, Spinner } from 'react-bootstrap'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import PostItem from '../components/PostItem'
import { toast } from 'react-toastify'
import { onOrderChange, onSearch } from '../actions/exploreActions'

export default function Explore() {
  const params = useParams()
  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchOrder, setSearchOrder] = useState('likes')
  const [searchWord, setSearchWord] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'posts')
        let  q = query(
          postsRef,
          orderBy('timestamp', 'desc'),
          limit(20)
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
  }, [params.exploreParam])

  return (
    <Container>
      <Row className="exploreContainer">
        <Col md={{ span: 8, offset: 2 }}>
        <Nav variant="tabs" defaultActiveKey="/" className="exploreNav">
          <Nav.Item>
            <Nav.Link eventKey="/" onClick={() => onOrderChange('timestamp', searchWord, setPosts, setSearchOrder)} className="tabLink">Newest</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="liked" onClick={() => onOrderChange('liked', searchWord, setPosts, setSearchOrder)} className="tabLink">Liked</Nav.Link>
          </Nav.Item>
          
          <Form className="exploreSearchBar">
            <Form.Control
              placeholder="Search User" 
              type="text"
              id="url"
              onChange={(e) => onSearch(e, setSearchWord, searchOrder, setPosts)}
            />
          </Form>
        </Nav>
        {loading && (
          <Container className="spinnerContainer">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>
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
