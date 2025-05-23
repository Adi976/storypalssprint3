import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (email: string, password: string) => 
    api.post('/auth/login/', { email, password }),
  register: (userData: any) => 
    api.post('/auth/register/', userData),
  logout: () => 
    api.post('/auth/logout/'),
};

// User endpoints
export const users = {
  getProfile: () => 
    api.get('/users/me/'),
  updateProfile: (data: any) => 
    api.put('/users/me/', data),
  getChildren: () => api.get('/children/'),
  getChild: (id: string) => api.get(`/children/${id}/`),
  createChild: (data: any) => api.post('/children/', data),
  updateChild: (id: string, data: any) => api.put(`/children/${id}/`, data),
  deleteChild: (id: string) => api.delete(`/children/${id}/`),
};

// Child endpoints
export const childApi = {
  create: (data: any) => api.post('/children/', data),
  update: (id: string, data: any) => api.put(`/children/${id}/`, data),
  delete: (id: string) => api.delete(`/children/${id}/`),
  get: (id: string) => api.get(`/children/${id}/`),
  getAll: () => api.get('/children/'),
  getProgress: (id: string) => api.get(`/analytics/progress/${id}/`),
  getStories: (id: string) => api.get(`/analytics/stories/${id}/`),
  getAchievements: (id: string) => api.get(`/analytics/achievements/${id}/`),
};

// Chat endpoints
export const chat = {
  getChats: () => 
    api.get('/chats/'),
  createChat: (data: any) => 
    api.post('/chats/', data),
  getMessages: (chatId: number) => 
    api.get(`/messages/?chat=${chatId}`),
  sendMessage: (data: any) => api.post('/chat/message/', data),
  getHistory: (params: {
    days?: number;
    character?: string;
    child?: string;
    search?: string;
  }) => api.get('/chats/history/', { params }),
  getChatAnalytics: (params: {
    child_id: string;
    days: number;
  }) => api.get('/chats/analytics/', { params }),
  publicChat: (character: string, content: string) => 
    api.post('/public-chat/', { character, content }),
};

// Story endpoints
export const stories = {
  getAll: () => api.get('/stories/'),
  getOne: (id: string) => api.get(`/stories/${id}/`),
  create: (data: any) => api.post('/stories/', data),
  update: (id: string, data: any) => api.put(`/stories/${id}/`, data),
  delete: (id: string) => api.delete(`/stories/${id}/`),
};

// Analytics endpoints
export const analytics = {
  getProgress: (childId: string) => api.get(`/analytics/progress/${childId}/`),
  getStories: (childId: string) => api.get(`/analytics/stories/${childId}/`),
  getAchievements: (childId: string) => api.get(`/analytics/achievements/${childId}/`),
  getVocabularyGrowth: (childId: string, params: { days: number }) => 
    api.get(`/analytics/vocabulary/${childId}/`, { params }),
  getGrammarProgress: (childId: string, params: { days: number }) => 
    api.get(`/analytics/grammar/${childId}/`, { params }),
  getCharacterInteractions: (childId: string, params: { days: number }) => 
    api.get(`/analytics/character-interactions/${childId}/`, { params }),
  getLearningMilestones: (childId: string, params: { days: number }) => 
    api.get(`/analytics/milestones/${childId}/`, { params }),
};

export default api;