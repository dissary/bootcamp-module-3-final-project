import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Container, Card, Row, Col, Button, Spinner } from "react-bootstrap";

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = "http://localhost:3000";

    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const fetchBookings = async (userId) => {
        setLoading(true);

        try {
            const res = await axios.get(`${url}/classes/booked/${userId}`, {
                params: { user_id: userId }
            });

            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // const fetchBookings = (userId) => {
    //     fetch(
    //         `${url}/classes/booked/${userId}`
    //     )
    //     .then((response) => response.json())
    //     .then((data) => setBookings(data))
    //     .catch((error) => console.error("Error:", error));
    // }

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if(token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            fetchBookings(userId);
        }
    }, []);

    const handleCancelBook = async (classId) => {
        try {
            await axios.delete(`${url}/classes/${classId}/${userId}`);

            fetchBookings(userId);
        } catch (error) {
            console.error(error);
        }
    };

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
            <h1>My Bookings</h1>
            {loading ? (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
            ) : (
                <Row>
                    {bookings.map((booking) => (
                        <Col md={4} key={booking.id} className="mb-3">
                            <Card>
                                <Card.Header>{formatDateTime(booking.start_time)}</Card.Header>
                                <Card.Body>
                                    <Card.Title>{booking.title}</Card.Title>
                                    <Card.Text className="text-muted">{booking.instructor}</Card.Text>
                                    <Card.Text className="text-muted">{booking.duration} mins</Card.Text>
                                    <Card.Text>{booking.total_bookings} / {booking.capacity}</Card.Text>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleCancelBook(booking.id)}
                                    >
                                        Cancel Book <i className="bi bi-x-circle"></i>
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}