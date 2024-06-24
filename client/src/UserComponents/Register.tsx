import React, { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import './styles/Register.css'

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await api.post("/register", {
        username,
        password,
      });
      console.log(response.data);
      navigate("/login");
      console.log("Successful login!");
    } catch (err) {
      if (err instanceof Error) {
        setError((err).message);
      } else {
        console.error("An unknow error occured.");
      }
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleRegister}>Register</button>
      <br />
      <span>Already have an account?</span>
      <br />
      <button className="login-button" onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
};

export default Register;
