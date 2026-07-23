import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string | number;
}

export interface SidebarProps {
  items: NavItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  brandName?: string;
  brandLogo?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activePath,
  onNavigate,
  brandName = 'AETHER',
  brandLogo
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="h-screen bg-surface-subtle/80 backdrop-blur-xl border-r border-border-subtle flex flex-col justify-between p-4 relative z-20 select-none"
    >
      <div>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center space-x-3 overflow-hidden">
            {brandLogo || <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center font-bold text-white shrink-0">A</div>}
            {!collapsed && <span className="font-bold text-lg text-text-primary tracking-wide">{brandName}</span>}
          </div>
          <button
            onClick={() => { setCollapsed(!collapsed); }}
            className="text-text-tertiary hover:text-text-primary p-1 rounded-md hover:bg-surface-hover"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="space-y-1.5">
          {items.map((item) => {
            const isActive = activePath === item.path;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.path); }}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-surface-hover text-text-tertiary">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border-subtle pt-4 px-2">
        {!collapsed && <p className="text-[10px] text-text-tertiary uppercase tracking-widest">AETHER OS v2.4</p>}
      </div>
    </motion.aside>
  );
};