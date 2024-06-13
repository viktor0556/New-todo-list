import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username, 
        password,
      });
      localStorage.setItem("token", response.data.token);
      console.log(response.data);
      navigate('/todo')
    } catch (err) {
      setError("Login failed. Please try again.")
      console.error(err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
      type='text'
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder='Username'
      />
      <input
      type='password'
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder='Password'
      />
      <button onClick={handleLogin}>Login</button>
        <br/>
      <span>Dont have account?</span>
      <br/>
      <button onClick={() => navigate('/register')}>Create account</button>
    </div>
  )
}

export default Login;