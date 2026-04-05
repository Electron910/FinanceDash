import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CreateTransactionDto, Transaction } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionDto) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Transaction | null;
  isLoading?: boolean;
}

const CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Rental Income', 'Bonus',
  'Food & Dining', 'Transport', 'Utilities', 'Entertainment', 'Healthcare',
  'Shopping', 'Education', 'Rent', 'Insurance', 'Taxes', 'Other',
];

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionDto>({
    defaultValues: initialData
      ? {
          amount: initialData.amount,
          type: initialData.type,
          category: initialData.category,
          date: initialData.date.split('T')[0],
          notes: initialData.notes || '',
          description: initialData.description || '',
        }
      : {
          type: 'expense',
          date: new Date().toISOString().split('T')[0],
        },
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (initialData) {
      reset({
        amount: initialData.amount,
        type: initialData.type,
        category: initialData.category,
        date: initialData.date.split('T')[0],
        notes: initialData.notes || '',
        description: initialData.description || '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: CreateTransactionDto) => {
    const success = await onSubmit({ ...data, amount: Number(data.amount) });
    if (success && !initialData) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Type Toggle */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-cream/80">
          Transaction Type <span className="text-sand">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['income', 'expense'] as const).map((type) => (
            <motion.button
              key={type}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setValue('type', type)}
              className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                selectedType === type
                  ? type === 'income'
                    ? 'bg-green-500/20 border-green-500/60 text-green-400'
                    : 'bg-red-500/20 border-red-500/60 text-red-400'
                  : 'bg-transparent border-white/10 text-cream/40 hover:border-white/20'
              }`}
            >
              {type === 'income' ? '↑ Income' : '↓ Expense'}
            </motion.button>
          ))}
        </div>
        <input type="hidden" {...register('type', { required: 'Type is required' })} />
      </div>

      {/* Amount */}
      <Input
        label="Amount"
        type="number"
        step="0.01"
        min="0.01"
        required
        placeholder="0.00"
        leftIcon={<span className="text-sm font-bold">$</span>}
        error={errors.amount?.message}
        {...register('amount', {
          required: 'Amount is required',
          min: { value: 0.01, message: 'Amount must be greater than 0' },
        })}
      />

      {/* Category */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-cream/80">
          Category <span className="text-sand">*</span>
        </label>
        <select
          className="input-field"
          {...register('category', { required: 'Category is required' })}
        >
          <option value="">Select category...</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat.toLowerCase().replace(/\s+/g, '_')}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-xs text-red-400">⚠ {errors.category.message}</p>
        )}
      </div>

      {/* Date */}
      <Input
        label="Date"
        type="date"
        required
        error={errors.date?.message}
        {...register('date', { required: 'Date is required' })}
      />

      {/* Description */}
      <Input
        label="Description"
        type="text"
        placeholder="Brief description..."
        error={errors.description?.message}
        {...register('description', {
          maxLength: { value: 500, message: 'Max 500 characters' },
        })}
      />

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-cream/80">Notes</label>
        <textarea
          rows={3}
          placeholder="Additional notes..."
          className="input-field resize-none"
          {...register('notes', {
            maxLength: { value: 1000, message: 'Max 1000 characters' },
          })}
        />
        {errors.notes && (
          <p className="text-xs text-red-400">⚠ {errors.notes.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          fullWidth
          disabled={isSubmitting || isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isSubmitting || isLoading}
        >
          {initialData ? 'Update Transaction' : 'Create Transaction'}
        </Button>
      </div>
    </form>
  );
};