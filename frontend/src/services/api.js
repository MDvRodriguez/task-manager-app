import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (email, password, firstName, lastName) =>
    apiClient.post('/auth/register', { email, password, firstName, lastName }),

  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  getCurrentUser: () =>
    apiClient.get('/auth/me'),

  logout: () =>
    apiClient.post('/auth/logout'),
};

export const taskService = {
  getTasks: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.priority && filters.priority !== 'todas') params.append('priority', filters.priority);
    if (filters.status && filters.status !== 'todas') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    
    return apiClient.get(`/tasks?${params.toString()}`);
  },

  getTaskById: (id) =>
    apiClient.get(`/tasks/${id}`),

  createTask: (taskData) =>
    apiClient.post('/tasks', taskData),

  updateTask: (id, taskData) =>
    apiClient.put(`/tasks/${id}`, taskData),

  deleteTask: (id) =>
    apiClient.delete(`/tasks/${id}`),

  getStats: () =>
    apiClient.get('/tasks/stats/summary'),
};

export default apiClient;