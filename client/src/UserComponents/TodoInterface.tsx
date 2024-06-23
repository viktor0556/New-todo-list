import React, { useState, useEffect, ChangeEvent } from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "./api";
import "./styles/App.css";
import { useNavigate } from 'react-router-dom';

interface Todo {
  id: number;
  description: string;
  completed: boolean;
  selectedtime: string;
}

const TodoInterface: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState<string>("");
  const [selectedtime, setSelectedtime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchTodosFromAPI();
    }
  }, [navigate]);

  const fetchTodosFromAPI = async () => {
    try {
      const todos = await fetchTodos();
      setTodos(todos);
    } catch (err) {
      if ((err as Error).message === 'Token expired') {
        setError('Session expired. Please log in again.');
        navigate('/login');
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
        const newTodo = await addTodo(description, selectedtime);
        setTodos([...todos, newTodo]);
        setDescription("");
        setSelectedtime("");
      } else {
        alert("Fill in the field");
      }
    } catch (err) {
      if ((err as Error).message === 'Token expired') {
        setError('Session expired. Please log in again')
      } else {
        console.error("Add Todo Error:", (err as Error).message);
      }
    }
  };

  const handleUpdateTodo = async (id: number, completed: boolean, description: string, selectedtime: string) => {
    try {
      await updateTodo(id, completed, description, selectedtime);
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed, selectedtime } : todo
        )
      );
    } catch (err) {
      if ((err as Error).message === 'Token expired') {
        setError('Session expired. Please log in again.');
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
      if ((err as Error).message === 'Token expired') {
        setError('Session expired. Please log in again.');
      } else {
        console.error("Delete Todo Error:", (err as Error).message);
      }
    }
  };

  if (error) {
    return (
    <div>
      {error}
      <button onClick={() => navigate('/login')}>Go to login</button>
      </div>
      )
  }

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
          <button className="add-button" onClick={handleAddTodo}>
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
                handleUpdateTodo(
                  todo.id,
                  !todo.completed,
                  todo.description,
                  todo.selectedtime
                )
              }
            >
              {todo.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoInterface;