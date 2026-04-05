import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { MonthlyTrend } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TransactionChartProps {
  data: MonthlyTrend[];
  type?: 'line' | 'bar';
  isLoading?: boolean;
}

export const TransactionChart: React.FC<TransactionChartProps> = ({
  data,
  type = 'line',
  isLoading = false,
}) => {
  const labels = data.map((d) => d.month_name + ' ' + d.year);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: data.map((d) => Number(d.income)),
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        fill: type === 'line',
        tension: 0.4,
        pointBackgroundColor: '#4ade80',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: 'Expenses',
        data: data.map((d) => Number(d.expenses)),
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        fill: type === 'line',
        tension: 0.4,
        pointBackgroundColor: '#f87171',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(220, 215, 201, 0.7)',
          font: { size: 11 },
          padding: 16,
          boxWidth: 12,
          boxHeight: 12,
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
          label: (context: { dataset: { label?: string }; raw: unknown }) =>
            ' ' + context.dataset.label + ': $' + Number(context.raw).toLocaleString(),
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: 'rgba(220, 215, 201, 0.5)',
          font: { size: 10 },
        },
        border: { color: 'transparent' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
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

  if (isLoading) {
    return (
      <div className="card h-72 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-sand border-opacity-20 border-t-sand rounded-full animate-spin" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="card h-72 flex items-center justify-center">
        <p className="text-cream opacity-40 text-sm">No trend data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-marseille text-cream font-semibold">Monthly Trends</h3>
          <p className="text-xs text-cream opacity-40 mt-0.5">Income vs Expenses over time</p>
        </div>
      </div>
      <div className="h-64">
        {type === 'line' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </motion.div>
  );
};