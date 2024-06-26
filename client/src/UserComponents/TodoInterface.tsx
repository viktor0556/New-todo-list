import React, { useState, useEffect } from "react";
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  fetchCategories,
  Category,
  Todo
} from "./api";
import "./styles/App.css";
import { useNavigate } from "react-router-dom";
import TodoForm from "./TodoInterfaceComponents/TodoForm";
import TodoList from "./TodoInterfaceComponents/TodoList";

const TodoInterface: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchInitialData();
    }
  }, [navigate]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [todosData, categoriesData] = await Promise.all([
      fetchTodos(),
      fetchCategories(),
      ]);
      setTodos(todosData.map(todo => ({
        ...todo,
        categoryName: categoriesData.find(cat => cat.id === todo.categoryId)?.name || 'Uncategorized'
      })));
      setCategories(categoriesData);
    } catch (err) {
      handleFetchError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (
    description: string,
    selectedtime: string,
    priority: string,
    categoryId: number | null,
  ) => {
    try {
      const newTodo = await addTodo(description, selectedtime, priority, categoryId);
      const category = categories.find(cat => cat.id === categoryId);
      const categoryName = category ? category.name : 'Uncategorized';

      setTodos([...todos, { ...newTodo, categoryName }]);
    } catch (err) {
      handleRequestError(err as Error);
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
      await updateTodo(
        id,
        completed,
        description,
        selectedtime,
        priority,
        null,
      );
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed, selectedtime } : todo
        )
      );
    } catch (err) {
      handleRequestError(err as Error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      handleRequestError(err as Error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleFetchError = (err: Error) => {
    if (err.message === "Token expired") {
      navigate("/login");
    } else {
      console.error("Fetch Todos Error:", (err as Error).message);
      setTodos([]);
    }
  };

  const handleRequestError = (err: Error) => {
    if (err.message === "Token expired") {
      navigate("/login");
    } else {
      console.error("Request Error:", (err as Error).message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="todo-app">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <div className="add-todo-container">
        <h1 className="title">To-Do List</h1>
        <TodoForm
          onAddTodo={handleAddTodo}
          categories={categories}
        />
      </div>
      <TodoList
        todos={todos}
        onUpdateTodo={handleUpdateTodo}
        onDeleteTodo={handleDeleteTodo}
        categories={categories}
      />
    </div>
  );
};

export default TodoInterface;
