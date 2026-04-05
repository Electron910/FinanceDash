import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'analyst' | 'viewer';
  status?: 'active' | 'inactive';
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: User | null;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
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
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    defaultValues: initialData
      ? { name: initialData.name, email: initialData.email, role: initialData.role, status: initialData.status }
      : { role: 'viewer', status: 'active' },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: UserFormData) => {
    const success = await onSubmit(data);
    if (success && !initialData) reset();
  };

  const roleDescriptions = {
    viewer: 'Can only view dashboard and transaction data',
    analyst: 'Can view all data and create/edit transactions',
    admin: 'Full access including user management and deletion',
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        required
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 2, message: 'At least 2 characters' },
          maxLength: { value: 100, message: 'Max 100 characters' },
        })}
      />

      <Input
        label="Email Address"
        type="email"
        required
        placeholder="john@example.com"
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Valid email required' },
        })}
      />

      {!initialData && (
        <Input
          label="Password"
          type="password"
          required
          placeholder="Min 8 chars with upper, lower, number"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Need uppercase, lowercase and number',
            },
          })}
        />
      )}

      {/* Role Selection */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-cream/80">
          Role <span className="text-sand">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['viewer', 'analyst', 'admin'] as const).map((role) => (
            <label
              key={role}
              className={`relative flex flex-col items-center p-3 rounded-xl border-2
                cursor-pointer transition-all duration-200 ${
                  selectedRole === role
                    ? 'border-sand bg-sand/10 text-sand'
                    : 'border-white/10 text-cream/50 hover:border-white/20'
                }`}
            >
              <input
                type="radio"
                value={role}
                className="sr-only"
                {...register('role', { required: 'Role is required' })}
              />
              <span className="text-lg mb-1">
                {role === 'viewer' ? '👁' : role === 'analyst' ? '📊' : '⚡'}
              </span>
              <span className="text-xs font-semibold capitalize">{role}</span>
            </label>
          ))}
        </div>
        {selectedRole && (
          <p className="text-xs text-cream/40 px-1">{roleDescriptions[selectedRole]}</p>
        )}
        {errors.role && <p className="text-xs text-red-400">⚠ {errors.role.message}</p>}
      </div>

      {/* Status - only show when editing */}
      {initialData && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-cream/80">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {(['active', 'inactive'] as const).map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 p-3 rounded-xl border border-white/10
                  cursor-pointer hover:border-white/20 transition-colors"
              >
                <input
                  type="radio"
                  value={status}
                  className="sr-only"
                  {...register('status')}
                />
                <div
                  className={`w-3 h-3 rounded-full ${
                    status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`}
                />
                <span className="text-sm text-cream/70 capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>
      )}

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
          {initialData ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};