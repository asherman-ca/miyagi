import { Button, Card } from 'react-bootstrap'

const YouTubeTile = ({postUser, currentUser, url, onYouTubeRemove}) => {
  return (
    <Card className="socialCardContainer">
      <iframe height="315" width="100%" src={`https://www.youtube.com/embed/${url.split('').slice(url.length-11,url.length).join('')}`} title="YouTube video player" frameborder="0" className="previewFrame" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
      <Card.Body className="socialCardBody">
        {postUser == currentUser &&
          <Button 
            variant="outline-dark socialColumnDelete" 
            onClick={() => onYouTubeRemove(url)}>
          Remove
          </Button>
        }
      </Card.Body>
    </Card>
  )
}

export default YouTubeTile