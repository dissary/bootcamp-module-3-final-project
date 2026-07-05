import { Container, Button, Row, Card, Col, Spinner, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Classes() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    // modal
    const [modalShow, setModalShow] = useState(null);
    const handleShowAddClass = () => {
        setEditingClassId(null);
        setTitle("");
        setDescription("");
        setInstructor("");
        setStartTime("");
        setDuration("");
        setCapacity("");
        setModalShow("AddClass");
    }
    const handleShowEditClass = (cls) => {
    setEditingClassId(cls.id);
    setTitle(cls.title);
    setDescription(cls.description);
    setInstructor(cls.instructor);
    setStartTime(cls.start_time?.slice(0, 16)); // trim to match datetime-local format
    setDuration(cls.duration);
    setCapacity(cls.capacity);
    setModalShow("EditClass");
}

    const [editingClassId, setEditingClassId] = useState(null);

    // add & edit class
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [instructor, setInstructor] = useState("")
    const [start_time, setStartTime] = useState("")
    const [duration, setDuration] = useState("")
    const [capacity, setCapacity] = useState("")

    const url = "https://bootcamp-module-3-final-project-api.vercel.app";

    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const userId = decoded.id;
    const isAdmin = decoded.role === "admin";

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
    const handleClose = () => setModalShow(null);

    const handleEditClass = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`${url}/classes/${editingClassId}`, {
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

        return date.toLocaleString("en-MY", {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "numeric",
            hour12: true
        });
    };

    return (
        <Container className="mt-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3">
                
                <h1 className="mb-2 mb-sm-0">Available Classes</h1>

                {isAdmin && (
                    <Button
                        variant="dark"
                        onClick={handleShowAddClass}
                        className="align-self-sm-auto"
                    >
                        Add Class
                    </Button>
                )}

            </div>  
                {loading ? (
                    <div className="d-flex justify-content-center mt-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <Row>
                        {classes.map((cls) => (
                            <Col xs={12} key={cls.id} className="mb-3">
                                <Card className="mb-3 shadow-sm">
                                    <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                        
                                        <div className="d-flex align-items-center gap-3" style={{ minWidth: 0, flex: "1 1 auto" }}>
                                            <div className="border rounded p-3 text-center flex-shrink-0 dateCard">
                                                <h4 className="mb-1">{formatDateTime(cls.start_time)}</h4>
                                                <small>{cls.duration} minutes</small>
                                            </div>

                                            <div style={{ minWidth: 0 }}>
                                                <h5 className="mb-1">{cls.title}</h5>
                                                <div className="text-muted text-truncate">{cls.instructor}</div>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2 gap-sm-4 flex-shrink-0">

                                            <h5 className="mb-0 text-sm-end">
                                                {cls.total_bookings}/{cls.capacity}
                                            </h5>

                                            {cls.is_booked ? (
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => handleCancelBook(cls.id)}
                                                >
                                                    Cancel
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline-dark"
                                                    onClick={() => handleBook(cls.id)}
                                                >
                                                    Book
                                                </Button>
                                            )}

                                            {isAdmin && (
                                                <Button
                                                    variant="outline-dark"
                                                    onClick={() => handleShowEditClass(cls)}
                                                >
                                                    Edit
                                                </Button>
                                            )}

                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
                <Modal show={modalShow !== null} animation={false} onHide={handleClose} centered>
                    <Modal.Body className="d-grid gap-2 px-5">
                        <h2 className="mb-2" style={{ fontWeight: "bold"}}>
                            {modalShow === "AddClass" ? "Add Class" : "Edit Class"}
                        </h2>
                        <Form onSubmit={modalShow === "AddClass" ? handleAddClass : handleEditClass}>
                            <Form.Group className="mb-3" controlId="formBasicTitle">
                                <Form.Label className="fw-bold">Title</Form.Label>
                                <Form.Control 
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                type="text" 
                                placeholder="Title"
                                required/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicDescription">
                                <Form.Label className="fw-bold">Description</Form.Label>
                                <Form.Control
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                as="textarea"
                                rows={3}
                                placeholder="Description"
                                required/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicInstructor">
                                <Form.Label className="fw-bold">Instructor</Form.Label>
                                <Form.Control 
                                onChange={(e) => setInstructor(e.target.value)}
                                value = {instructor}
                                type="text" 
                                placeholder="Instructor Name"
                                required/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicTime">
                                <Form.Label className="fw-bold">Start Time</Form.Label>
                                <Form.Control 
                                onChange={(e) => setStartTime(e.target.value)}
                                value = {start_time}
                                type="datetime-local" 
                                placeholder="Start Time"
                                required/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicDuration">
                                <Form.Label className="fw-bold">Class Duration</Form.Label>
                                <Form.Control 
                                onChange={(e) => setDuration(e.target.value)}
                                value = {duration}
                                type="number" 
                                placeholder="Class Duration"
                                min = "30"
                                max = "60"
                                required/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicCapacity">
                                <Form.Label className="fw-bold">Capacity</Form.Label>
                                <Form.Control 
                                onChange={(e) => setCapacity(e.target.value)}
                                value = {capacity}
                                type="number" 
                                placeholder="Capacity"
                                min = "5"
                                max = "20"
                                required/>
                            </Form.Group>


                            <Button className="" variant="dark" type="submit">
                                {modalShow === "AddClass" ? "Add" : "Edit"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
        </Container>

    )
}