/**
 * Contexto de Autenticación
 * Proporciona estado global de autenticación a toda la aplicación
 */

import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// Crear contexto
export const AuthContext = createContext();

/**
 * Proveedor de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Verificar si hay sesión activa al cargar la app
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          const response = await authService.getCurrentUser();
          setUser(response.data.data.user);
        }
      } catch (err) {
        console.error('Error verificando autenticación:', err);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  /**
   * Función de registro
   */
  const register = async (email, password, firstName, lastName) => {
    try {
      setError(null);
      const response = await authService.register(email, password, firstName, lastName);
      const { token: newToken, user: newUser } = response.data.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      return { success: true, data: newUser };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrarse';
      setError(message);
      return { success: false, message };
    }
  };

  /**
   * Función de login
   */
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      const { token: newToken, user: newUser } = response.data.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      return { success: true, data: newUser };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al iniciar sesión';
      setError(message);
      return { success: false, message };
    }
  };

  /**
   * Función de logout
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
