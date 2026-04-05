import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { authorize, isSelfOrAdmin } from '../middleware/rbac';
import {
  createUserValidation,
  updateUserValidation,
} from '../middleware/validation';

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Admin
 */
router.get('/', authenticate, authorize('admin'), UserController.getAll);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Admin
 */
router.get('/stats', authenticate, authorize('admin'), UserController.getStats);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Admin or self
 */
router.get('/:id', authenticate, isSelfOrAdmin, UserController.getById);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Admin
 */
router.post('/', authenticate, authorize('admin'), createUserValidation, UserController.create);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Admin or self (limited fields)
 */
router.put('/:id', authenticate, isSelfOrAdmin, updateUserValidation, UserController.update);

/**
 * @route   DELETE /api/users/:id
 * @desc    Soft delete user
 * @access  Admin only
 */
router.delete('/:id', authenticate, authorize('admin'), UserController.delete);

export default router;