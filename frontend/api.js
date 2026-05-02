/**
 * Servicio de API
 * Configuración centralizada de axios para llamadas al backend
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Crear instancia de axios con configuración base
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para agregar token a cada request
 */
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

/**
 * Interceptor para manejar errores de respuesta
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== SERVICIOS DE AUTENTICACIÓN =====

export const authService = {
  /**
   * Registrar nuevo usuario
   */
  register: (email, password, firstName, lastName) =>
    apiClient.post('/auth/register', { email, password, firstName, lastName }),

  /**
   * Iniciar sesión
   */
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  /**
   * Obtener información del usuario actual
   */
  getCurrentUser: () =>
    apiClient.get('/auth/me'),

  /**
   * Cerrar sesión
   */
  logout: () =>
    apiClient.post('/auth/logout'),
};

// ===== SERVICIOS DE TAREAS =====

export const taskService = {
  /**
   * Obtener todas las tareas (con filtros opcionales)
   */
  getTasks: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.priority && filters.priority !== 'todas') params.append('priority', filters.priority);
    if (filters.status && filters.status !== 'todas') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    
    return apiClient.get(`/tasks?${params.toString()}`);
  },

  /**
   * Obtener tarea específica
   */
  getTaskById: (id) =>
    apiClient.get(`/tasks/${id}`),

  /**
   * Crear nueva tarea
   */
  createTask: (taskData) =>
    apiClient.post('/tasks', taskData),

  /**
   * Actualizar tarea
   */
  updateTask: (id, taskData) =>
    apiClient.put(`/tasks/${id}`, taskData),

  /**
   * Eliminar tarea
   */
  deleteTask: (id) =>
    apiClient.delete(`/tasks/${id}`),

  /**
   * Obtener estadísticas
   */
  getStats: () =>
    apiClient.get('/tasks/stats/summary'),
};

export default apiClient;
