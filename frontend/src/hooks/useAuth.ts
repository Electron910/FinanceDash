import { useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UserRole } from '../types';

export { useAuth } from '../contexts/AuthContext';


export const useHasRole = (requiredRole: UserRole): boolean => {
  const context = useContext(AuthContext);
  if (!context) return false;
  return context.hasRole(requiredRole);
};


export const useUserRole = (): UserRole | null => {
  const context = useContext(AuthContext);
  if (!context || !context.user) return null;
  return context.user.role;
};


export const useIsAuthenticated = (): boolean => {
  const context = useContext(AuthContext);
  if (!context) return false;
  return context.isAuthenticated;
};


export const useCanWrite = (): boolean => {
  const context = useContext(AuthContext);
  if (!context) return false;
  return context.canWrite();
};


export const useCanDelete = (): boolean => {
  const context = useContext(AuthContext);
  if (!context) return false;
  return context.canDelete();
};


export const useCurrentUser = () => {
  const context = useContext(AuthContext);
  if (!context) return null;
  return context.user;
};

export const usePermissions = () => {
  const context = useContext(AuthContext);

  const canView = useCallback((): boolean => {
    if (!context) return false;
    return context.isAuthenticated;
  }, [context]);

  const canCreate = useCallback((): boolean => {
    if (!context) return false;
    return context.canWrite();
  }, [context]);

  const canEdit = useCallback((): boolean => {
    if (!context) return false;
    return context.canWrite();
  }, [context]);

  const canDeleteRecord = useCallback((): boolean => {
    if (!context) return false;
    return context.canDelete();
  }, [context]);

  const canManageUsers = useCallback((): boolean => {
    if (!context) return false;
    return context.hasRole('admin');
  }, [context]);

  const canViewAnalytics = useCallback((): boolean => {
    if (!context) return false;
    return context.hasRole('analyst');
  }, [context]);

  const isAdmin = useCallback((): boolean => {
    if (!context || !context.user) return false;
    return context.user.role === 'admin';
  }, [context]);

  const isAnalyst = useCallback((): boolean => {
    if (!context || !context.user) return false;
    return context.user.role === 'analyst';
  }, [context]);

  const isViewer = useCallback((): boolean => {
    if (!context || !context.user) return false;
    return context.user.role === 'viewer';
  }, [context]);

  return {
    canView,
    canCreate,
    canEdit,
    canDeleteRecord,
    canManageUsers,
    canViewAnalytics,
    isAdmin,
    isAnalyst,
    isViewer,
  };
};