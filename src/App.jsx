import "bootstrap/dist/css/bootstrap.min.css"
import AuthPage from "./pages/AuthPage"
import Classes from "./pages/Classes";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import logo from './assets/logo-barbell.png'
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { Nav, Navbar, Container, Button } from "react-bootstrap"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { jwtDecode } from "jwt-decode";
import './App.css'
import axios from "axios";

function Layout() {
  const [authToken, setAuthToken] = useLocalStorage("authToken", "")
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

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

  const fetchUsername = async (userId) => {
        try {
            const res = await axios.get(`${url}/users/${userId}`, {
                params: { user_id: userId }
            });

            setUsername(res.data);
        } catch (err) {
            console.error(err);
        }
  }

useEffect(() => {
  if (!authToken) {
    navigate('/login');
    return;
  }
  if (userId) {
    fetchUsername(userId);
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

                <Nav.Link href="/classes">Classes</Nav.Link>
                <Nav.Link href="/mybookings">My Bookings</Nav.Link>
              </Nav>
              <Nav className="ms-auto">
                {username && (
                  <Nav.Link href="/profile">Welcome Back, {username.username}!</Nav.Link>
                )}   
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
          <Route path="/mybookings" element={<MyBookings/>}/> 
          <Route path="/profile" element={<Profile/>}/> 
        </Route>
        <Route path="/login" element={<AuthPage/>}/>
        <Route path="*" element={<AuthPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}