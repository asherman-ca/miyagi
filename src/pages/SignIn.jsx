import { toast } from 'react-toastify'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import OAuth from '../components/OAuth'
import { ReactComponent as ArrowRightIcon } from '../assets/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/visibilityIcon.svg'
import { Row, Col, Container, Form, Button } from 'react-bootstrap'

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData

  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      if (userCredential.user) {
        navigate('/profile')
      }
    } catch (error) {
      toast.error('Bad User Credentials')
    }
  }

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="formBorder">
          <div className="formHeader">Sign In</div>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Text className="text-muted">
                Email address
              </Form.Text>
              <Form.Control
                type="email"
                placeholder="Enter email"
                id="email"
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Text className="text-muted">
                Password
              </Form.Text>
              <Form.Control
                type="password"
                placeholder="Enter password"
                id="password"
                onChange={onChange}
              />
            </Form.Group>

            <Row>
              <Col xs={8}>
                <Button
                    variant="outline-dark authButton"
                    type="submit"
                  >
                    Sign-In
                </Button>
                <Link to='/forgot-password'>
                  <Button className="resetButton authButton" variant="outline-dark">
                    Reset Password
                  </Button>
                </Link>
              </Col>
              <Col xs={4} className="googleCol">
                <OAuth />
              </Col>
            </Row>
          </Form>
          
        </Col>
      </Row>
    </Container>
  )
}

export default SignIn