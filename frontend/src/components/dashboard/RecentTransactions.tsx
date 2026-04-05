import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Transaction } from '../../types';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const categoryIcons: Record<string, string> = {
  salary: '💼', food: '🍔', transport: '🚗', utilities: '💡',
  entertainment: '🎬', healthcare: '🏥', shopping: '🛍️',
  investment: '📈', rent: '🏠', education: '📚',
};

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  isLoading = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-marseille text-cream font-semibold">Recent Activity</h3>
          <p className="text-xs text-cream/40 mt-0.5">Latest financial records</p>
        </div>
        <Link
          href="/transactions"
          className="text-xs text-sand hover:text-sand/80 transition-colors"
        >
          View all →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-forest-dark/60 shimmer flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-forest-dark/60 rounded w-3/4 shimmer" />
                <div className="h-2 bg-forest-dark/60 rounded w-1/2 shimmer" />
              </div>
              <div className="h-4 w-16 bg-forest-dark/60 rounded shimmer" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-8 text-center text-cream/40 text-sm">
          No recent transactions
        </div>
      ) : (
        <div className="space-y-1">
          {transactions.map((tx, idx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/3 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-dark flex items-center
                justify-center text-lg flex-shrink-0">
                {categoryIcons[tx.category?.toLowerCase()] || '💰'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cream truncate">
                  {tx.description || tx.category}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-cream/40">
                    {format(new Date(tx.date), 'MMM dd, yyyy')}
                  </p>
                  <Badge variant={tx.type}>{tx.type}</Badge>
                </div>
              </div>
              <span
                className={`text-sm font-bold font-marseille flex-shrink-0 ${
                  tx.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};