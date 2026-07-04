import { Container, Button, Row, Card, Col, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Classes() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

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
                            <Card.Header>{formatDateTime(cls.start_time)}</Card.Header>
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
    </Container>

    )
}