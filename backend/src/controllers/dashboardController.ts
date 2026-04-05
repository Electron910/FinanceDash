import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboardService';
import { AuthenticatedRequest } from '../types';

export class DashboardController {
  static async getFullDashboard(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await DashboardService.getFullDashboard();
      res.status(200).json({
        success: true,
        message: 'Dashboard data retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSummary(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const data = await DashboardService.getSummary(
        startDate as string | undefined,
        endDate as string | undefined
      );
      res.status(200).json({
        success: true,
        message: 'Summary retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryTotals(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { type } = req.query;
      const data = await DashboardService.getCategoryTotals(type as string | undefined);
      res.status(200).json({
        success: true,
        message: 'Category totals retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMonthlyTrends(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const months = req.query.months ? parseInt(req.query.months as string) : 12;
      const data = await DashboardService.getMonthlyTrends(months);
      res.status(200).json({
        success: true,
        message: 'Monthly trends retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getWeeklyTrends(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const weeks = req.query.weeks ? parseInt(req.query.weeks as string) : 8;
      const data = await DashboardService.getWeeklyTrends(weeks);
      res.status(200).json({
        success: true,
        message: 'Weekly trends retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRecentActivity(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const data = await DashboardService.getRecentActivity(limit);
      res.status(200).json({
        success: true,
        message: 'Recent activity retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}