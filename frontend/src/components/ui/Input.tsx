import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-cream/80"
          >
            {label}
            {props.required && <span className="text-sand ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full bg-forest-dark border rounded-lg px-4 py-2.5 text-cream placeholder-cream/30',
              'focus:outline-none focus:ring-1 transition-all duration-200 text-sm',
              error
                ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
                : 'border-white/10 focus:border-sand focus:ring-sand/30',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 flex items-center gap-1">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-cream/40">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';