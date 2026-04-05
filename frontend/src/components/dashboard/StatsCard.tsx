import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface StatsCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  icon: string;
  variant?: 'default' | 'income' | 'expense' | 'balance';
  delay?: number;
  isLoading?: boolean;
}

const variantStyles = {
  default: 'bg-forest border-white border-opacity-5',
  income: 'bg-forest border-green-500 border-opacity-20',
  expense: 'bg-forest border-red-500 border-opacity-20',
  balance: 'bg-forest border-sand border-opacity-20',
};

const iconBg = {
  default: 'bg-white bg-opacity-10 text-cream opacity-60',
  income: 'bg-green-500 bg-opacity-20 text-green-400',
  expense: 'bg-red-500 bg-opacity-20 text-red-400',
  balance: 'bg-sand bg-opacity-20 text-sand',
};

const iconText = {
  default: 'text-cream',
  income: 'text-green-400',
  expense: 'text-red-400',
  balance: 'text-sand',
};

function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  prefix = '$',
  suffix,
  change,
  icon,
  variant = 'default',
  delay = 0,
  isLoading = false,
}) => {
  const animatedValue = useCountUp(value, 1500);

  if (isLoading) {
    return (
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <div className="shimmer h-3 w-20 rounded" />
          <div className="shimmer h-10 w-10 rounded-xl" />
        </div>
        <div className="shimmer h-8 w-32 rounded" />
        <div className="shimmer h-3 w-16 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={clsx(
        'relative overflow-hidden rounded-2xl p-5 border',
        'shadow-card transition-all duration-300',
        variantStyles[variant]
      )}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium text-cream opacity-50 uppercase tracking-wider">
            {title}
          </p>
          <div
            className={clsx(
              'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
              iconBg[variant]
            )}
          >
            <span className={iconText[variant]}>{icon}</span>
          </div>
        </div>

        <div className="mb-2">
          <span className="text-2xl font-bold text-cream font-marseille animated-number">
            {prefix}
            {animatedValue.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
            {suffix}
          </span>
        </div>

        {change !== undefined && (
          <div className="flex items-center gap-1">
            <span
              className={clsx(
                'text-xs font-medium',
                change >= 0 ? 'text-green-400' : 'text-red-400'
              )}
            >
              {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-xs text-cream opacity-30">vs last month</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};