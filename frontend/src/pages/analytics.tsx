import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';
import { MonthlyTrend, WeeklyTrend, CategoryTotal } from '../types';
import { TransactionChart } from '../components/dashboard/TransactionChart';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalyticsPage() {
  const { hasRole } = useAuth();
  const [monthlyTrends, setMonthlyTrends]   = useState<MonthlyTrend[]>([]);
  const [weeklyTrends, setWeeklyTrends]     = useState<WeeklyTrend[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [loading, setLoading]               = useState(true);
  const [monthRange, setMonthRange]         = useState(6);

  const canAccess = hasRole('analyst');

  useEffect(() => {
    if (!canAccess) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [monthly, weekly, categories] = await Promise.all([
          dashboardAPI.getMonthlyTrends(monthRange),
          dashboardAPI.getWeeklyTrends(8),
          dashboardAPI.getCategories(),
        ]);
        setMonthlyTrends((monthly.data.data as MonthlyTrend[])      || []);
        setWeeklyTrends((weekly.data.data as WeeklyTrend[])         || []);
        setCategoryTotals((categories.data.data as CategoryTotal[]) || []);
      } catch {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [monthRange, canAccess]);

  const weeklyChartData = {
    labels: weeklyTrends.map((w) =>
      new Date(w.week_start).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    ),
    datasets: [
      {
        label: 'Income',
        data: weeklyTrends.map((w) => Number(w.income)),
        backgroundColor: 'rgba(74, 222, 128, 0.7)',
        borderColor: '#4ade80',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Expenses',
        data: weeklyTrends.map((w) => Number(w.expenses)),
        backgroundColor: 'rgba(248, 113, 113, 0.7)',
        borderColor: '#f87171',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(220, 215, 201, 0.7)',
          font: { size: 11 },
          boxWidth: 12,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#3F4F44',
        titleColor: '#DCD7C9',
        bodyColor: 'rgba(220, 215, 201, 0.8)',
        borderColor: 'rgba(162, 123, 92, 0.3)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (ctx: { dataset: { label?: string }; raw: unknown }) {
            return ' ' + ctx.dataset.label + ': $' + Number(ctx.raw).toLocaleString();
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: 'rgba(220, 215, 201, 0.5)',
          font: { size: 10 },
        },
        border: { color: 'transparent' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: 'rgba(220, 215, 201, 0.5)',
          font: { size: 10 },
          callback: function (v: unknown) {
            return '$' + Number(v).toLocaleString();
          },
        },
        border: { color: 'transparent' },
      },
    },
  };

  const incomeTotal  = categoryTotals.filter((c) => c.type === 'income').reduce((acc, c) => acc + Number(c.total), 0);
  const expenseTotal = categoryTotals.filter((c) => c.type === 'expense').reduce((acc, c) => acc + Number(c.total), 0);
  const netFlow      = incomeTotal - expenseTotal;

  if (!canAccess) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-xl font-marseille font-semibold text-cream opacity-60">
            Access Denied
          </h3>
          <p className="text-sm text-cream opacity-30 mt-1">Analyst or Admin role required</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Analytics — FinanceDash</title>
      </Head>

      <div className="space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Income',   value: incomeTotal,  color: 'text-green-400' },
            { label: 'Total Expenses', value: expenseTotal, color: 'text-red-400'   },
            {
              label: 'Net Flow',
              value: netFlow,
              color: netFlow >= 0 ? 'text-green-400' : 'text-red-400',
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card"
            >
              {loading ? (
                <div className="space-y-2">
                  <div className="shimmer h-3 w-24 rounded" />
                  <div className="shimmer h-8 w-32 rounded" />
                </div>
              ) : (
                <>
                  <p className="text-xs text-cream opacity-40 uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className={'text-3xl font-bold font-marseille ' + item.color}>
                    {netFlow < 0 && item.label === 'Net Flow' ? '-' : ''}$
                    {Math.abs(item.value).toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-marseille text-cream font-semibold">Monthly Analysis</h3>
              <p className="text-xs text-cream opacity-40 mt-0.5">Income vs Expenses trend</p>
            </div>
            <div className="flex gap-1">
              {[3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonthRange(m)}
                  className={
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all ' +
                    (monthRange === m
                      ? 'bg-sand text-forest-dark'
                      : 'text-cream opacity-50 hover:opacity-100')
                  }
                >
                  {m}M
                </button>
              ))}
            </div>
          </div>
          <TransactionChart data={monthlyTrends} type="line" isLoading={loading} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="mb-4">
              <h3 className="font-marseille text-cream font-semibold">Weekly Breakdown</h3>
              <p className="text-xs text-cream opacity-40 mt-0.5">Last 8 weeks comparison</p>
            </div>
            {loading ? (
              <div className="h-56 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-sand border-opacity-20 border-t-sand rounded-full animate-spin" />
              </div>
            ) : weeklyTrends.length === 0 ? (
              <div className="h-56 flex items-center justify-center">
                <p className="text-cream opacity-40 text-sm">No weekly data available</p>
              </div>
            ) : (
              <div className="h-56">
                <Bar data={weeklyChartData} options={weeklyChartOptions} />
              </div>
            )}
          </motion.div>

          <CategoryChart data={categoryTotals} isLoading={loading} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="mb-4">
            <h3 className="font-marseille text-cream font-semibold">Category Breakdown</h3>
            <p className="text-xs text-cream opacity-40 mt-0.5">Detailed spending by category</p>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="shimmer h-3 w-32 rounded" />
                  <div className="shimmer flex-1 h-2 rounded" />
                  <div className="shimmer h-3 w-20 rounded" />
                </div>
              ))}
            </div>
          ) : categoryTotals.length === 0 ? (
            <p className="text-center text-cream opacity-40 text-sm py-8">No category data</p>
          ) : (
            <div className="space-y-3">
              {categoryTotals.map((cat, idx) => (
                <motion.div
                  key={cat.category + '-' + cat.type}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-28 text-xs text-cream opacity-60 capitalize truncate flex-shrink-0">
                    {cat.category.replace(/_/g, ' ')}
                  </div>
                  <div className="flex-1 h-2 bg-forest-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: cat.percentage + '%' }}
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                      className={'h-full rounded-full ' + (cat.type === 'income' ? 'bg-green-400' : 'bg-red-400')}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-medium text-cream w-20 text-right">
                      ${Number(cat.total).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs text-cream opacity-40 w-10 text-right">
                      {cat.percentage}%
                    </span>
                    <span className={'text-xs px-1.5 py-0.5 rounded-full w-16 text-center ' + (cat.type === 'income' ? 'bg-green-500 bg-opacity-10 text-green-400' : 'bg-red-500 bg-opacity-10 text-red-400')}>
                      {cat.type}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}