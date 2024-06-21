import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import "./styles/App.css";

interface Todo {
  id: number;
  description: string;
  completed: boolean;
  selectedtime: string;
}

function TodoInterface() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState<string>("");
  const [selectedtime, setSelectedtime] = useState<string>("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response:", response.data);
      if (Array.isArray(response.data)) {
        setTodos(response.data);
      } else {
        console.error("Unexpected response data:", response.data);
        setTodos([]);
      }
    } catch (err: any) {
      console.error("Fetch Todos Error:", err.message);
      setTodos([]);
    }
  };

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedtime(event.target.value);
  };

  const addTodo = async () => {
    try {
      if (description.trim() !== "") {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:4000/todos",
          {
            description,
            selectedtime,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTodos([...todos, response.data]);
        setDescription("");
        setSelectedtime("");
      } else {
        alert("Fill in the field");
      }
    } catch (err: any) {
      console.error("Add Todo Error:", err.message);
    }
  };

  const updateTodo = async (id: number, completed: boolean, description: string, selectedtime: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/todos/${id}`,
        {
          completed,
          description,
          selectedtime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed, selectedtime } : todo
        )
      );
    } catch (err: any) {
      console.error("Update Todo Error:", err.message);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err: any) {
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

export default TodoInterface;
