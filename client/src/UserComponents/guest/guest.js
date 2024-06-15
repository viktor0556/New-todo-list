import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/App.css";

const GuestComponent = () => {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [selectedtime, setSelectedtime] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/guest-todos", {
      });
      console.log("API Response:", response.data);
    } catch (err) {
      console.error("Fetch Todos Error:", err.message);
      setTodos([]);
    }
  };

  const handleTimeChange = (event) => {
    setSelectedtime(event.target.value);
  };

  const addTodo = async () => {
    try {
      if (description.trim() !== "") {
        const response = await axios.post(
          "http://localhost:4000/guest-todos",
          {
            description,
            selectedtime,
          },
        );
        setTodos([...todos, response.data]);
        setDescription("");
        setSelectedtime("");
      } else {
        alert("Fill in the field");
      }
    } catch (err) {
      console.error("Add Todo Error:", err.message);
    }
  };

  const updateTodo = async (id, completed, description, selectedtime) => {
    try {
      await axios.put(
        `http://localhost:4000/guest-todos/${id}`,
        {
          id,
          completed,
          description,
          selectedtime,
        }
      );
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed, selectedtime } : todo
        )
      );
    } catch (err) {
      console.error("Update Todo Error:", err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/guest-todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Delete Todo Error:", err.message);
    }
  };

  return (
    <div>
      <div className="add-todo-container">
        <h1>To-Do List</h1>
        <div className="input-add-container">
          <div className="time-input-container">
            <input
              className="time-input"
              type="time"
              value={selectedtime}
              onChange={handleTimeChange}
            />
          </div>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="add-button" onClick={addTodo}>
            Add
          </button>
        </div>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span className={todo.completed ? "completed" : ""}>
              {todo.description}
            </span>
            <span>{todo.selectedtime}</span>
            <button
              onClick={() =>
                updateTodo(
                  todo.id,
                  !todo.completed,
                  todo.description,
                  todo.selectedtime
                )
              }
            >
              {todo.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GuestComponent;
