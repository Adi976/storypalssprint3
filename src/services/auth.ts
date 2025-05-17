import api from './api';
import { AuthResponse } from './api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    const { tokens, user } = response.data;
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    return user;
  },

  signup: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/register', { email, password });
    const { tokens, user } = response.data;
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    return user;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getToken: () => {
    return localStorage.getItem('access_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
}; 