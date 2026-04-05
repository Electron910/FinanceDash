export type UserRole = 'admin' | 'analyst' | 'viewer';
export type UserStatus = 'active' | 'inactive';
export type TransactionType = 'income' | 'expense';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  created_at: string;
  updated_at: string;
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
  creator_name?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
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

export interface DashboardData {
  summary: DashboardSummary;
  categoryTotals: CategoryTotal[];
  monthlyTrends: MonthlyTrend[];
  recentActivity: Transaction[];
  totalUsers: number;
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

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: { field: string; message: string }[];
  pagination?: PaginatedResponse<T>['pagination'];
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateTransactionDto {
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
  description?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}