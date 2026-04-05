import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  sidebarWidth: number;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':    { title: 'Dashboard',       subtitle: 'Financial overview & insights' },
  '/transactions': { title: 'Transactions',    subtitle: 'Manage financial records' },
  '/analytics':    { title: 'Analytics',       subtitle: 'Trends & category breakdown' },
  '/users':        { title: 'User Management', subtitle: 'Roles & access control' },
  '/settings':     { title: 'Settings',        subtitle: 'System configuration' },
};

const NOTIFICATIONS = [
  { id: 1, icon: '💰', title: 'New income recorded',    body: 'Salary deposit of \$5,000',      time: '2m ago',  unread: true  },
  { id: 2, icon: '⚠️', title: 'High expense alert',     body: 'Expenses up 12% this month',    time: '1h ago',  unread: true  },
  { id: 3, icon: '📊', title: 'Monthly report ready',   body: 'March 2026 summary available',  time: '3h ago',  unread: true  },
  { id: 4, icon: '👤', title: 'New user registered',    body: 'Jane Analyst joined the team',  time: '1d ago',  unread: false },
  { id: 5, icon: '✅', title: 'Transaction approved',   body: 'Rent payment verified',         time: '2d ago',  unread: false },
];

export const Header: React.FC<HeaderProps> = ({ sidebarWidth }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown]       = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications]     = useState(NOTIFICATIONS);

  const pageInfo  = pageTitles[router.pathname] || { title: 'FinanceDash', subtitle: '' };
  const unreadCount = notifications.filter((n) => n.unread).length;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  const roleColors: Record<string, string> = {
    admin:   '#A27B5C',
    analyst: '#60a5fa',
    viewer:  '#a78bfa',
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const closeAll = () => {
    setShowDropdown(false);
    setShowNotifications(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 20,
        paddingLeft: `${sidebarWidth + 16}px`,
        paddingRight: '16px',
        paddingTop: '12px',
        transition: 'padding-left 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div
        style={{
          height: '60px',
          backgroundColor: 'rgba(63,79,68,0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        {/* Page Info */}
        <div>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.0625rem',
            color: '#DCD7C9',
            fontWeight: '600',
            lineHeight: '1.2',
          }}>
            {pageInfo.title}
          </h1>
          <p style={{ fontSize: '0.6875rem', color: 'rgba(220,215,201,0.4)', marginTop: '1px' }}>
            {pageInfo.subtitle}
          </p>
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* Date */}
          <span style={{ fontSize: '0.75rem', color: 'rgba(220,215,201,0.4)' }}>
            {today}
          </span>

          {/* ── Notification Bell ── */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowDropdown(false);
              }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: showNotifications
                  ? 'rgba(162,123,92,0.15)'
                  : 'rgba(255,255,255,0.05)',
                border: showNotifications
                  ? '1px solid rgba(162,123,92,0.4)'
                  : '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(220,215,201,0.8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              🔔
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#A27B5C',
                  borderRadius: '50%',
                  border: '1px solid #3F4F44',
                }} />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                    onClick={closeAll}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '320px',
                      backgroundColor: '#3F4F44',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
                      overflow: 'hidden',
                      zIndex: 20,
                    }}
                  >
                    {/* Header */}
                    <div style={{
                      padding: '14px 16px',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#DCD7C9' }}>
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <span style={{
                            fontSize: '0.625rem',
                            fontWeight: '600',
                            color: '#2C3930',
                            backgroundColor: '#A27B5C',
                            borderRadius: '9999px',
                            padding: '1px 6px',
                          }}>
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          style={{
                            fontSize: '0.6875rem',
                            color: '#A27B5C',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notification List */}
                    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() =>
                            setNotifications((prev) =>
                              prev.map((x) => x.id === n.id ? { ...x, unread: false } : x)
                            )
                          }
                          style={{
                            display: 'flex',
                            gap: '12px',
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            cursor: 'pointer',
                            backgroundColor: n.unread
                              ? 'rgba(162,123,92,0.06)'
                              : 'transparent',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = n.unread
                              ? 'rgba(162,123,92,0.06)'
                              : 'transparent')
                          }
                        >
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            flexShrink: 0,
                          }}>
                            {n.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px',
                            }}>
                              <p style={{
                                fontSize: '0.8125rem',
                                fontWeight: n.unread ? '600' : '400',
                                color: '#DCD7C9',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}>
                                {n.title}
                              </p>
                              <span style={{
                                fontSize: '0.625rem',
                                color: 'rgba(220,215,201,0.35)',
                                flexShrink: 0,
                              }}>
                                {n.time}
                              </span>
                            </div>
                            <p style={{
                              fontSize: '0.75rem',
                              color: 'rgba(220,215,201,0.5)',
                              marginTop: '2px',
                            }}>
                              {n.body}
                            </p>
                          </div>
                          {n.unread && (
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#A27B5C',
                              flexShrink: 0,
                              marginTop: '6px',
                            }} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={{
                      padding: '10px 16px',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      textAlign: 'center',
                    }}>
                      <button
                        onClick={closeAll}
                        style={{
                          fontSize: '0.75rem',
                          color: 'rgba(220,215,201,0.4)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* ── User Menu ── */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowDropdown(!showDropdown);
                setShowNotifications(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px 6px 6px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #A27B5C, rgba(162,123,92,0.5))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2C3930',
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#DCD7C9',
                  whiteSpace: 'nowrap',
                }}>
                  {user?.name}
                </p>
                <span style={{
                  fontSize: '0.625rem',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  backgroundColor: (roleColors[user?.role || 'viewer']) + '20',
                  color: roleColors[user?.role || 'viewer'],
                  border: '1px solid ' + (roleColors[user?.role || 'viewer']) + '40',
                }}>
                  {user?.role}
                </span>
              </div>
              <span style={{ color: 'rgba(220,215,201,0.4)', fontSize: '0.625rem' }}>▾</span>
            </button>

            <AnimatePresence>
              {showDropdown && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                    onClick={closeAll}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '200px',
                      backgroundColor: '#3F4F44',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
                      overflow: 'hidden',
                      zIndex: 20,
                    }}
                  >
                    <div style={{
                      padding: '12px',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <p style={{ fontSize: '0.8125rem', fontWeight: '500', color: '#DCD7C9' }}>
                        {user?.name}
                      </p>
                      <p style={{ fontSize: '0.6875rem', color: 'rgba(220,215,201,0.4)', marginTop: '2px' }}>
                        {user?.email}
                      </p>
                    </div>
                    <div style={{ padding: '6px' }}>
                      <button
                        onClick={() => { closeAll(); router.push('/settings'); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          color: 'rgba(220,215,201,0.7)',
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = 'transparent')
                        }
                      >
                        ⚙ Settings
                      </button>
                      <button
                        onClick={() => { closeAll(); logout(); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          color: '#f87171',
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.08)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = 'transparent')
                        }
                      >
                        ⏻ Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};