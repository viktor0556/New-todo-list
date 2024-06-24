import React from "react";
import { Link } from "react-router-dom";
import './UserComponents/styles/Home.css'

const Home: React.FC = () => {
  return (
    <div className="navbar">
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
