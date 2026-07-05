import { Container, Button, Row, Card, Col, Spinner, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Classes() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    // modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // add class
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [instructor, setInstructor] = useState("")
    const [start_time, setStartTime] = useState("")
    const [duration, setDuration] = useState("")
    const [capacity, setCapacity] = useState("")

    const url = "http://localhost:3000";

    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const fetchClasses = async () => {
        setLoading(true);

        try {
            const res = await axios.get(`${url}/classes`, {
                params: { user_id: userId }
            });

            setClasses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${url}/classes`, {
                title: title,
                description: description,
                instructor: instructor,
                start_time: start_time,
                duration: duration,
                capacity: capacity
            })
        alert('Add class done')
        fetchClasses();
        handleClose();
        } catch (err) {
            alert('add class fail')
            console.error(err);
        }
    }

    const handleEditClass = async (classId) => {

        try {
            await axios.put(`${url}/classes/${classId}`, {
                title: title,
                description: description,
                instructor: instructor,
                start_time: start_time,
                duration: duration,
                capacity: capacity
            })
        alert('edit class done')
        fetchClasses();
        handleClose();
        } catch (err) {
            alert('edit class fail')
            console.error(err);
        }
    }

    const handleBook = async (classId) => {
        try {
            await axios.post(`${url}/bookings`, {
                class_id: classId,
                user_id: userId
            });
            fetchClasses();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancelBook = async (classId) => {
        await axios.delete(`${url}/classes/${classId}/${userId}`);
        fetchClasses();
    };

    useEffect(() => {
        fetchClasses();
    }, []);


    const formatDateTime = (isoString) => {
        const date = new Date(isoString);

        return date.toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    };

    return (
<Container className="mt-4">
        <h1>Available Classes</h1>
        <Button className="mb-3" variant="dark" onClick={handleShow}>Add Class</Button>

        {loading ? (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        ) : (
            <Row>
                {classes.map((cls) => (
                    <Col md={4} key={cls.id} className="mb-3">
                        <Card>
                            <Card.Header>
                                {formatDateTime(cls.start_time)}
                                </Card.Header>
                            <Card.Body>
                                <Card.Title>{cls.title}</Card.Title>
                                <Card.Text className="text-muted">{cls.instructor}</Card.Text>
                                <Card.Text className="text-muted">{cls.duration} mins</Card.Text>
                                <Card.Text>
                                    {cls.total_bookings} / {cls.capacity}
                                </Card.Text>

                                {cls.is_booked ? (
                                    <Button
                                        variant="danger"
                                        onClick={() => handleCancelBook(cls.id)}
                                    >
                                        Cancel <i className="bi bi-x-circle"></i>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="dark"
                                        onClick={() => handleBook(cls.id)}
                                    >
                                        Book <i className="bi bi-check-circle"></i>
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        )}
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className="d-grid gap-2 px-5">
                <h2 className="mb-4" style={{ fontWeight: "bold"}}>
                    Add Classes
                </h2>
                <Form onSubmit={handleAddClass}>
                    <Form.Group className="mb-3" controlId="formBasicTitle">
                        <Form.Label className="fw-bold">Title</Form.Label>
                        <Form.Control 
                        onChange={(e) => setTitle(e.target.value)}
                        type="text" 
                        placeholder="Title"
                        required/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicDescription">
                        <Form.Label className="fw-bold">Description</Form.Label>
                        <Form.Control
                        onChange={(e) => setDescription(e.target.value)}
                        as="textarea"
                        rows={3}
                        placeholder="Description"
                        required/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicInstructor">
                        <Form.Label className="fw-bold">Instructor</Form.Label>
                        <Form.Control 
                        onChange={(e) => setInstructor(e.target.value)}
                        type="text" 
                        placeholder="Instructor Name"
                        required/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicTime">
                        <Form.Label className="fw-bold">Start Time</Form.Label>
                        <Form.Control 
                        onChange={(e) => setStartTime(e.target.value)}
                        type="datetime-local" 
                        placeholder="Start Time"
                        required/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicDuration">
                        <Form.Label className="fw-bold">Class Duration</Form.Label>
                        <Form.Control 
                        onChange={(e) => setDuration(e.target.value)}
                        type="number" 
                        placeholder="Class Duration"
                        required/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicCapacity">
                        <Form.Label className="fw-bold">Capacity</Form.Label>
                        <Form.Control 
                        onChange={(e) => setCapacity(e.target.value)}
                        type="number" 
                        placeholder="Capacity"
                        required/>
                    </Form.Group>


                    <Button className="rounded-pill" variant="dark" type="submit">
                        Add Class
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    </Container>

    )
}