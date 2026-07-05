import { Container, Button, Row, Card, Col, Spinner, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Profile() {
    const [userInfo, setUserInfo] = useState([]);   
    const [loading, setLoading] = useState(true);

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [phone_number, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")

    const url = "https://bootcamp-module-3-final-project-api.vercel.app";
    
const token = localStorage.getItem("authToken");

let userId = null;
if (token) {
  try {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  } catch (err) {
    console.error("Invalid token:", err);
  }
}

    const fetchUsers = async (userId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${url}/users/${userId}`, {
                params: { user_id: userId }
            });

            setUserInfo(res.data)
            setUsername(res.data.username)
            setEmail(res.data.email)
            setPhoneNumber(res.data.phone_number)

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleEditDetails = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${url}/users/${userId}`, {
                username, email, phone_number, password
            })

            fetchUsers(userId);
            alert("Details Updated.")
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchUsers(userId)
    },[])

    return(
        <Container className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}>

            <div
                className="p-4 shadow rounded-4 bg-white"
                style={{ width: "100%", maxWidth: "420px" }}
            >
                        <h1 className="pp-h1">My Profile</h1>
        {loading ? (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        ) : ( <Row>
            {userInfo && (
                <Col className="mb-3">

                    <Form className="profile-page" onSubmit={handleEditDetails}>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label className="fw-bold">Username</Form.Label>
                            <Form.Control 
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text" 
                            placeholder="Username"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="fw-bold">Email address</Form.Label>
                            <Form.Control 
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="Email address"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicNumber">
                            <Form.Label className="fw-bold">Phone number</Form.Label>
                            <Form.Control 
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phone_number}
                            type="text" 
                            placeholder="Phone number"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className="fw-bold">Password</Form.Label>
                            <Form.Control
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            required/>
                        </Form.Group>
                        <Button className="rounded-pill" variant="dark" type="submit">Update</Button>
                    </Form>

                </Col>
            )}
            </Row>
        )}
        </div>
        </Container>
    )
}