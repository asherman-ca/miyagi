import { toast } from 'react-toastify'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import OAuth from '../components/OAuth'
import { setDoc, doc, serverTimestamp, collection, query, where, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase.config'
import { ReactComponent as ArrowRightIcon } from '../assets/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/visibilityIcon.svg'
import { Row, Col, Container, Form, Button } from 'react-bootstrap'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    imageUrl: ''
  })
  const { name, email, password } = formData

  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const existingUserRef = collection(db, 'users')
    const q = query(
      existingUserRef,
      where('name', '==', formData.name),
      limit(10)
    )
    const q2 = query(
      existingUserRef,
      where('email', '==', formData.email),
      limit(10)
    )
    const existingUserSnap = await getDocs(q)
    const existingUserSnap2 =  await getDocs(q2)
    if(existingUserSnap.empty && existingUserSnap2.empty){
      try {
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )

        const user = userCredential.user

        // adds a displayName to our new auth object for this user. Oauth'd users already have displayname set by their providers
        updateProfile(auth.currentUser, {
          displayName: name,
        })

        const formDataCopy = { ...formData }
        delete formDataCopy.password
        formDataCopy.timestamp = serverTimestamp()

        await setDoc(doc(db, 'users', user.uid), formDataCopy)
        toast.success('User created')

        navigate('/')
      } catch (error) {
        toast.error('Something went wrong with registration')
      }
    }
    else {
      toast.error('Name or email taken')
    }
  }

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="formBorder">
          <div className="formHeader">Sign Up</div>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Text className="text-muted">
                Name
              </Form.Text>
              <Form.Control
                type="name"
                placeholder="Enter name"
                id="name"
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Text className="text-muted">
                Email
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
              <Col xs={8} style={{paddingRight: '0px'}}>
                <Button
                    variant="outline-dark"
                    type="submit"
                    className="authButton"
                  >
                    Sign-Up
                </Button>
              </Col>
              <Col style={{paddingLeft: '0px'}} className="googleCol" xs={4}>
                <OAuth />
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default SignUp