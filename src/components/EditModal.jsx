import { Modal, Form, Button } from 'react-bootstrap'

const EditModal = ({handleClose, onSubmit, title, notes, show, onChange, onDelete, id}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              id="title"
              placeholder={title}
              onChange={onChange}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control 
              onChange={onChange} id="notes" placeholder={notes} as="textarea" rows={3} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" className="postDeleteButton" onClick={() => onDelete(id)}>
          Delete Post
        </Button>
        <Button variant="outline-dark" onClick={handleClose}>
          Close
        </Button>
        <Button variant="outline-dark" onClick={onSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditModal