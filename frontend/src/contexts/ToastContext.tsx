import React, { createContext, useContext } from 'react';
import toast from 'react-hot-toast';

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showLoading: (message: string) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showSuccess = (message: string) =>
    toast.success(message, {
      style: {
        background: '#3F4F44',
        color: '#DCD7C9',
        border: '1px solid #A27B5C',
      },
      iconTheme: { primary: '#A27B5C', secondary: '#DCD7C9' },
    });

  const showError = (message: string) =>
    toast.error(message, {
      style: {
        background: '#2C3930',
        color: '#DCD7C9',
        border: '1px solid #ef4444',
      },
    });

  const showInfo = (message: string) =>
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#3F4F44',
        color: '#DCD7C9',
        border: '1px solid #A27B5C',
      },
    });

  const showLoading = (message: string) =>
    toast.loading(message, {
      style: {
        background: '#3F4F44',
        color: '#DCD7C9',
      },
    });

  const dismissToast = (id: string) => toast.dismiss(id);

  return (
    <ToastContext.Provider
      value={{ showSuccess, showError, showInfo, showLoading, dismissToast }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};