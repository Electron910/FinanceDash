import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
}) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={clsx(
          'rounded-full border-sand/20 border-t-sand animate-spin',
          sizeMap[size]
        )}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-cream/60 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-dark/90 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const SkeletonCard: React.FC = () => (
  <div className="card space-y-3 animate-pulse">
    <div className="h-4 bg-forest-dark/60 rounded w-1/3 shimmer" />
    <div className="h-8 bg-forest-dark/60 rounded w-2/3 shimmer" />
    <div className="h-3 bg-forest-dark/60 rounded w-1/2 shimmer" />
  </div>
);

export const SkeletonRow: React.FC = () => (
  <div className="flex items-center gap-4 p-4 animate-pulse">
    <div className="w-8 h-8 rounded-full bg-forest-dark/60 shimmer flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-forest-dark/60 rounded w-3/4 shimmer" />
      <div className="h-2 bg-forest-dark/60 rounded w-1/2 shimmer" />
    </div>
    <div className="h-4 bg-forest-dark/60 rounded w-16 shimmer" />
  </div>
);