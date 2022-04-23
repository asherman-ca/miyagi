import { Link } from 'react-router-dom'
import { Card, Col } from 'react-bootstrap'

function PostItem({post, id}) {
  return (
    <Col className="postItemCol" xs={4}>
      <Card className="postItemCard">
        <Link to={`/post/${id}`}>
          <Card.Img className="cardImage" variant="top" src={post.imgUrls[0]}/>
        </Link>
        <Card.Body className="postItemBody">
          <Card.Title className="cardTitleText">{post.title}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default PostItem