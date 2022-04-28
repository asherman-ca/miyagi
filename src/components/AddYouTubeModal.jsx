import { Modal, Form, Button } from 'react-bootstrap'
import { useState } from 'react'

const AddYouTubeModal = ({handleYouTubeAddClose, onYouTubeAdd, youTubeAddShow}) => {
  const [url, setUrl] = useState(null)

  const onChange = (e) => {
    e.preventDefault()
    setUrl(() => (e.target.value))
  }

  return (
    <Modal show={youTubeAddShow} onHide={handleYouTubeAddClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add YouTube</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <Form.Control 
              type="text"
              id="url"
              onChange={onChange}
              autoFocus
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={handleYouTubeAddClose}>
          Close
        </Button>
        <Button variant="outline-dark" onClick={() => onYouTubeAdd(url)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddYouTubeModal