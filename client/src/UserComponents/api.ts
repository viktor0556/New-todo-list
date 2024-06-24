import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/',
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
  categoryId: number | null;
  tags: number[]
}

export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await api.get('/todos');
  return response.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data;
};

export const addCategory = async (name: string): Promise<Category> => {
  const response = await api.post('/categories', { name });
  return response.data;
};

export const fetchTags = async (): Promise<Tag[]> => {
  const response = await api.get('/tags');
  return response.data;
};

export const addTag = async (name: string): Promise<Tag> => {
  const response = await api.post('/tags', { name });
  return response.data;
};

export const addTodo = async (description: string, selectedtime: string, priority: string, categoryId: number | null, tags: number[]): Promise<Todo> => {
  const response = await api.post('/todos', {
    description,
    selectedtime,
    priority,
    categoryId,
    tags
  });
  console.log('Added Todo Response:', response.data);
  return response.data;
};

export const updateTodo = async (id: number, completed: boolean, description: string, selectedtime: string, priority: string, categoryId: number | null, tags: number[]): Promise<void> => {
  await api.put(`/todos/${id}`, {
    id,
    completed,
    description,
    selectedtime,
    priority,
    categoryId,
    tags
  });
  console.log('Updated Todo:', { id });
};

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

export default api;