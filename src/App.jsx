import "bootstrap/dist/css/bootstrap.min.css"
import AuthPage from "./pages/AuthPage"
import Classes from "./pages/Classes";
import Bookings from "./pages/Bookings";
import logo from './assets/logo-barbell.png'
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { Nav, Navbar, Container, Button } from "react-bootstrap"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

function Layout() {
  const [authToken, setAuthToken] = useLocalStorage("authToken", "")
  const navigate = useNavigate();

  useEffect(() => {
    if(!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]);

  const handleLogout = () => {
    setAuthToken("");
    navigate("/login");
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/classes" className="fs-2 "><img 
          width="50" 
          height="50" 
          src={logo}
          className="d-inline-block align-top"/> Gym Hood</Navbar.Brand>
          <Navbar.Toggle/>
            <Navbar.Collapse>
              <Nav className="me-auto">
                <Nav.Link href="/classes">Home</Nav.Link>
                <Nav.Link href="/classes">Classes</Nav.Link>
                <Nav.Link href="/bookings">Bookings</Nav.Link>
              </Nav>
              <Nav className="ms-auto">
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>     
              </Nav>
            </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet/>
    </>
  )
}

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<Layout/>}>
          <Route path="/classes" element={<Classes/>}/> 
          <Route path="/bookings" element={<Bookings/>}/> 
        </Route>
        <Route path="/login" element={<AuthPage/>}/>
        <Route path="*" element={<AuthPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}