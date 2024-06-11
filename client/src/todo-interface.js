import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function TodoInterface() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/todos");
      setTodos(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const addTodo = async () => {
    try {
      const response = await axios.post("http://localhost:5000/todos", {
        description,
      });
      setTodos([...todos, response.data]);
      setDescription("");
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateTodo = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/todos/${id}`, { completed });
      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  

  return (
    <div>
      <div className="add-todo-container">
      <h1>To-Do List</h1>
      <div className="input-add-container">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="add-button" onClick={addTodo}>Add</button>
        </div>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.description}
            </span>
            <button onClick={() => updateTodo(todo.id, !todo.completed)}>
              {todo.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoInterface;