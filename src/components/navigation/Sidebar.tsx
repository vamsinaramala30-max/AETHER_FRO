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
  brandLogo,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-surface-subtle/80 border-border-subtle relative z-20 flex h-screen select-none flex-col justify-between border-r p-4 backdrop-blur-xl"
    >
      <div>
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center space-x-3 overflow-hidden">
            {brandLogo || (
              <div className="bg-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-white">
                A
              </div>
            )}
            {!collapsed && (
              <span className="text-text-primary text-lg font-bold tracking-wide">{brandName}</span>
            )}
          </div>
          <button
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            className="text-text-tertiary hover:text-text-primary hover:bg-surface-hover rounded-md p-1"
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
                onClick={() => {
                  onNavigate(item.path);
                }}
                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20 border'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                <span className="shrink-0 text-lg">{item.icon}</span>
                {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="bg-surface-hover text-text-tertiary ml-auto rounded-full px-2 py-0.5 text-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-border-subtle border-t px-2 pt-4">
        {!collapsed && (
          <p className="text-text-tertiary text-[10px] uppercase tracking-widest">AETHER OS v2.4</p>
        )}
      </div>
    </motion.aside>
  );
};
