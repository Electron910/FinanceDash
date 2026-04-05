import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../types';
import { logger } from '../utils/logger';

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid token.',
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Authentication failed:', error);

    if ((error as Error).name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Invalid token. Authentication failed.',
    });
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      req.user = verifyToken(token);
    }
  } catch {
    // Optional auth - silently fail
  }
  next();
};