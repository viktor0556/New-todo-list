import React from "react";
import { Todo, Category } from "../api";

interface TodoListProps {
  todos: Todo[];
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

const TodoList: React.FC<TodoListProps> = ({todos, onUpdateTodo, onDeleteTodo }) => {
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const cleanedTime = (selectedtime: string) => {
    return selectedtime.replace(/:00$/, "");
  };

  const groupTodosByCategory = (todos: Todo[]) => {
    return todos.reduce((acc, todo) => {
      const categoryName = todo.categoryName || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(todo);
      return acc;
    }, {} as Record<string, Todo[]>);
  };

  const groupedTodos = groupTodosByCategory(todos);

  return (
    <div className="todo-list">
      {Object.entries(groupedTodos).map(([categoryName, todos]) => (
        <div key={categoryName} className="category-group">
          <h3>{categoryName}</h3>
          <ul>
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
                  <button
                    className="delete-button"
                    onClick={() => onDeleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
