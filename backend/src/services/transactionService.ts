import { TransactionModel } from '../models/Transaction';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilters,
  PaginationQuery,
  PaginatedResponse,
  Transaction,
} from '../types';
import { AppError } from '../middleware/errorHandler';
import { getPaginationParams, buildPaginatedResponse } from '../utils/pagination';

export class TransactionService {
  static async getAll(
    filters: TransactionFilters,
    pagination: PaginationQuery
  ): Promise<PaginatedResponse<Transaction>> {
    const { page, limit, offset } = getPaginationParams(pagination);
    const { rows, total } = await TransactionModel.findAll(
      filters,
      limit,
      offset
    );
    return buildPaginatedResponse(rows, total, page, limit);
  }

  static async getById(id: string): Promise<Transaction> {
    const transaction = await TransactionModel.findById(id);
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    return transaction;
  }

  static async create(
    data: CreateTransactionDto,
    userId: string
  ): Promise<Transaction> {
    if (Number(data.amount) <= 0) {
      throw new AppError('Amount must be greater than 0', 400);
    }
    return TransactionModel.create({ ...data, created_by: userId });
  }

  static async update(
    id: string,
    data: UpdateTransactionDto,
    userId: string
  ): Promise<Transaction> {
    const existing = await TransactionModel.findById(id);
    if (!existing) {
      throw new AppError('Transaction not found', 404);
    }

    if (data.amount !== undefined && Number(data.amount) <= 0) {
      throw new AppError('Amount must be greater than 0', 400);
    }

    const updated = await TransactionModel.update(id, data, userId);
    if (!updated) {
      throw new AppError('Failed to update transaction', 500);
    }
    return updated;
  }

  static async delete(id: string): Promise<void> {
    const existing = await TransactionModel.findById(id);
    if (!existing) {
      throw new AppError('Transaction not found', 404);
    }

    const deleted = await TransactionModel.softDelete(id);
    if (!deleted) {
      throw new AppError('Failed to delete transaction', 500);
    }
  }
}