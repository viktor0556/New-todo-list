import axios from 'axios';
export * from './apis/categories';
export * from './apis/todo';

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



export default api;
