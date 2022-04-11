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
              <Col>
                <Button
                    variant="outline-dark"
                    type="submit"
                  >
                    Sign In
                </Button>
                <Link to='/forgot-password'>
                  <Button className="resetButton" variant="outline-dark">
                    Reset Password
                  </Button>
                </Link>
              </Col>
              <Col className="googleCol">
                <OAuth />
              </Col>
            </Row>
          </Form>
          
        </Col>
      </Row>
    </Container>
    // <>
    //   <div className='pageContainer'>
    //     <header>
    //       <p className='pageHeader'>Welcome Back!</p>
    //     </header>

    //     <form onSubmit={onSubmit}>
    //       <input
    //         type='email'
    //         className='emailInput'
    //         placeholder='Email'
    //         id='email'
    //         value={email}
    //         onChange={onChange}
    //       />

    //       <div className='passwordInputDiv'>
    //         <input
    //           type={showPassword ? 'text' : 'password'}
    //           className='passwordInput'
    //           placeholder='Password'
    //           id='password'
    //           value={password}
    //           onChange={onChange}
    //         />

    //         <img
    //           src={visibilityIcon}
    //           alt='show password'
    //           className='showPassword'
    //           onClick={() => setShowPassword((prevState) => !prevState)}
    //         />
    //       </div>
          
    //       <Link to='/forgot-password' className='forgotPasswordLink'>
    //         Forgot Password
    //       </Link>

    //       <div className='signInBar'>
    //         <p className='signInText'>Sign In</p>
    //         <button className='signInButton'>
    //           <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
    //         </button>
    //       </div>
    //     </form>

    //     <OAuth />

    //     <Link to='/sign-up' className='registerLink'>
    //       Sign Up Instead
    //     </Link>
    //   </div>
    // </>
  )
}

export default SignIn