import React, { useState } from "react";
import TodoInterface from "./todo-interface";
import Register from "./Register";
import Login from "./Login";
import {
  BrowserRouter as Routes,
  Route,
  Router,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoInterface />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
