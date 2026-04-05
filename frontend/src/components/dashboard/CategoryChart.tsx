import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { CategoryTotal } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  data: CategoryTotal[];
  isLoading?: boolean;
}

const CHART_COLORS = [
  '#A27B5C', '#DCD7C9', '#4ade80', '#f87171',
  '#60a5fa', '#f59e0b', '#a78bfa', '#34d399',
  '#fb923c', '#e879f9',
];

export const CategoryChart: React.FC<CategoryChartProps> = ({ data, isLoading = false }) => {
  const [activeType, setActiveType] = useState<'income' | 'expense' | 'all'>('all');

  const filtered =
    activeType === 'all' ? data : data.filter((d) => d.type === activeType);

  const chartData = {
    labels: filtered.map((d) => d.category),
    datasets: [
      {
        data: filtered.map((d) => d.total),
        backgroundColor: CHART_COLORS.map((c) => `${c}33`),
        borderColor: CHART_COLORS,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#3F4F44',
        titleColor: '#DCD7C9',
        bodyColor: 'rgba(220, 215, 201, 0.8)',
        borderColor: 'rgba(162, 123, 92, 0.3)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx: { label: string; raw: unknown; dataset: { data: unknown[] } }) => {
            const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const pct = (((ctx.raw as number) / total) * 100).toFixed(1);
            return ` ${ctx.label}: $${Number(ctx.raw).toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="card h-72 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-sand/20 border-t-sand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-marseille text-cream font-semibold">By Category</h3>
          <p className="text-xs text-cream/40 mt-0.5">Spending distribution</p>
        </div>
        <div className="flex gap-1">
          {(['all', 'income', 'expense'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeType === t
                  ? 'bg-sand text-forest-dark'
                  : 'text-cream/50 hover:text-cream hover:bg-white/5'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="h-56 flex items-center justify-center">
          <p className="text-cream/40 text-sm">No data for selected filter</p>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="h-48 w-48 flex-shrink-0 relative">
            <Doughnut data={chartData} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-cream/40">Total</p>
              <p className="text-sm font-bold text-cream">
                ${filtered.reduce((a, b) => a + b.total, 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto max-h-48">
            {filtered.slice(0, 8).map((item, idx) => (
              <div key={`${item.category}-${idx}`} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                  />
                  <span className="text-xs text-cream/70 truncate">{item.category}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-medium text-cream">
                    ${item.total.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-xs text-cream/40">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};