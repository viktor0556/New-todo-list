import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

export interface Todo {
  id: number;
  description: string;
  selectedtime: string;
  completed: boolean;
}

export const fetchGuestTodos = async (): Promise<Todo[]> => {
  const response = await api.get('/guest-todos');
  return response.data;
};

export const addGuestTodo = async (description: string, selectedtime: string): Promise<Todo> => {
  const response = await api.post('/guest-todos', {
    description,
    selectedtime,
  });
  return response.data;
};

export default api;
