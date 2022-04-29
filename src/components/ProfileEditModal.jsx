import { Modal, Form, Button } from 'react-bootstrap'

const ProfileEditModal = ({handleEditClose, onNameChange, onNameSubmit, editShow, placeHolder }) => {

  return (
    <Modal show={editShow} onHide={handleEditClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Name</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onNameSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                id="name"
                onChange={onNameChange}
                placeholder={placeHolder}
                required
              />
            </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={handleEditClose}>
          Close
        </Button>
        <Button variant="outline-dark" onClick={onNameSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ProfileEditModal