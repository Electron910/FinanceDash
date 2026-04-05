import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: ('admin' | 'analyst' | 'viewer')[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard',    href: '/dashboard',    icon: '◈', roles: ['viewer', 'analyst', 'admin'] },
  { label: 'Transactions', href: '/transactions', icon: '⇄', roles: ['viewer', 'analyst', 'admin'] },
  { label: 'Analytics',    href: '/analytics',    icon: '◉', roles: ['analyst', 'admin'] },
  { label: 'Users',        href: '/users',        icon: '◎', roles: ['admin'] },
  { label: 'Settings',     href: '/settings',     icon: '⊙', roles: ['viewer', 'analyst', 'admin'] },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const S = {
  sidebar: (collapsed: boolean): React.CSSProperties => ({
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: collapsed ? '72px' : '260px',
    backgroundColor: '#3F4F44',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 30,
    transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
    overflow: 'hidden',
  }),
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    height: '64px',
    padding: '0 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  } as React.CSSProperties,
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: '#A27B5C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#2C3930',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    flexShrink: 0,
    boxShadow: '0 0 16px rgba(162,123,92,0.4)',
    cursor: 'pointer',
  } as React.CSSProperties,
  logoText: {
    marginLeft: '10px',
    overflow: 'hidden',
    whiteSpace: 'nowrap' as const,
  },
  logoTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#DCD7C9',
    lineHeight: '1.2',
  },
  logoSub: {
    fontSize: '0.6875rem',
    color: 'rgba(220,215,201,0.4)',
    marginTop: '1px',
  },
  toggleBtn: {
    marginLeft: 'auto',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(220,215,201,0.5)',
    cursor: 'pointer',
    fontSize: '1rem',
    flexShrink: 0,
  } as React.CSSProperties,
  nav: {
    flex: 1,
    padding: '12px 8px',
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  navItem: (active: boolean, collapsed: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: collapsed ? '10px 0' : '10px 12px',
    borderRadius: '10px',
    cursor: 'pointer',
    textDecoration: 'none',
    backgroundColor: active ? 'rgba(162,123,92,0.18)' : 'transparent',
    border: active ? '1px solid rgba(162,123,92,0.25)' : '1px solid transparent',
    color: active ? '#A27B5C' : 'rgba(220,215,201,0.6)',
    transition: 'all 0.15s ease',
    justifyContent: collapsed ? 'center' : 'flex-start',
    position: 'relative',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }),
  navIcon: {
    fontSize: '1.1rem',
    flexShrink: 0,
    width: '20px',
    textAlign: 'center' as const,
  },
  navLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  activeBar: {
    position: 'absolute' as const,
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '3px',
    height: '20px',
    backgroundColor: '#A27B5C',
    borderRadius: '0 3px 3px 0',
  },
  userArea: (collapsed: boolean): React.CSSProperties => ({
    padding: '12px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    justifyContent: collapsed ? 'center' : 'flex-start',
  }),
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #A27B5C, rgba(162,123,92,0.5))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#2C3930',
    fontWeight: 'bold',
    fontSize: '0.875rem',
    flexShrink: 0,
  } as React.CSSProperties,
  userName: {
    fontSize: '0.8125rem',
    fontWeight: '500',
    color: '#DCD7C9',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  userRole: {
    fontSize: '0.6875rem',
    color: 'rgba(220,215,201,0.4)',
    textTransform: 'capitalize' as const,
  },
  logoutBtn: {
    marginLeft: 'auto',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(220,215,201,0.3)',
    cursor: 'pointer',
    fontSize: '0.875rem',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  } as React.CSSProperties,
};

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const router = useRouter();
  const { user, hasRole, logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const visibleItems = navItems.filter((item) =>
    item.roles.some((role) => hasRole(role))
  );

  return (
    <div style={S.sidebar(isCollapsed)}>
      {/* Logo */}
      <div style={S.logoArea}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} style={S.logoIcon}>
            ₣
          </motion.div>
          {!isCollapsed && (
            <div style={S.logoText}>
              <p style={S.logoTitle}>FinanceDash</p>
              <p style={S.logoSub}>Pro Dashboard</p>
            </div>
          )}
        </Link>
        <button style={S.toggleBtn} onClick={onToggle}>
          {isCollapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Navigation */}
      <nav style={S.nav}>
        {visibleItems.map((item) => {
          const isActive = router.pathname === item.href;
          const isHovered = hoveredItem === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  ...S.navItem(isActive, isCollapsed),
                  ...(isHovered && !isActive ? {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#DCD7C9',
                  } : {}),
                }}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {isActive && <div style={S.activeBar} />}
                <span style={S.navIcon}>{item.icon}</span>
                {!isCollapsed && <span style={S.navLabel}>{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div style={S.userArea(isCollapsed)}>
        <div style={S.avatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        {!isCollapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={S.userName}>{user?.name}</p>
              <p style={S.userRole}>{user?.role}</p>
            </div>
            <button
              style={S.logoutBtn}
              onClick={logout}
              title="Logout"
              onMouseEnter={(e) => { (e.currentTarget).style.color = '#f87171'; (e.currentTarget).style.backgroundColor = 'rgba(248,113,113,0.1)'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.color = 'rgba(220,215,201,0.3)'; (e.currentTarget).style.backgroundColor = 'transparent'; }}
            >
              ⏻
            </button>
          </>
        )}
      </div>
    </div>
  );
};