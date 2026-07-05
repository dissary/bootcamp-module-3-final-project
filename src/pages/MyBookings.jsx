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
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "numeric",
            hour12: true
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
                        <Col xs={12} key={booking.id} className="mb-3">
                            <Card className="mb-3 shadow-sm">
                            <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                
                                <div className="d-flex align-items-center">
                                    <div className="border rounded p-3 text-center me-3 flex-shrink-0 dateCard">
                                        <h5 className="mb-0">{formatDateTime(booking.start_time)}</h5>
                                        <small>{booking.duration} minutes</small>
                                    </div>

                                    <div>
                                        <h5 className="mb-1">{booking.title}</h5>
                                        <div className="text-muted">{booking.instructor}</div>
                                    </div>
                                </div>

                                <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2 gap-sm-4">
                                    <h5 className="mb-0 text-sm-end">
                                        {booking.total_bookings} / {booking.capacity}
                                    </h5>

                                    <Button
                                        variant="outline-danger"
                                        onClick={() => handleCancelBook(booking.id)}
                                    >
                                        Cancel
                                    </Button>
                                </div>

                            </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}