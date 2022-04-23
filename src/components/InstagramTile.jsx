import { Button, Card } from 'react-bootstrap'

const InstagramTile = ({postUser, currentUser, url, onInstaRemove}) => {
  return (
    <Card className="socialCardContainer">
      {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
      <iframe src={`${url}embed`} height="460" width="100%" frameborder="0" scrolling="yes" allowtransparency="true" className="previewFrame" />
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

    // <>
    //   <iframe src={`${url}embed`} height="460" width="100%" frameborder="0" scrolling="yes" allowtransparency="true" className="previewFrame" />
      // {postUser == currentUser &&
      //   <Button 
      //     variant="outline-dark" 
      //     onClick={() => onInstaRemove(url)}>
      //   Remove
      //   </Button>
      // }
    // </>
  )
}

export default InstagramTile