import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  variant?: 'income' | 'expense' | 'admin' | 'analyst' | 'viewer' | 'active' | 'inactive' | 'default';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  income: 'bg-green-500/15 text-green-400 border-green-500/20',
  expense: 'bg-red-500/15 text-red-400 border-red-500/20',
  admin: 'bg-sand/20 text-sand border-sand/30',
  analyst: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  viewer: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  active: 'bg-green-500/15 text-green-400 border-green-500/20',
  inactive: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
  default: 'bg-white/10 text-cream/70 border-white/10',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className,
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};