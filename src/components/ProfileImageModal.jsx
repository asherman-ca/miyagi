import { Modal, Form, Button } from 'react-bootstrap'

const ProfileImageModal = ({handleClose, onImageUpdate, onImageSubmit, show }) => {

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onImageSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                id="image"
                accept=".jpg,.png,.jpeg"
                onChange={onImageUpdate}
                required
              />
            </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={handleClose}>
          Close
        </Button>
        <Button variant="outline-dark" onClick={onImageSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ProfileImageModal