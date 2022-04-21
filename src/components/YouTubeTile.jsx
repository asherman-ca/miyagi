import { Button } from 'react-bootstrap'

const YouTubeTile = ({postUser, currentUser, url, onYouTubeRemove}) => {
  return (
    <>
      <iframe height="315" width="100%" src={`https://www.youtube.com/embed/${url.split("=")[1]}`} title="YouTube video player" frameborder="0" className="previewFrame" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
      {postUser == currentUser &&
        <Button 
          variant="outline-danger socialColumnDelete" 
          onClick={() => onYouTubeRemove(url)}>
        Remove
        </Button>
      }
    </>
  )
}

export default YouTubeTile