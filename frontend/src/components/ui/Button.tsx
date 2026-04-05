import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sand/50';

  const variantClasses = {
    primary: 'bg-sand text-forest-dark hover:bg-sand/90 shadow-glow hover:shadow-glow-lg',
    secondary: 'bg-transparent border border-sand/40 text-cream hover:bg-sand/10 hover:border-sand',
    danger: 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30',
    ghost: 'text-cream/70 hover:text-cream hover:bg-white/5',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </motion.button>
  );
};