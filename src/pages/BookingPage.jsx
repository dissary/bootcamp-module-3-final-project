import { Nav, Navbar, Container, Button } from "react-bootstrap";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import logo from '../assets/logo-barbell.png'

export default function BookingPage() {
    const [authToken, setAuthToken] = useLocalStorage("authToken", "");
    const navigate = useNavigate();

    useEffect(() => {
        if(!authToken) {
            navigate('/login')
        }
    }, [authToken, navigate]);

    const handleLogout = () => {
        setAuthToken("");
    };

    return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/" className="fs-2 "><img 
          width="50" 
          height="50" 
          src={logo}
          className="d-inline-block align-top"/> Gym Hood</Navbar.Brand>
          <Navbar.Toggle/>
            <Navbar.Collapse>
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
              </Nav>
              <Nav className="ms-auto">
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
    )
}