import React, { useState, useEffect, ChangeEvent } from "react";
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  fetchCategories,
  fetchTags,
  Category,
  Tag,
  addTag
} from "./api";
import "./styles/App.css";
import { useNavigate } from "react-router-dom";

interface Todo {
  id: number;
  description: string;
  completed: boolean;
  selectedtime: string;
  priority: string;
  categoryId: number | null;
  tags: number[];
}

const TodoInterface: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState<string>("");
  const [selectedtime, setSelectedtime] = useState<string>("");
  const [priority, setPriority] = useState<string>("medium"); // default medium
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
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
      fetchInitialData();
    }
  }, [navigate]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchTodosFromAPI(),
        fetchCategoriesFromAPI(),
        fetchTagsFromApi(),
      ]);
    } catch (err) {
      handleFetchError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodosFromAPI = async () => {
    const todos = await fetchTodos();
    setTodos(todos);
  };

  const fetchCategoriesFromAPI = async () => {
    const categories = await fetchCategories();
    setCategories(categories);
  };

  const fetchTagsFromApi = async () => {
    const tags = await fetchTags();
    setTags(tags);
  };

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedtime(event.target.value);
  };

  const handleAddTodo = async () => {
    try {
      if (description.trim() !== "") {
        const newTodo = await addTodo(
          description,
          selectedtime,
          priority,
          categoryId,
          selectedTags
        );
        setTodos([...todos, newTodo]);
        resetForm();
      } else {
        alert("Fill in the field");
      }
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
        categoryId,
        selectedTags
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

  const resetForm = () => {
    setDescription("");
    setSelectedtime("");
    setPriority("medium");
    setCategoryId(null);
    setSelectedTags([]);
  };

  const handleFetchError = (err: Error) => {
    if (err.message === "Token expired") {
      navigate("/login");
    } else {
      console.error("Fetch Todos Error:", err.message);
      setTodos([]);
    }
  };

  const handleRequestError = (err: Error) => {
    if (err.message === "Token expired") {
      navigate("/login");
    } else {
      console.error("Request Error:", err.message);
    }
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(event.target.value, 10);
    setCategoryId(categoryId);
  };

  const handleTagChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const tagId = parseInt(event.target.value, 10);
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const removeTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("Todos:", todos);
  console.log("Categories:", categories);
  console.log("Tags:", tags);
  console.log("SelectedTags:", selectedTags);

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
            {categories.length > 0 && (
              <select 
                className="category-select"
                value={categoryId ?? ""}
                onChange={handleCategoryChange}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            {tags.length > 0 && (
              <select
                className="tag-select"
                onChange={handleTagChange}
              >
                <option value="">Select Tags</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            )}
            <div className="selected-tags">
              {selectedTags.length > 0 && selectedTags.map((tagId) => (
                <div key={tagId} className="tag-item">
                  {tags.find((tag) => tag.id === tagId)?.name}
                  <button className="remove-tag-button" onClick={() => removeTag(tagId)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
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
        {todos.length > 0 && todos.map((todo) => (
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
              {categories.length > 0 && todo.categoryId && (
                <span className="category">
                  Category: {categories.find((cat) => cat.id === todo.categoryId)?.name}
                </span>
              )}
              <div className="tags">
                {todo.tags.length > 0 && (
                  <>
                    Tags:
                    {todo.tags.map((tagId) => (
                      <span key={tagId} className="tag">
                        {tags.find((tag) => tag.id === tagId)?.name}
                      </span>
                    ))}
                  </>
                )}
              </div>
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
