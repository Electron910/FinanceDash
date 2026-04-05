import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '../../types';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  const { canWrite, canDelete } = useAuth();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleConfirmDelete = async (id: string) => {
    if (onDelete) await onDelete(id);
    setDeleteConfirmId(null);
  };

  if (isLoading) {
    return (
      <div className="card overflow-hidden p-0">
        <div className="divide-y divide-white/3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-forest-dark/60 shimmer flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-forest-dark/60 rounded w-3/4 shimmer" />
                <div className="h-2 bg-forest-dark/60 rounded w-1/2 shimmer" />
              </div>
              <div className="h-4 w-20 bg-forest-dark/60 rounded shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card py-16 text-center"
      >
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-lg font-marseille font-semibold text-cream/60">
          No transactions found
        </h3>
        <p className="text-sm text-cream/30 mt-1">
          Try adjusting your filters or create a new transaction
        </p>
      </motion.div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 bg-forest-dark/30">
              {['Date', 'Description', 'Category', 'Type', 'Amount', 'Created By', 'Actions'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-cream/40 uppercase
                      tracking-wider px-5 py-3.5 first:pl-5"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/3">
            <AnimatePresence initial={false}>
              {transactions.map((tx, idx) => (
                <React.Fragment key={tx.id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="table-row-hover group cursor-pointer"
                    onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
                  >
                    <td className="px-5 py-3.5 text-sm text-cream/60 whitespace-nowrap">
                      {format(new Date(tx.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-cream font-medium truncate max-w-[180px]">
                        {tx.description || '—'}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-cream/60 capitalize bg-white/5
                        px-2 py-1 rounded-lg">
                        {tx.category.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={tx.type}>{tx.type}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-sm font-bold font-marseille ${
                          tx.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}$
                        {Number(tx.amount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-cream/40">
                      {(tx as Transaction & { creator_name?: string }).creator_name || '—'}
                    </td>
                    <td
                      className="px-5 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canWrite() && onEdit && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onEdit(tx)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg
                              text-cream/40 hover:text-sand hover:bg-sand/10 transition-colors"
                            title="Edit"
                          >
                            ✎
                          </motion.button>
                        )}
                        {canDelete() && onDelete && (
                          <>
                            {deleteConfirmId === tx.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleConfirmDelete(tx.id)}
                                  className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400
                                    hover:bg-red-500/30 text-xs font-medium transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 rounded-lg bg-white/5 text-cream/40
                                    hover:bg-white/10 text-xs transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setDeleteConfirmId(tx.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg
                                  text-cream/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Delete"
                              >
                                ✕
                              </motion.button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>

                  {/* Expanded Row */}
                  <AnimatePresence>
                    {expandedId === tx.id && (
                      <motion.tr
                        key={`${tx.id}-expanded`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan={7} className="px-5 py-3 bg-forest-dark/20">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-cream/40 mb-1">Notes</p>
                              <p className="text-cream/70">{tx.notes || 'No notes'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-cream/40 mb-1">Transaction ID</p>
                              <p className="text-cream/50 text-xs font-mono truncate">{tx.id}</p>
                            </div>
                            <div>
                              <p className="text-xs text-cream/40 mb-1">Created At</p>
                              <p className="text-cream/70">
                                {format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm')}
                              </p>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-white/5">
        {transactions.map((tx, idx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 hover:bg-white/3 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${tx.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                >
                  <span className="text-lg">{tx.type === 'income' ? '↑' : '↓'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-cream truncate">
                    {tx.description || tx.category}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-cream/40">
                      {format(new Date(tx.date), 'MMM dd, yyyy')}
                    </p>
                    <Badge variant={tx.type}>{tx.type}</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className={`text-sm font-bold font-marseille ${
                    tx.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}$
                  {Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex gap-1 mt-1 justify-end">
                  {canWrite() && onEdit && (
                    <button
                      onClick={() => onEdit(tx)}
                      className="text-xs text-sand hover:text-sand/80 px-2 py-0.5
                        bg-sand/10 rounded transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete() && onDelete && (
                    <button
                      onClick={() => setDeleteConfirmId(tx.id)}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-0.5
                        bg-red-500/10 rounded transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};