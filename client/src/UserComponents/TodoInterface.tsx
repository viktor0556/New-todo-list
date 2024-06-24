import React, { useState, useEffect, ChangeEvent } from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "./api";
import "./styles/App.css";
import { useNavigate } from "react-router-dom";

interface Todo {
  id: number;
  description: string;
  completed: boolean;
  selectedtime: string;
  priority: string;
}

const TodoInterface: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState<string>("");
  const [selectedtime, setSelectedtime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [priority, setPriority] = useState<string>("medium"); // default medium
  const navigate = useNavigate();

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const cleanedTime = (selectedtime: string) => {
    return selectedtime.replace(/:00$/, "");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchTodosFromAPI();
    }
  }, [navigate]);

  const fetchTodosFromAPI = async () => {
    try {
      const todos = await fetchTodos();
      setTodos(todos);
    } catch (err) {
      if ((err as Error).message === "Token expired") {
        setError("Session expired. Please log in again.");
        navigate("/login");
      } else {
        console.error("Fetch Todos Error:", (err as Error).message);
        setTodos([]);
      }
    }
  };

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedtime(event.target.value);
  };

  const handleAddTodo = async () => {
    try {
      if (description.trim() !== "") {
        const newTodo = await addTodo(description, selectedtime, priority);
        setTodos([...todos, newTodo]);
        setDescription("");
        setSelectedtime("");
        setPriority("medium");
      } else {
        alert("Fill in the field");
      }
    } catch (err) {
      if ((err as Error).message === "Token expired") {
        setError("Session expired. Please log in again");
      } else {
        console.error("Add Todo Error:", (err as Error).message);
      }
    }
  };

  const handleUpdateTodo = async (
    id: number,
    completed: boolean,
    description: string,
    selectedtime: string,
    priority: string
  ) => {
    try {
      await updateTodo(id, completed, description, selectedtime, priority);
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed, selectedtime } : todo
        )
      );
    } catch (err) {
      if ((err as Error).message === "Token expired") {
        setError("Session expired. Please log in again.");
      } else {
        console.error("Update Todo Error:", (err as Error).message);
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      if ((err as Error).message === "Token expired") {
        setError("Session expired. Please log in again.");
      } else {
        console.error("Delete Todo Error:", (err as Error).message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error) {
    return (
      <div>
        {error}
        <button onClick={() => navigate("/login")}>Go to login</button>
      </div>
    );
  }

  return (
    <div className="todo-app">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <div className="add-todo-container">
        <h1 className="title">To-Do List</h1>
        <div className="input-add-container">
          <div className="time-input-container">
            <input
              className="time-input"
              type="time"
              value={selectedtime}
              onChange={handleTimeChange}
            />
            <select
              className="priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="easy" className="priority-option">
                Easy
              </option>
              <option value="medium" className="priority-option">
                Medium
              </option>
              <option value="hard" className="priority-option">
                Hard
              </option>
            </select>
          </div>
          <input
            className="todo-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="add-button" onClick={handleAddTodo}>
            Add
          </button>
        </div>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <div className="todo-info">
              <span className="priority">
                {capitalizeFirstLetter(todo.priority)} Task
              </span>
              <span className="description">{todo.description}</span>
              <span className="selectedtime">
                {cleanedTime(todo.selectedtime)}
              </span>
            </div>
            <div className="complete-delete-container">
              <button
                className="update-button"
                onClick={() =>
                  handleUpdateTodo(
                    todo.id,
                    !todo.completed,
                    todo.description,
                    todo.selectedtime,
                    todo.priority
                  )
                }
              >
                {todo.completed ? "Undo" : "Complete"}
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoInterface;
