import React, { useState, useEffect, ChangeEvent } from "react";
import { fetchGuestTodos, addGuestTodo, Todo } from "./guest-api";
import "./style/Guest.css";

const Guest: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState<string>("");
  const [selectedtime, setSelectedtime] = useState<string>("");

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await fetchGuestTodos();
        setTodos(todos);
      } catch (err) {
        console.error("Fetch Todos Error:", (err as Error).message);
        setTodos([]);
      }
    };

    getTodos();
  }, []);

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedtime(event.target.value);
  };

  const handleAddTodo = async () => {
    try {
      if (description.trim() !== "") {
        const newTodo = await addGuestTodo(description, selectedtime);
        setTodos([...todos, newTodo]);
        setDescription("");
        setSelectedtime("");
      } else {
        alert("Fill in the field");
      }
    } catch (err) {
      console.error("Add Todo Error:", (err as Error).message);
    }
  };

  return (
    <div className="todo-app">
      <div className="add-todo-container">
        <h1 className="title">To-Do List</h1>
        <div className="input-add-container">
          <div className="time-input-container">
            <input
              className="time-input custom-input"
              type="time"
              value={selectedtime}
              onChange={handleTimeChange}
            />
          </div>
          <input
            className="todo-description custom-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="add-button custom-button" onClick={handleAddTodo}>
            Add
          </button>
        </div>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
              {todo.description}
            <span className="selectedtime">{todo.selectedtime}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Guest;
