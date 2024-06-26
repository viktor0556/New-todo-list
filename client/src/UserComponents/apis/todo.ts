import api from "../api";

export interface Todo {
  id: number;
  description: string;
  selectedtime: string;
  completed: boolean;
  priority: string;
  categoryId: number | null;
  categoryName: any;
}

export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await api.get('/todos');
    return response.data.map((todo: any) => ({
        ...todo,
        categoryId: todo.category_id
    }));
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error; 
  }
};

export const addTodo = async (description: string, selectedtime: string, priority: string, categoryId: number | null): Promise<Todo> => {
  const response = await api.post('/todos', {
    description,
    selectedtime,
    priority,
    categoryId,
  });
  console.log('Added Todo Response:', response.data);
  return response.data;
};

export const updateTodo = async (id: number, completed: boolean, description: string, selectedtime: string, priority: string, categoryId: number | null): Promise<void> => {
  await api.put(`/todos/${id}`, {
    id,
    completed,
    description,
    selectedtime,
    priority,
    categoryId,
  });
  console.log('Updated Todo:', { id });
};

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`);
};