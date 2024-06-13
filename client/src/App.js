import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import TodoInterface from './components/todo-interface.js';

function App() {
  return (
    <Router>
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<TodoInterface />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}


function Home() {
  return (
    <div>
        <nav>
          <ul>
            <li><Link to="/login" style={{ textDecoration: 'none'}}>Login</Link></li>
            <li><Link to="/register" style={{ textDecoration: 'none'}}>Registration</Link></li>
            <li><Link to="todo" style={{ textDecoration: 'none'}}>Join as guest</Link></li>
          </ul>
        </nav>
      </div>
  );
}

export default App;
