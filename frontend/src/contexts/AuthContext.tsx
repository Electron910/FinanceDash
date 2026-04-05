import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from 'react';
import { User, AuthState } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: 'admin' | 'analyst' | 'viewer') => boolean;
  canWrite: () => boolean;
  canDelete: () => boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

type AuthAction =
  | { type: 'SET_AUTH'; payload: { user: User; token: string } }
  | { type: 'CLEAR_AUTH' }
  | { type: 'SET_LOADING'; payload: boolean };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CLEAR_AUTH':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

const roleHierarchy: Record<'admin' | 'analyst' | 'viewer', number> = {
  viewer: 1,
  analyst: 2,
  admin: 3,
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('finance_token');
        const userStr = localStorage.getItem('finance_user');

        if (token && userStr) {
          const user = JSON.parse(userStr) as User;
          dispatch({ type: 'SET_AUTH', payload: { user, token } });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch {
        localStorage.removeItem('finance_token');
        localStorage.removeItem('finance_user');
        dispatch({ type: 'CLEAR_AUTH' });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const response = await authAPI.login(email, password);
        const { token, user } = response.data.data as {
          token: string;
          user: User;
        };

        // Persist to localStorage
        localStorage.setItem('finance_token', token);
        localStorage.setItem('finance_user', JSON.stringify(user));

        dispatch({ type: 'SET_AUTH', payload: { user, token } });

        toast.success(`Welcome back, ${user.name}!`, {
          style: {
            background: '#3F4F44',
            color: '#DCD7C9',
            border: '1px solid #A27B5C',
          },
          iconTheme: { primary: '#A27B5C', secondary: '#DCD7C9' },
        });

        return true;
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Login failed. Please check your credentials.';

        toast.error(message, {
          style: {
            background: '#2C3930',
            color: '#DCD7C9',
            border: '1px solid #ef4444',
          },
        });

        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    // Clean up localStorage
    localStorage.removeItem('finance_token');
    localStorage.removeItem('finance_user');

    authAPI.logout().catch(() => {
    });

    dispatch({ type: 'CLEAR_AUTH' });

    toast.success('Logged out successfully', {
      style: {
        background: '#3F4F44',
        color: '#DCD7C9',
        border: '1px solid #A27B5C',
      },
    });
  }, []);

  const hasRole = useCallback(
    (role: 'admin' | 'analyst' | 'viewer'): boolean => {
      if (!state.user) return false;
      return roleHierarchy[state.user.role] >= roleHierarchy[role];
    },
    [state.user]
  );

  const canWrite = useCallback((): boolean => {
    return hasRole('analyst');
  }, [hasRole]);

  const canDelete = useCallback((): boolean => {
    return hasRole('admin');
  }, [hasRole]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    hasRole,
    canWrite,
    canDelete,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;