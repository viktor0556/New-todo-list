import React from "react";
import { Todo, Category } from "../api";

interface TodoItemProps {
  todo: Todo;
  categories: Category[];
  onUpdateTodo: (
    id: number,
    completed: boolean,
    description: string,
    selectedtime: string,
    priority: string
  ) => void;
  onDeleteTodo: (id: number) => void;
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const cleanedTime = (selectedtime: string) => {
  return selectedtime.replace(/:00$/, "");
};

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  categories,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  const categoryName = todo.categoryId
    ? categories.find((cat) => cat.id === todo.categoryId)?.name
    : null;

  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-info">
        <span className="priority">{capitalizeFirstLetter(todo.priority)} Task</span>
        <span className="description">
          {todo.description}
          {categoryName && <span className="category"> (Category: {categoryName})</span>}
        </span>
        <span className="selectedtime">{cleanedTime(todo.selectedtime)}</span>
      </div>
      <div className="complete-delete-container">
        <button
          className="update-button"
          onClick={() =>
            onUpdateTodo(
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
        <button className="delete-button" onClick={() => onDeleteTodo(todo.id)}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
