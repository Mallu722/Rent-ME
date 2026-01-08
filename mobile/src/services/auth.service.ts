import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'companion';
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  signup: async (data: SignupData) => {
    const response = await api.post('/auth/signup', data);
    if (response.data.success) {
      await AsyncStorage.setItem('token', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    if (response.data.success) {
      await AsyncStorage.setItem('token', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
