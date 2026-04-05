import { useState, useEffect, useCallback } from 'react';
import { transactionAPI } from '../services/api';
import { Transaction, TransactionFilters, PaginatedResponse } from '../types';
import toast from 'react-hot-toast';

export const useTransactions = (initialFilters: TransactionFilters = {}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Transaction>['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);

  const fetchTransactions = useCallback(async (appliedFilters: TransactionFilters = {}) => {
    try {
      setLoading(true);
      const response = await transactionAPI.getAll(appliedFilters);
      const { data } = response;
      setTransactions((data.data as Transaction[]) || []);
      if (data.pagination) setPagination(data.pagination);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load transactions';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(filters);
  }, [filters, fetchTransactions]);

  const applyFilters = useCallback((newFilters: TransactionFilters) => {
    setFilters({ ...newFilters, page: 1 });
  }, []);

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const createTransaction = useCallback(
    async (data: unknown): Promise<boolean> => {
      try {
        await transactionAPI.create(data);
        toast.success('Transaction created successfully!');
        await fetchTransactions(filters);
        return true;
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to create transaction';
        toast.error(message);
        return false;
      }
    },
    [filters, fetchTransactions]
  );

  const updateTransaction = useCallback(
    async (id: string, data: unknown): Promise<boolean> => {
      try {
        await transactionAPI.update(id, data);
        toast.success('Transaction updated successfully!');
        await fetchTransactions(filters);
        return true;
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to update transaction';
        toast.error(message);
        return false;
      }
    },
    [filters, fetchTransactions]
  );

  const deleteTransaction = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await transactionAPI.delete(id);
        toast.success('Transaction deleted successfully!');
        await fetchTransactions(filters);
        return true;
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to delete transaction';
        toast.error(message);
        return false;
      }
    },
    [filters, fetchTransactions]
  );

  return {
    transactions,
    pagination,
    loading,
    filters,
    applyFilters,
    changePage,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: () => fetchTransactions(filters),
  };
};