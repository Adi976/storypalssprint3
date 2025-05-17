import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {}

export interface AuthResponse {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  user: {
    id: string;
    email: string;
  };
}

export interface ChildData {
  name: string;
  age: string;
  gender: string;
  ageGroup: string;
  interests: string;
}

export const authApi = {
  login: (data: LoginData) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterData) => api.post<AuthResponse>('/auth/register', data),
  logout: () => {
    localStorage.clear();
  },
};

export const childApi = {
  createChild: (data: ChildData) => api.post('/children', data),
  getChildren: () => api.get('/children'),
  getChild: (id: string) => api.get(`/children/${id}`),
};

export default api; 