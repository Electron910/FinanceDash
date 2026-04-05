import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import {
  createTransactionValidation,
  updateTransactionValidation,
  transactionQueryValidation,
} from '../middleware/validation';

const router = Router();

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions with filters and pagination
 * @access  Viewer, Analyst, Admin
 */
router.get(
  '/',
  authenticate,
  authorize('viewer'),
  transactionQueryValidation,
  TransactionController.getAll
);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get single transaction
 * @access  Viewer, Analyst, Admin
 */
router.get('/:id', authenticate, authorize('viewer'), TransactionController.getById);

/**
 * @route   POST /api/transactions
 * @desc    Create new transaction
 * @access  Analyst, Admin
 */
router.post(
  '/',
  authenticate,
  authorize('analyst'),
  createTransactionValidation,
  TransactionController.create
);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update transaction
 * @access  Analyst, Admin
 */
router.put(
  '/:id',
  authenticate,
  authorize('analyst'),
  updateTransactionValidation,
  TransactionController.update
);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Soft delete transaction
 * @access  Admin only
 */
router.delete('/:id', authenticate, authorize('admin'), TransactionController.delete);

export default router;