import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import { Row, Col, Container, Form, Button } from 'react-bootstrap'

function ForgotPassword() {
  const [email, setEmail] = useState('')

  const onChange = (e) => setEmail(e.target.value)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success('Email was sent')
    } catch (error) {
      toast.error('could not send reset email')
    }
  }

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="formBorder">
          <div className="formHeader">Reset Password</div>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Text className="text-muted">
                Email Address
              </Form.Text>
              <Form.Control
                type="email"
                placeholder="Enter email"
                id="email"
                onChange={onChange}
              />
            </Form.Group>
            <Button
              variant="outline-dark"
              type="submit"
            >
              Send Link
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default ForgotPassword