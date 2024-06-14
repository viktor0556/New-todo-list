import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:4000/register", {
        username,
        password,
      });
      console.log(response.data);
      navigate('/login');
      console.log('Successful login!')
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        console.error(err.message);
      }
      
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
      <br/>
      <span>Already have an account?</span>
      <br/>
      <button onClick={() => navigate('/login')}>Login</button>
    </div>
  );
}

export default Register;
