import axios from 'axios';
import { API_URL } from '../config';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  children: Child[];
}

export interface Child {
  id: number;
  name: string;
  age: number;
  gender: string;
  interests: string[];
  learning_goals: string[];
  created_at: string;
  updated_at: string;
}

interface TokenPayload {
  exp: number;
  user_id: number;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

class AuthService {
  private static instance: AuthService;
  private tokenRefreshTimeout: NodeJS.Timeout | null = null;
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';
  private api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  private constructor() {
    this.setupAxiosInterceptors();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private setupAxiosInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: any) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;

        // Don't retry if it's a refresh token request or logout request
        if (originalRequest.url.includes('/token/refresh/') || 
            originalRequest.url.includes('/auth/logout/')) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            this.setToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            this.clearUser();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public async login(email: string, password: string): Promise<User> {
    try {
      const response = await this.api.post('/auth/login/', { email, password });
      if (response.data.access && response.data.refresh && response.data.user) {
        this.setTokens(response.data.access, response.data.refresh);
        this.setUser(response.data.user);
        this.scheduleTokenRefresh();
        return response.data.user;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  }

  public async loginWithGoogle(credential: string): Promise<User | null> {
    try {
      const response = await this.api.post('/auth/google-login/', { credential });
      this.setTokens(response.data.access, response.data.refresh);
      this.setUser(response.data.user);
      this.scheduleTokenRefresh();
      return response.data.user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  public async register(userData: {
    email: string;
    password: string;
    confirm_password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  }): Promise<User> {
    try {
      const response = await this.api.post('/auth/register/', userData);
      this.setTokens(response.data.access, response.data.refresh);
      this.setUser(response.data.user);
      this.scheduleTokenRefresh();
      return response.data.user;
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.data) {
        // Format the error response to be more user-friendly
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const formattedErrors = Object.entries(errorData)
            .map(([field, messages]) => {
              const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              if (Array.isArray(messages)) {
                return `${fieldName}: ${messages.join(', ')}`;
              }
              return `${fieldName}: ${messages}`;
            })
            .join('\n');
          throw new Error(formattedErrors);
        }
      }
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await this.api.post('/auth/logout/', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
      this.clearUser();
      if (this.tokenRefreshTimeout) {
        clearTimeout(this.tokenRefreshTimeout);
      }
    }
  }

  public async getChildren(): Promise<Child[]> {
    try {
      const response = await this.api.get('/users/children/');
      return response.data;
    } catch (error) {
      console.error('Error fetching children:', error);
      throw error;
    }
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private setTokens(access: string, refresh: string): void {
    localStorage.setItem(this.TOKEN_KEY, access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  private clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.api.post('/token/refresh/', {
        refresh: refreshToken,
      });
      if (response.data.access) {
        this.setToken(response.data.access);
        return response.data.access;
      } else {
        throw new Error('Invalid refresh token response');
      }
    } catch (error) {
      this.clearTokens();
      this.clearUser();
      throw error;
    }
  }

  private scheduleTokenRefresh(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const expiresIn = decoded.exp * 1000 - Date.now();
      const refreshTime = expiresIn - 5 * 60 * 1000; // Refresh 5 minutes before expiry

      if (this.tokenRefreshTimeout) {
        clearTimeout(this.tokenRefreshTimeout);
      }

      this.tokenRefreshTimeout = setTimeout(async () => {
        try {
          const newToken = await this.refreshToken();
          this.setToken(newToken);
          this.scheduleTokenRefresh();
        } catch (error) {
          console.error('Token refresh error:', error);
          this.logout();
        }
      }, refreshTime);
    } catch (error) {
      console.error('Token decode error:', error);
      this.logout();
    }
  }
}

export const authService = AuthService.getInstance();

// Export the getCurrentUser function directly
export const getCurrentUser = (): User | null => {
  return authService.getUser();
}; 