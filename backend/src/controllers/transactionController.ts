import { Response, NextFunction } from 'express';
import { TransactionService } from '../services/transactionService';
import { AuthenticatedRequest, TransactionFilters } from '../types';

export class TransactionController {
  static async getAll(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filters: TransactionFilters = {
        type: req.query.type as 'income' | 'expense' | undefined,
        category: req.query.category as string | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
        minAmount: req.query.minAmount ? parseFloat(req.query.minAmount as string) : undefined,
        maxAmount: req.query.maxAmount ? parseFloat(req.query.maxAmount as string) : undefined,
        search: req.query.search as string | undefined,
      };

      const pagination = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      const result = await TransactionService.getAll(filters, pagination);
      res.status(200).json({
        success: true,
        message: 'Transactions retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const transaction = await TransactionService.getById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Transaction retrieved successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const transaction = await TransactionService.create(req.body, req.user!.userId);
      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const transaction = await TransactionService.update(
        req.params.id,
        req.body,
        req.user!.userId
      );
      res.status(200).json({
        success: true,
        message: 'Transaction updated successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await TransactionService.delete(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}