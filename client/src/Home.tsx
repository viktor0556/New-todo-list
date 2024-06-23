import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

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

export default Home;