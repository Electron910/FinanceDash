import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion } from 'framer-motion';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarWidth = isCollapsed ? 72 : 260;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#2C3930' }}>
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <Header sidebarWidth={sidebarWidth} />
      <main
        style={{
          paddingLeft: `${sidebarWidth + 16}px`,
          paddingRight: '16px',
          paddingTop: '88px',
          paddingBottom: '32px',
          minHeight: '100vh',
          transition: 'padding-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }} className="page-animate">
          {children}
        </div>
      </main>
    </div>
  );
};