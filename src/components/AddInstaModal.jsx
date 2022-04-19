import { Modal, Form, Button } from 'react-bootstrap'
import { useState } from 'react'

const AddInstaModal = ({handleInstaAddClose, onInstaAdd, instaAddShow}) => {
  const [url, setUrl] = useState('')

  const onChange = (e) => {
    e.preventDefault()
    console.log(e.target.value)
    setUrl((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
    console.log('modal onchange insta', url)
  }

  return (
    <Modal show={instaAddShow} onHide={handleInstaAddClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Instagram</Modal.Title>
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
        <Button variant="secondary" onClick={handleInstaAddClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onInstaAdd(url.url)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddInstaModal