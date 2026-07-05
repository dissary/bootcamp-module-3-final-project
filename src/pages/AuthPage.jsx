import { Col, Container, Image, Row, Button, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocalStorage } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo-barbell.png'

export default function AuthPage() {
    const url = "http://localhost:3000";
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [phone_number, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")
    const [authToken, setAuthToken] = useLocalStorage("authToken", "");
    
    const navigate = useNavigate();

    useEffect(() => {
        if(authToken) {
            navigate("/classes");
        }
    }, [authToken, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/signup`, { username, email, phone_number, password })
            console.log(res.data);

            handleClose();
        } catch (error) {
            console.error(error);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/login`, { username, password })
            if(res.data && res.data.auth === true && res.data.token) {
                setAuthToken(res.data.token);
                console.log("Login successfully, token saved.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container>

                <Image src={logo} width={100} height={100}/>
                <p className="fw-bold">Login to Gym Hood</p>

                <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicUsername">
                                <Form.Label className="fw-bold">Username</Form.Label>
                                <Form.Control 
                                onChange={(e) => setUsername(e.target.value)}
                                type="text" 
                                placeholder="Username"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label className="fw-bold">Password</Form.Label>
                                <Form.Control
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Password"/>
                            </Form.Group>

                    <Button className="rounded-pill" variant="dark" type="submit">
                        Login
                    </Button>
                </Form>

                <Button className="rounded-pill mt-2" variant="outline-dark" onClick={handleShow}>
                    Create new account
                </Button>
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Body>
                        <h2 className="mb-4" style={{ fontWeight: "bold" }}>
                            Create your account
                        </h2>
                        <Form className="d=grid gap-2 px-5" onSubmit={handleSignUp}>
                            <Form.Group className="mb-3" controlId="formBasicUsername">
                                <Form.Label className="fw-bold">Username</Form.Label>
                                <Form.Control 
                                onChange={(e) => setUsername(e.target.value)}
                                type="text" 
                                placeholder="Username"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="fw-bold">Email address</Form.Label>
                                <Form.Control 
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Email address"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicNumber">
                                <Form.Label className="fw-bold">Phone number</Form.Label>
                                <Form.Control 
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                type="text" 
                                placeholder="Phone number"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label className="fw-bold">Password</Form.Label>
                                <Form.Control
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Password"/>
                            </Form.Group>

                        <p style={{ fontSize: "12px"}}>
                            By tapping Sign Up, you agree to create an account and to Gym Hood's Terms, Privacy Policy and Cookies Policy.
                        </p>

                        <Button className="rounded-pill" variant="dark" type="submit">Sign Up</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
        </Container>
    )
}