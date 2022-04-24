import { Button, Card } from 'react-bootstrap'

const InstagramTile = ({postUser, currentUser, url, onInstaRemove}) => {
  return (
    <Card className="socialCardContainer">
      <iframe src={`${url.split('?')[0]}embed`} height="460" width="100%" frameborder="0" scrolling="yes" allowtransparency="true" className="previewFrame" />
      <Card.Body className="socialCardBody">
        {postUser == currentUser &&
          <Button 
            variant="outline-dark" 
            onClick={() => onInstaRemove(url)}>
          Remove
          </Button>
        }
      </Card.Body>
    </Card>
  )
}

export default InstagramTile