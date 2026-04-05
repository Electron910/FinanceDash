import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

/**
 * @route   GET /api/dashboard
 * @desc    Get full dashboard data
 * @access  Viewer, Analyst, Admin
 */
router.get('/', authenticate, authorize('viewer'), DashboardController.getFullDashboard);

/**
 * @route   GET /api/dashboard/summary
 * @desc    Get financial summary
 * @access  Viewer, Analyst, Admin
 */
router.get('/summary', authenticate, authorize('viewer'), DashboardController.getSummary);

/**
 * @route   GET /api/dashboard/categories
 * @desc    Get category totals
 * @access  Viewer, Analyst, Admin
 */
router.get('/categories', authenticate, authorize('viewer'), DashboardController.getCategoryTotals);

/**
 * @route   GET /api/dashboard/trends/monthly
 * @desc    Get monthly trends
 * @access  Analyst, Admin
 */
router.get(
  '/trends/monthly',
  authenticate,
  authorize('analyst'),
  DashboardController.getMonthlyTrends
);

/**
 * @route   GET /api/dashboard/trends/weekly
 * @desc    Get weekly trends
 * @access  Analyst, Admin
 */
router.get(
  '/trends/weekly',
  authenticate,
  authorize('analyst'),
  DashboardController.getWeeklyTrends
);

/**
 * @route   GET /api/dashboard/recent
 * @desc    Get recent activity
 * @access  Viewer, Analyst, Admin
 */
router.get('/recent', authenticate, authorize('viewer'), DashboardController.getRecentActivity);

export default router;