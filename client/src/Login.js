import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSucces }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:2000/login", {
        username, 
        password
      });
      localStorage.setItem("token", response.data.token);
      console.log(response.data);
      onLoginSucces();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
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
    </div>
  )
}

export default Login;