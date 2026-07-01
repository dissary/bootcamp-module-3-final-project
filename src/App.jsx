import "bootstrap/dist/css/bootstrap.min.css"
import AuthPage from "./pages/AuthPage"
import BookingPage from "./pages/BookingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/classes" element={<BookingPage/>}/>
        <Route path="/login" element={<AuthPage/>}/>
        <Route path="*" element={<AuthPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}