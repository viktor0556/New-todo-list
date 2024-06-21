import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./UserComponents/Register";
import Login from "./UserComponents/Login";
import TodoInterface from "./UserComponents/TodoInterface";
import Guest from "./UserComponents/guest/Guest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<TodoInterface />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest-todos" element={<Guest />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/login" style={{ textDecoration: "none" }}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" style={{ textDecoration: "none" }}>
              Registration
            </Link>
          </li>
          <li>
            <Link to="/guest-todos" style={{ textDecoration: "none" }}>
              Join as guest
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;
