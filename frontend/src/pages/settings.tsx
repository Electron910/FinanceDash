import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import toast from 'react-hot-toast';

interface ProfileForm {
  name: string;
  email: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance'>('profile');
  const [profileLoading, setProfileLoading] = useState(false);

  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm<PasswordForm>();

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data: ProfileForm) => {
    if (!user) return;
    try {
      setProfileLoading(true);
      await userAPI.update(user.id, { name: data.name, email: data.email });
      toast.success('Profile updated successfully!');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update profile';
      toast.error(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    toast.success('Password change feature coming soon!');
    resetPassword();
    void data;
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: '👤' },
    { key: 'security', label: 'Security', icon: '🔒' },
    { key: 'appearance', label: 'Appearance', icon: '🎨' },
  ] as const;

  return (
    <>
      <Head>
        <title>Settings — FinanceDash</title>
      </Head>

      <div className="max-w-3xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card flex items-center gap-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sand to-sand/50
            flex items-center justify-center text-forest-dark font-bold text-2xl flex-shrink-0
            shadow-glow">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-marseille font-bold text-cream">{user?.name}</h2>
            <p className="text-cream/50 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={user?.role as 'admin' | 'analyst' | 'viewer'}>
                {user?.role}
              </Badge>
              <Badge variant="active">Active</Badge>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-1 bg-forest-dark/50 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-forest text-cream shadow-sm border border-white/5'
                    : 'text-cream/50 hover:text-cream'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card space-y-5"
          >
            <div>
              <h3 className="font-marseille text-cream font-semibold">Profile Information</h3>
              <p className="text-xs text-cream/40 mt-0.5">Update your personal details</p>
            </div>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                required
                error={profileErrors.name?.message}
                {...profileRegister('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'At least 2 characters' },
                })}
              />
              <Input
                label="Email Address"
                type="email"
                required
                error={profileErrors.email?.message}
                {...profileRegister('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
              />
              <div className="pt-2">
                <Button type="submit" variant="primary" loading={profileLoading}>
                  Save Changes
                </Button>
              </div>
            </form>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <h4 className="text-sm font-medium text-cream/60">Account Information</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'User ID', value: user?.id?.slice(0, 8) + '...' },
                  { label: 'Role', value: user?.role },
                  {
                    label: 'Member Since',
                    value: user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })
                      : '—',
                  },
                  { label: 'Status', value: 'Active' },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-cream/40 mb-0.5">{item.label}</p>
                    <p className="text-sm text-cream capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card space-y-5"
          >
            <div>
              <h3 className="font-marseille text-cream font-semibold">Security Settings</h3>
              <p className="text-xs text-cream/40 mt-0.5">Manage your password and security</p>
            </div>
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <Input
                label="Current Password"
                type="password"
                required
                placeholder="Enter current password"
                error={passwordErrors.currentPassword?.message}
                {...passwordRegister('currentPassword', {
                  required: 'Current password is required',
                })}
              />
              <Input
                label="New Password"
                type="password"
                required
                placeholder="Min 8 chars, upper, lower, number"
                error={passwordErrors.newPassword?.message}
                {...passwordRegister('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'At least 8 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Need uppercase, lowercase and number',
                  },
                })}
              />
              <Input
                label="Confirm New Password"
                type="password"
                required
                placeholder="Repeat new password"
                error={passwordErrors.confirmPassword?.message}
                {...passwordRegister('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) =>
                    val === newPassword || 'Passwords do not match',
                })}
              />
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={passwordSubmitting}
                >
                  Update Password
                </Button>
              </div>
            </form>

            <div className="pt-4 border-t border-white/5">
              <h4 className="text-sm font-medium text-cream/60 mb-3">Security Tips</h4>
              <ul className="space-y-2">
                {[
                  'Use a unique password not used on other sites',
                  'Enable two-factor authentication when available',
                  'Never share your credentials with others',
                  'Log out after using shared devices',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-cream/40">
                    <span className="text-sand mt-0.5 flex-shrink-0">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {activeTab === 'appearance' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card space-y-5"
          >
            <div>
              <h3 className="font-marseille text-cream font-semibold">Appearance</h3>
              <p className="text-xs text-cream/40 mt-0.5">Customize your dashboard look</p>
            </div>

            <div>
              <p className="text-sm font-medium text-cream/70 mb-3">Color Palette</p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'Forest Dark', hex: '#2C3930' },
                  { name: 'Forest', hex: '#3F4F44' },
                  { name: 'Sand', hex: '#A27B5C' },
                  { name: 'Cream', hex: '#DCD7C9' },
                ].map((color) => (
                  <div key={color.name} className="text-center">
                    <div
                      className="w-full h-12 rounded-xl border border-white/10 mb-2 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="text-xs text-cream/60">{color.name}</p>
                    <p className="text-xs text-cream/30 font-mono">{color.hex}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-forest-dark/50 rounded-xl border border-sand/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌿</span>
                <div>
                  <p className="text-sm font-medium text-cream">Forest Theme (Default)</p>
                  <p className="text-xs text-cream/40">
                    Dark forest tones with warm sand accents
                  </p>
                </div>
                <span className="ml-auto text-xs bg-sand/20 text-sand px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
            </div>

            <p className="text-xs text-cream/30">
              Additional themes will be available in future updates.
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}