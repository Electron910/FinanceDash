import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: 'Validation failed. Please check your input.',
      errors: errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg,
      })),
    });
    return;
  }
  next();
};

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

export const createUserValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must be 8+ characters with uppercase, lowercase and number'),
  body('role')
    .isIn(['admin', 'analyst', 'viewer'])
    .withMessage('Role must be admin, analyst, or viewer'),
  validate,
];

export const updateUserValidation = [
  param('id').isUUID().withMessage('Invalid user ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('role')
    .optional()
    .isIn(['admin', 'analyst', 'viewer'])
    .withMessage('Role must be admin, analyst, or viewer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
  validate,
];

export const createTransactionValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category is required and max 100 characters'),
  body('date').isDate().withMessage('Valid date is required (YYYY-MM-DD)'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes max 1000 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description max 500 characters'),
  validate,
];

export const updateTransactionValidation = [
  param('id').isUUID().withMessage('Invalid transaction ID'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be income or expense'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category max 100 characters'),
  body('date').optional().isDate().withMessage('Valid date is required'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes max 1000 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description max 500 characters'),
  validate,
];

export const transactionQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('type').optional().isIn(['income', 'expense']).withMessage('Invalid type filter'),
  query('startDate').optional().isDate().withMessage('Invalid start date'),
  query('endDate').optional().isDate().withMessage('Invalid end date'),
  query('minAmount').optional().isFloat({ min: 0 }).withMessage('Invalid min amount'),
  query('maxAmount').optional().isFloat({ min: 0 }).withMessage('Invalid max amount'),
  validate,
];