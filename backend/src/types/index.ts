import { Request } from 'express';

export type UserRole = 'admin' | 'analyst' | 'viewer';
export type UserStatus = 'active' | 'inactive';
export type TransactionType = 'income' | 'expense';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
  description?: string;
  created_by: string;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}

export interface CategoryTotal {
  category: string;
  type: TransactionType;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  year: number;
  month: number;
  month_name: string;
  income: number;
  expenses: number;
  net: number;
}

export interface WeeklyTrend {
  week_start: string;
  income: number;
  expenses: number;
  net: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
  meta?: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  avatar?: string;
}

export interface CreateTransactionDto {
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
  description?: string;
}

export interface UpdateTransactionDto {
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: string;
  notes?: string;
  description?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password_hash' | 'deleted_at'>;
}