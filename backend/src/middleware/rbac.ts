import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';

const roleHierarchy: Record<UserRole, number> = {
  viewer: 1,
  analyst: 2,
  admin: 3,
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    const userRole = req.user.role;
    const isAllowed = allowedRoles.some((role) => {
      return roleHierarchy[userRole] >= roleHierarchy[role];
    });

    if (!isAllowed) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${userRole}`,
      });
      return;
    }

    next();
  };
};

export const authorizeExact = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. This action requires: ${allowedRoles.join(' or ')} role.`,
      });
      return;
    }

    next();
  };
};

export const isSelfOrAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  const targetUserId = req.params.id;
  const isAdmin = req.user.role === 'admin';
  const isSelf = req.user.userId === targetUserId;

  if (!isAdmin && !isSelf) {
    res.status(403).json({
      success: false,
      message: 'You can only access your own resources.',
    });
    return;
  }

  next();
};