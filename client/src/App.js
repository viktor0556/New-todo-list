import React, { useState } from "react";
import TodoInterface from "./todo-interface";
import Register from "./Register";
import Login from "./Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSucces = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <>
          <Register />
          <Login onLoginSucces={handleLoginSucces}/>
        </>
      ) : (
        <TodoInterface />
      )}
    </div>
  );
}

export default App;
