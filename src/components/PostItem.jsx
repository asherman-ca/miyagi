import { Link } from 'react-router-dom'
import { Card, Col } from 'react-bootstrap'

function PostItem({post, id}) {
  console.log('post', post)
  return (
    <Col md={4}>
      <Card.Img className="cardImage" variant="top" src={post.imgUrls[0]}/>
      <Card.Body>
        <Card.Title className="cardTitleText">{post.title}</Card.Title>
      </Card.Body>
    </Col>
  )
}

export default PostItem