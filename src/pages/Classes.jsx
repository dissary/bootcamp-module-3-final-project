import { Container, Button, Row, Card, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Classes() {
    const [classes, setClasses] = useState([]);

    const url = "http://localhost:3000";

    const fetchClasses = () => {
        fetch(
            `${url}/classes`
        )
        .then((response) => response.json())
        .then((data) => setClasses(data))
        .catch((error) => console.error("Error:", error));
    }

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleBooking = async (classId) => {
        const token = localStorage.getItem("authToken");

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        try {
            const res = await axios.post(`${url}/bookings`, { user_id: userId, class_id: classId  })
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container className="mt-4">
            <h1>Available Classes</h1>
            <Row>{classes.map((cls) => (
                <Col md={4} key={cls.id} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>{cls.title}</Card.Title>
                            <Card.Text>{cls.description}</Card.Text>
                            <Card.Text className="text-muted">{cls.instructor}</Card.Text>
                            <Card.Text>{cls.start_time}</Card.Text>
                            <Card.Text className="text-muted">{cls.duration} mins</Card.Text>
                            <Card.Text>{cls.capacity}</Card.Text>
                            <Button variant="dark" onClick={() => handleBooking(cls.id)}>
                                Book Class
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            ) )}
            </Row>
        </Container>
    )
}