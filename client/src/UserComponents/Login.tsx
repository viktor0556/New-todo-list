import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import './styles/Login.css'

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      console.log(response.data);
      navigate("/todo");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login Error:", (err as Error).message);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p>{error}</p>}
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
      <button onClick={handleLogin}>Login</button>
      <br />
      <span>Don't have an account?</span>
      <br />
      <button
        className="create-account-button"
        onClick={() => navigate("/register")}
      >
        Create account
      </button>
    </div>
  );
};

export default Login;
