import axios from 'axios';

export interface AuthResponse {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  user: {
    id: number;
    email: string;
    username: string;
  };
}

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  addChild: (childData: any) => {
    const formData = new FormData();
    Object.entries(childData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    return api.post('/children/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getChildren: () => 
    api.get('/children/'),
  updateChild: (id: number, data: any) => 
    api.put(`/children/${id}/`, data),
  deleteChild: (id: number) => 
    api.delete(`/children/${id}/`),
};

// Chat endpoints
export const chat = {
  getChats: () => 
    api.get('/chats/'),
  createChat: (data: any) => 
    api.post('/chats/', data),
  getMessages: (chatId: number) => 
    api.get(`/messages/?chat=${chatId}`),
  sendMessage: (chatId: number, content: string) => 
    api.post(`/chats/${chatId}/send_message/`, { content }),
  publicChat: (character: string, content: string) => 
    api.post('/public-chat/', { character, content }),
};

// Story endpoints
export const stories = {
  getStories: (params?: { character?: string; category?: string }) => 
    api.get('/stories/', { params }),
  getStory: (id: number) => 
    api.get(`/stories/${id}/`),
};

// Analytics endpoints
export const analytics = {
  getProgress: (childId: number) => 
    api.get(`/progress/?child=${childId}`),
  updateProgress: (childId: number, data: any) => 
    api.post(`/progress/`, { child: childId, ...data }),
};

export default api; 