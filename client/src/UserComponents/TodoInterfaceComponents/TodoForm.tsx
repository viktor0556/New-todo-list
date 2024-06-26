import React, { useState, ChangeEvent } from "react";
import { Category } from "../api";

interface TodoFormProps {
  onAddTodo: (
    description: string,
    selectedtime: string,
    priority: string,
    categoryId: number | null,
  ) => void;
  categories: Category[];
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo, categories }) => {
  const [description, setDescription] = useState<string>("");
  const [selectedtime, setSelectedtime] = useState<string>("");
  const [priority, setPriority] = useState<string>("medium");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedtime(event.target.value);
  };

  const handleAddTodo = () => {
    if (description.trim() !== "") {
      onAddTodo(description, selectedtime, priority, categoryId);
      resetForm();
    } else {
      alert("Fill in the field");
    }
  };

  const resetForm = () => {
    setDescription("");
    setSelectedtime("");
    setPriority("medium");
    setCategoryId(null);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = parseInt(event.target.value, 10);
    setCategoryId(selectedCategoryId || null);
  };


  return (
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
        <div className="selected-categories">
          {categoryId && (
            <div className="category-item">
              Selected Category: {categories.find((cat) => cat.id === categoryId)?.name}
            </div>
          )}
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
  );
};

export default TodoForm;
