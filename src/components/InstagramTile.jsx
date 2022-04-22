import { Button } from 'react-bootstrap'

const InstagramTile = ({postUser, currentUser, url, onInstaRemove}) => {
  return (
    <>
      <iframe src={`${url}embed`} height="540px" width="100%" frameborder="0" scrolling="yes" allowtransparency="true" className="previewFrame" />
      {postUser == currentUser &&
        <Button 
          variant="outline-danger" 
          onClick={() => onInstaRemove(url)}>
        Remove
        </Button>
      }
    </>
  )
}

export default InstagramTile