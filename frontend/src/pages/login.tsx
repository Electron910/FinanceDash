import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { ParticleBackground } from '../components/three/ParticleBackground';
import Head from 'next/head';
import Link from 'next/link';


interface LoginForm {
  email: string;
  password: string;
}

const DEMO_ACCOUNTS = [
  {
    label: 'Admin',
    email: 'admin@financedash.com',
    password: 'password123',
    role: 'Full Access',
    icon: '⚡',
    color: '#A27B5C',
  },
  {
    label: 'Analyst',
    email: 'analyst@financedash.com',
    password: 'password123',
    role: 'Read + Write',
    icon: '📊',
    color: '#60a5fa',
  },
  {
    label: 'Viewer',
    email: 'viewer@financedash.com',
    password: 'password123',
    role: 'Read Only',
    icon: '👁',
    color: '#a78bfa',
  },
];

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    const success = await login(data.email, data.password);
    if (success) {
      router.push('/dashboard');
    }
    setIsSubmitting(false);
  };

  const fillDemo = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  if (isLoading) return null;

  return (
    <>
      <Head>
        <title>Login — FinanceDash</title>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#2C3930',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ParticleBackground particleCount={80} />

        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '20%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(162,123,92,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(63,79,68,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '440px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                background: '#A27B5C',
                boxShadow: '0 0 40px rgba(162, 123, 92, 0.5)',
                color: '#2C3930',
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              ₣
            </motion.div>
            <h1
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '2rem',
                color: '#DCD7C9',
                fontWeight: 'bold',
                margin: 0,
              }}
            >
              FinanceDash
            </h1>
            <p style={{ color: 'rgba(220,215,201,0.4)', fontSize: '0.875rem', marginTop: '4px' }}>
              Professional Finance Management
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              backgroundColor: 'rgba(44, 57, 48, 0.9)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '1px solid rgba(162, 123, 92, 0.15)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            }}
          >
            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.25rem',
                color: '#DCD7C9',
                fontWeight: '600',
                marginBottom: '1.5rem',
              }}
            >
              Welcome back
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: '500',
                    color: 'rgba(220,215,201,0.8)',
                    marginBottom: '6px',
                  }}
                >
                  Email Address <span style={{ color: '#A27B5C' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(220,215,201,0.3)',
                      fontSize: '0.875rem',
                    }}
                  >
                    ✉
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    style={{
                      width: '100%',
                      backgroundColor: '#2C3930',
                      border: errors.email
                        ? '1px solid rgba(248,113,113,0.6)'
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '10px 12px 10px 36px',
                      color: '#DCD7C9',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#A27B5C';
                      e.target.style.boxShadow = '0 0 0 2px rgba(162,123,92,0.2)';
                    }}
                    onBlur={(e) => {
                      if (!errors.email) {
                        e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '4px' }}>
                    ⚠ {errors.email.message}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: '500',
                    color: 'rgba(220,215,201,0.8)',
                    marginBottom: '6px',
                  }}
                >
                  Password <span style={{ color: '#A27B5C' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(220,215,201,0.3)',
                      fontSize: '0.875rem',
                    }}
                  >
                    🔒
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      backgroundColor: '#2C3930',
                      border: errors.password
                        ? '1px solid rgba(248,113,113,0.6)'
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '10px 40px 10px 36px',
                      color: '#DCD7C9',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#A27B5C';
                      e.target.style.boxShadow = '0 0 0 2px rgba(162,123,92,0.2)';
                    }}
                    onBlur={(e) => {
                      if (!errors.password) {
                        e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                    {...register('password', {
                      required: 'Password is required',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(220,215,201,0.4)',
                      fontSize: '0.875rem',
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {errors.password && (
                  <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '4px' }}>
                    ⚠ {errors.password.message}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  backgroundColor: '#A27B5C',
                  color: '#2C3930',
                  fontWeight: '700',
                  fontSize: '0.9375rem',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 0 24px rgba(162,123,92,0.4)',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {isSubmitting ? (
                  <>
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(44,57,48,0.3)',
                        borderTopColor: '#2C3930',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        display: 'inline-block',
                      }}
                    />
                    Signing In...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </motion.button>
            </form>

            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                style={{
                  fontSize: '0.6875rem',
                  color: 'rgba(220,215,201,0.35)',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.75rem',
                }}
              >
                Demo Accounts
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {DEMO_ACCOUNTS.map((acc) => (
                  <motion.button
                    key={acc.label}
                    type="button"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => fillDemo(acc.email, acc.password)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '10px 8px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      gap: '4px',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        'rgba(162,123,92,0.4)';
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        'rgba(162,123,92,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        'rgba(255,255,255,0.03)';
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{acc.icon}</span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#DCD7C9',
                      }}
                    >
                      {acc.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: 'rgba(220,215,201,0.35)',
                      }}
                    >
                      {acc.role}
                    </span>
                  </motion.button>
                ))}
              </div>
              <p
                style={{
                  fontSize: '0.6875rem',
                  color: 'rgba(220,215,201,0.2)',
                  textAlign: 'center',
                  marginTop: '8px',
                }}
              >
                Click to auto-fill credentials
              </p>
            </div>
            {/* Register Link */}
            <div style={{
              textAlign: 'center',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(220,215,201,0.4)' }}>
                New to FinanceDash?{' '}
                <Link href="/register" style={{ color: '#A27B5C', textDecoration: 'none', fontWeight: '500' }}>
                  Create an account →
                </Link>
              </p>
            </div>
          </motion.div>

          <p
            style={{
              textAlign: 'center',
              fontSize: '0.75rem',
              color: 'rgba(220,215,201,0.18)',
              marginTop: '1.5rem',
            }}
          >
            Finance Dashboard v1.0 — Secure & Encrypted
          </p>
        </motion.div>
      </div>

      {/* Keyframe for spinner */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #2C3930 inset !important;
          -webkit-text-fill-color: #DCD7C9 !important;
          caret-color: #DCD7C9;
        }
      `}</style>
    </>
  );
}