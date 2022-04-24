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
          <span className="postItemTitleSpan">{post.title}</span>
          <span>{post.likes}</span>
          <i style={{marginLeft: '3px', paddingTop: '1.5px'}} class="bi bi-heart"></i>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default PostItem