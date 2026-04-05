import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import { authAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'viewer' | 'analyst';
  inviteCode: string;
}

const INVITE_CODE = 'FINANCE2024';

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: { role: 'viewer' },
  });

  const password = watch('password');
  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    if (data.inviteCode !== INVITE_CODE) {
      toast.error('Invalid invite code');
      return;
    }
    setIsSubmitting(true);
    try {
      await userAPI.create({
        name:     data.name,
        email:    data.email,
        password: data.password,
        role:     data.role,
      });
      toast.success('Account created! You can now login.');
      router.push('/login');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#2C3930',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#DCD7C9',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: '500',
    color: 'rgba(220,215,201,0.8)',
    marginBottom: '6px',
  };

  const errorStyle: React.CSSProperties = {
    color: '#f87171',
    fontSize: '0.75rem',
    marginTop: '4px',
  };

  return (
    <>
      <Head><title>Create Account — FinanceDash</title></Head>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#2C3930',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}>
        {/* Background Orbs */}
        <div style={{ position: 'fixed', top: '20%', right: '15%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(162,123,92,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '20%', left: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(63,79,68,0.4) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '64px', height: '64px',
              borderRadius: '18px', backgroundColor: '#A27B5C',
              color: '#2C3930', fontSize: '1.75rem', fontWeight: 'bold',
              boxShadow: '0 0 32px rgba(162,123,92,0.4)',
              marginBottom: '12px',
            }}>₣</div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#DCD7C9', fontWeight: 'bold' }}>
              Create Account
            </h1>
            <p style={{ color: 'rgba(220,215,201,0.4)', fontSize: '0.875rem', marginTop: '4px' }}>
              Join FinanceDash today
            </p>
          </div>

          {/* Card */}
          <div style={{
            backgroundColor: 'rgba(44,57,48,0.9)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(162,123,92,0.12)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
          }}>
            {/* Step Indicator */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
              {[1, 2].map((s) => (
                <div key={s} style={{
                  flex: 1, height: '3px', borderRadius: '2px',
                  backgroundColor: s <= step ? '#A27B5C' : 'rgba(255,255,255,0.1)',
                  transition: 'background-color 0.3s',
                }} />
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(220,215,201,0.4)', marginBottom: '1.25rem' }}>
              Step {step} of 2 — {step === 1 ? 'Personal Info' : 'Account Setup'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  {/* Name */}
                  <div>
                    <label style={labelStyle}>Full Name <span style={{ color: '#A27B5C' }}>*</span></label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#A27B5C'; e.target.style.boxShadow = '0 0 0 2px rgba(162,123,92,0.2)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                      {...register('name', {
                        required: 'Name is required',
                        minLength: { value: 2, message: 'At least 2 characters' },
                      })}
                    />
                    {errors.name && <p style={errorStyle}>⚠ {errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={labelStyle}>Email Address <span style={{ color: '#A27B5C' }}>*</span></label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#A27B5C'; e.target.style.boxShadow = '0 0 0 2px rgba(162,123,92,0.2)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                      })}
                    />
                    {errors.email && <p style={errorStyle}>⚠ {errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label style={labelStyle}>Password <span style={{ color: '#A27B5C' }}>*</span></label>
                    <input
                      type="password"
                      placeholder="Min 8 chars, upper, lower, number"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#A27B5C'; e.target.style.boxShadow = '0 0 0 2px rgba(162,123,92,0.2)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'At least 8 characters' },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Need uppercase, lowercase and number',
                        },
                      })}
                    />
                    {errors.password && <p style={errorStyle}>⚠ {errors.password.message}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label style={labelStyle}>Confirm Password <span style={{ color: '#A27B5C' }}>*</span></label>
                    <input
                      type="password"
                      placeholder="Repeat password"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#A27B5C'; e.target.style.boxShadow = '0 0 0 2px rgba(162,123,92,0.2)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (val) => val === password || 'Passwords do not match',
                      })}
                    />
                    {errors.confirmPassword && <p style={errorStyle}>⚠ {errors.confirmPassword.message}</p>}
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => setStep(2)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '12px',
                      backgroundColor: '#A27B5C', color: '#2C3930',
                      fontWeight: '700', fontSize: '0.9rem',
                      border: 'none', borderRadius: '10px', cursor: 'pointer',
                      marginTop: '8px',
                    }}
                  >
                    Continue →
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  {/* Role Selection */}
                  <div>
                    <label style={labelStyle}>Account Role <span style={{ color: '#A27B5C' }}>*</span></label>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(220,215,201,0.4)', marginBottom: '10px' }}>
                      Note: Admin accounts must be created by existing admins
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {[
                        { value: 'viewer',  icon: '👁',  label: 'Viewer',  desc: 'View only access' },
                        { value: 'analyst', icon: '📊', label: 'Analyst', desc: 'View & manage records' },
                      ].map((r) => (
                        <label
                          key={r.value}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            padding: '12px 8px',
                            borderRadius: '10px',
                            border: `2px solid ${selectedRole === r.value ? '#A27B5C' : 'rgba(255,255,255,0.08)'}`,
                            backgroundColor: selectedRole === r.value ? 'rgba(162,123,92,0.1)' : 'transparent',
                            cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'center',
                          }}
                        >
                          <input type="radio" value={r.value} style={{ display: 'none' }} {...register('role')} />
                          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{r.icon}</span>
                          <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: selectedRole === r.value ? '#A27B5C' : '#DCD7C9' }}>{r.label}</span>
                          <span style={{ fontSize: '0.6875rem', color: 'rgba(220,215,201,0.4)', marginTop: '2px' }}>{r.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Invite Code */}
                  <div>
                    <label style={labelStyle}>
                      Invite Code <span style={{ color: '#A27B5C' }}>*</span>
                      <span style={{ fontSize: '0.6875rem', color: 'rgba(220,215,201,0.3)', marginLeft: '6px' }}>
                        (Ask your admin for the code)
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter invite code"
                      style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      onFocus={(e) => { e.target.style.borderColor = '#A27B5C'; e.target.style.boxShadow = '0 0 0 2px rgba(162,123,92,0.2)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                      {...register('inviteCode', { required: 'Invite code is required' })}
                    />
                    {errors.inviteCode && <p style={errorStyle}>⚠ {errors.inviteCode.message}</p>}
                    <p style={{ fontSize: '0.6875rem', color: 'rgba(220,215,201,0.25)', marginTop: '4px' }}>
                      Demo code: FINANCE2024
                    </p>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        flex: 1, padding: '11px',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(162,123,92,0.3)',
                        color: '#DCD7C9', fontWeight: '500', fontSize: '0.875rem',
                        borderRadius: '10px', cursor: 'pointer',
                      }}
                    >
                      ← Back
                    </button>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      style={{
                        flex: 2, padding: '11px',
                        backgroundColor: '#A27B5C', color: '#2C3930',
                        fontWeight: '700', fontSize: '0.875rem',
                        border: 'none', borderRadius: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span style={{ width: '14px', height: '14px', border: '2px solid rgba(44,57,48,0.3)', borderTopColor: '#2C3930', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                          Creating...
                        </>
                      ) : 'Create Account ✓'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </form>

            {/* Login Link */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(220,215,201,0.4)' }}>
                Already have an account?{' '}
                <Link href="/login" style={{ color: '#A27B5C', textDecoration: 'none', fontWeight: '500' }}>
                  Sign in →
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}