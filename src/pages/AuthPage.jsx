import { Col, Image, Row, Button, Modal, Form } from 'react-bootstrap';
import { useEffect, useState } from "react"
import axios from "axios";
import { useLocalStorage } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-barbell.png'

export default function AuthPage() {
    const url = "http://localhost:3000";
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [authToken, setAuthToken] = useLocalStorage("authToken", "");

    const navigate = useNavigate();

    useEffect(() => {
        if(authToken) {
            navigate("/classes");
        }
    }, [authToken, navigate])

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/signup`, { email, password, phone_number });
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/login`, { email, password });
            if(res.data && res.data.auth === true && res.data.token) {
                setAuthToken(res.data.token);
                console.log("Login successfully, token saved.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
    <div style={{ 
      display: 'grid', 
      placeItems: 'center', 
    }}>
        <img className="mt-3" width="150" height="150" src={logo}/>
            <Col className='p-4'>
                <p className='my-2' style={{ fontSize: 18, fontWeight: "500" }}>Log in to Gym Hood</p>
                <p></p>
                <Col className='d-grid gap-2'>
                        <Form className='d-grid gap-2' onSubmit={handleLogin}>
                            <Form.Group className='mb-3' controlId='formBasicEmail'>
                                <Form.Control
                                onChange={(e) => setEmail(e.target.value)} 
                                type="email"
                                placeholder='Enter email'
                                required/>
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='formBasicPassword'>
                                <Form.Control
                                onChange={(e) => setPassword(e.target.value)} 
                                type="password"
                                placeholder='Enter password'
                                required/>
                            </Form.Group>
                            <Button className='rounded-pill' variant="dark" type="submit">Sign In</Button>
                        </Form>
                    <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                    }}
                    >
                    <hr style={{ flex: 1 }} />
                    <span>or</span>
                    <hr style={{ flex: 1 }} />
                    </div>

                    <Button className="rounded-pill" variant="outline-dark">
                        <i className='bi bi-google'></i> Continue with Google
                    </Button>
                    <p style={{ fontSize: "12px" }}>
                        By signing up, you agree to our Terms of Service, Privacy Policy and Cookie Use.
                    </p>

                    <p  style={{ fontWeight: "500" }}>
                        Don't have an account?
                    </p>
                    <Button className='rounded-pill' variant="dark" onClick={handleShow}>Create an account</Button>
                </Col>
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Body className='d-grid gap-2 px-5'>
                        <h2 className='mb-4' style={{ fontWeight: "bold"}}>
                            Create your account
                        </h2>
                        <Form className='d-grid gap-2 px-5' onSubmit={handleSignUp}>
                            <Form.Group className='mb-3' controlId='formBasicEmail'>
                                <Form.Control
                                onChange={(e) => setEmail(e.target.value)} 
                                type="email"
                                placeholder='Enter email'
                                required/>
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='formBasicPassword'>
                                <Form.Control
                                onChange={(e) => setPassword(e.target.value)} 
                                type="password"
                                placeholder='Enter password'
                                required/>
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='formBasicPhone'>
                                <Form.Control
                                onChange={(e) => setPhoneNumber(e.target.value)} 
                                type="text"
                                placeholder='Enter phone number'
                                required
                                maxLength={15}/>
                            </Form.Group>

                            <p style={{ fontSize: "12px"}}>
                                By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use. 
                                <br/>
                                <br/>
                                Gym Hood may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy, like keeping your account seceure and personalising our services, including ads. 
                                <br/>
                                <br/>
                                Others will be able to find you by email or phone number, when provided, unless you choose otherwise here.
                            </p>
                            <Button className='rounded-pill' variant="dark" type="submit">
                                Sign Up
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Col>
        </div>
    )
}