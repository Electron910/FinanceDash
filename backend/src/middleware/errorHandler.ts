import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = (err as AppError).statusCode || 500;
  const isOperational = (err as AppError).isOperational || false;

  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    statusCode,
  });

  if (err.message.includes('duplicate key')) {
    res.status(409).json({
      success: false,
      message: 'A record with this information already exists.',
    });
    return;
  }

  if (err.message.includes('violates foreign key')) {
    res.status(400).json({
      success: false,
      message: 'Referenced resource does not exist.',
    });
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      isOperational,
    });
    return;
  }

  if (isOperational) {
    res.status(statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
  });
};