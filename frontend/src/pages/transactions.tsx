import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../contexts/AuthContext';
import { Transaction } from '../types';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionFiltersPanel } from '../components/transactions/TransactionFilters';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export default function TransactionsPage() {
  const { canWrite } = useAuth();
  const {
    transactions,
    pagination,
    loading,
    filters,
    applyFilters,
    changePage,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions({ page: 1, limit: 15 });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleCreate = async (data: unknown) => {
    const success = await createTransaction(data);
    if (success) setIsFormOpen(false);
    return success;
  };

  const handleUpdate = async (data: unknown) => {
    if (!editingTransaction) return false;
    const success = await updateTransaction(editingTransaction.id, data);
    if (success) setEditingTransaction(null);
    return success;
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
  };

  return (
    <>
      <Head>
        <title>Transactions — FinanceDash</title>
      </Head>

      <div className="space-y-5">
        {/* Page Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-marseille font-bold text-cream">All Transactions</h2>
            <p className="text-sm text-cream/40 mt-0.5">
              {pagination
                ? `${pagination.total} total records`
                : 'Loading...'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TransactionFiltersPanel filters={filters} onApply={applyFilters} />
            {canWrite() && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsFormOpen(true)}
                icon={<span>+</span>}
              >
                Add Transaction
              </Button>
            )}
          </div>
        </div>

        {Object.values(filters).some((v) => v !== undefined && v !== '' && v !== 1 && v !== 15) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="text-xs text-cream/40">Active filters:</span>
            {filters.type && (
              <span className="text-xs bg-sand/10 text-sand px-2 py-0.5 rounded-full border border-sand/20">
                Type: {filters.type}
              </span>
            )}
            {filters.category && (
              <span className="text-xs bg-sand/10 text-sand px-2 py-0.5 rounded-full border border-sand/20">
                Category: {filters.category}
              </span>
            )}
            {filters.search && (
              <span className="text-xs bg-sand/10 text-sand px-2 py-0.5 rounded-full border border-sand/20">
                Search: "{filters.search}"
              </span>
            )}
            {(filters.startDate || filters.endDate) && (
              <span className="text-xs bg-sand/10 text-sand px-2 py-0.5 rounded-full border border-sand/20">
                Date: {filters.startDate || '...'} → {filters.endDate || '...'}
              </span>
            )}
            <button
              onClick={() => applyFilters({ page: 1, limit: 15 })}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear all ✕
            </button>
          </motion.div>
        )}

        <TransactionTable
          transactions={transactions}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <p className="text-xs text-cream/40">
              Page {pagination.page} of {pagination.totalPages} — {pagination.total} records
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changePage(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                ← Prev
              </Button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      page === pagination.page
                        ? 'bg-sand text-forest-dark'
                        : 'text-cream/50 hover:bg-white/5'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changePage(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next →
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="New Transaction"
        size="md"
      >
        <TransactionForm
          onSubmit={handleCreate}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        title="Edit Transaction"
        size="md"
      >
        <TransactionForm
          onSubmit={handleUpdate}
          onCancel={() => setEditingTransaction(null)}
          initialData={editingTransaction}
        />
      </Modal>
    </>
  );
}