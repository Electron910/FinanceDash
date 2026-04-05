import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { StatsCard } from '../components/dashboard/StatsCard';
import { TransactionChart } from '../components/dashboard/TransactionChart';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { Badge } from '../components/ui/Badge';
import type { DashboardData, DashboardSummary } from '../types/index';

const SECONDARY_STATS: Array<{
  label: string;
  color: string;
  suffix?: string;
  getValue: (
    summary: DashboardSummary | null | undefined,
    data: DashboardData | null | undefined
  ) => number;
}> = [
  {
    label: 'Income Entries',
    color: 'text-green-400',
    getValue: (summary) => summary?.incomeCount ?? 0,
  },
  {
    label: 'Expense Entries',
    color: 'text-red-400',
    getValue: (summary) => summary?.expenseCount ?? 0,
  },
  {
    label: 'Total Users',
    color: 'text-sand',
    getValue: (_summary, data) => data?.totalUsers ?? 0,
  },
  {
    label: 'Savings Rate',
    color: 'text-blue-400',
    suffix: '%',
    getValue: (summary) =>
      summary?.totalIncome
        ? Math.round(
            ((summary.totalIncome - summary.totalExpenses) /
              summary.totalIncome) *
              100
          )
        : 0,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, refetch } = useDashboard();

  const summary = data?.summary;

  return (
    <>
      <Head>
        <title>Dashboard — FinanceDash</title>
      </Head>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="font-marseille text-2xl font-bold text-cream">
              Good {getTimeOfDay()}, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p className="mt-1 text-sm text-cream opacity-40">
              Here's your financial overview for today
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={user?.role as 'admin' | 'analyst' | 'viewer'}>
              {user?.role}
            </Badge>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refetch}
              className="flex h-9 w-9 items-center justify-center rounded-xl
                         border border-white border-opacity-10
                         bg-white bg-opacity-5
                         text-cream opacity-60
                         transition-all duration-200
                         hover:border-opacity-20 hover:opacity-100"
              title="Refresh"
            >
              ↻
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Income"
            value={summary?.totalIncome ?? 0}
            variant="income"
            icon="↑"
            delay={0}
            isLoading={loading}
            change={8.2}
          />
          <StatsCard
            title="Total Expenses"
            value={summary?.totalExpenses ?? 0}
            variant="expense"
            icon="↓"
            delay={0.1}
            isLoading={loading}
            change={-3.1}
          />
          <StatsCard
            title="Net Balance"
            value={Math.abs(summary?.netBalance ?? 0)}
            prefix={
              summary?.netBalance != null && summary.netBalance < 0
                ? '-$'
                : '$'
            }
            variant="balance"
            icon="⇄"
            delay={0.2}
            isLoading={loading}
          />
          <StatsCard
            title="Transactions"
            value={summary?.transactionCount ?? 0}
            prefix=""
            variant="default"
            icon="◈"
            delay={0.3}
            isLoading={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {SECONDARY_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="card text-center"
            >
              {loading ? (
                <div className="space-y-2">
                  <div className="shimmer mx-auto h-3 w-20 rounded" />
                  <div className="shimmer mx-auto h-7 w-16 rounded" />
                </div>
              ) : (
                <>
                  <p className="mb-1 text-xs uppercase tracking-wider text-cream opacity-40">
                    {stat.label}
                  </p>
                  <p className={`font-marseille text-2xl font-bold ${stat.color}`}>
                    {stat.getValue(summary, data).toLocaleString()}
                    {stat.suffix ?? ''}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionChart
              data={data?.monthlyTrends ?? []}
              type="line"
              isLoading={loading}
            />
          </div>
          <div>
            <CategoryChart
              data={data?.categoryTotals ?? []}
              isLoading={loading}
            />
          </div>
        </div>

        <RecentTransactions
          transactions={data?.recentActivity ?? []}
          isLoading={loading}
        />
      </div>
    </>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}