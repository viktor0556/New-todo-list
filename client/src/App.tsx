import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./UserComponents/Register";
import Login from "./UserComponents/Login";
import TodoInterface from "./UserComponents/TodoInterface";
import Guest from "./UserComponents/guest/Guest";
import Home from "./Home";
import ProtectedRoute from "./ProtectedRoute";

const App: React.FC = () => {
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

<Home />

export default App;
