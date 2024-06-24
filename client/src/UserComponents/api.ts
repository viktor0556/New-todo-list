import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      return Promise.reject(new Error('Token expired'));
    }
    return Promise.reject(error);
  }
);

export interface Todo {
  id: number;
  description: string;
  selectedtime: string;
  completed: boolean;
  priority: string;
}

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await api.get('/todos');
  return response.data;
};

export const addTodo = async (description: string, selectedtime: string, priority: string): Promise<Todo> => {
  const response = await api.post('/todos', {
    description,
    selectedtime,
    priority
  });
  return response.data;
};

export const updateTodo = async (id: number, completed: boolean, description: string, selectedtime: string, priority: string): Promise<void> => {
  await api.put(`/todos/${id}`, {
    id,
    completed,
    description,
    selectedtime,
    priority,
  });
};

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

export default api;