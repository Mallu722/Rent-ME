import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        setUser(response.data.data.user);
        return response.data;
      }
    } catch (error) {
      // Handle network errors
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        throw {
          message: 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000',
        };
      }
      // Handle API errors
      throw error.response?.data || { message: error.message || 'Login failed' };
    }
  };

  const signup = async (data) => {
    try {
      const response = await api.post('/auth/signup', data);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        setUser(response.data.data.user);
        return response.data;
      }
    } catch (error) {
      // Handle network errors
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        throw {
          message: 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000',
        };
      }
      // Handle API errors
      throw error.response?.data || { message: error.message || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
