import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, TransactionFilters } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('finance_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('finance_token');
        localStorage.removeItem('finance_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  me: () =>
    apiClient.get('/auth/me'),
  logout: () =>
    apiClient.post('/auth/logout'),
  register: (data: unknown) =>
    apiClient.post('/auth/register', data),
};

// User APIs
export const userAPI = {
  getAll: () => apiClient.get<ApiResponse>('/users'),
  getById: (id: string) => apiClient.get<ApiResponse>(`/users/${id}`),
  create: (data: unknown) => apiClient.post<ApiResponse>('/users', data),
  update: (id: string, data: unknown) => apiClient.put<ApiResponse>(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse>(`/users/${id}`),
  getStats: () => apiClient.get<ApiResponse>('/users/stats'),
};

// Transaction APIs
export const transactionAPI = {
  getAll: (filters?: TransactionFilters) =>
    apiClient.get<ApiResponse>('/transactions', { params: filters }),
  getById: (id: string) => apiClient.get<ApiResponse>(`/transactions/${id}`),
  create: (data: unknown) => apiClient.post<ApiResponse>('/transactions', data),
  update: (id: string, data: unknown) =>
    apiClient.put<ApiResponse>(`/transactions/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse>(`/transactions/${id}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getFull: () => apiClient.get<ApiResponse>('/dashboard'),
  getSummary: (startDate?: string, endDate?: string) =>
    apiClient.get<ApiResponse>('/dashboard/summary', { params: { startDate, endDate } }),
  getCategories: (type?: string) =>
    apiClient.get<ApiResponse>('/dashboard/categories', { params: { type } }),
  getMonthlyTrends: (months?: number) =>
    apiClient.get<ApiResponse>('/dashboard/trends/monthly', { params: { months } }),
  getWeeklyTrends: (weeks?: number) =>
    apiClient.get<ApiResponse>('/dashboard/trends/weekly', { params: { weeks } }),
  getRecentActivity: (limit?: number) =>
    apiClient.get<ApiResponse>('/dashboard/recent', { params: { limit } }),
};


export default apiClient;