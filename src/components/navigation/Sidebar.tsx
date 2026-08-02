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
      className="bg-surface-subtle/80 relative z-20 flex h-screen select-none flex-col justify-between border-r border-border-subtle p-4 backdrop-blur-xl"
    >
      <div>
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center space-x-3 overflow-hidden">
            {brandLogo || (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-primary font-bold text-white">
                A
              </div>
            )}
            {!collapsed && (
              <span className="text-lg font-bold tracking-wide text-text-primary">{brandName}</span>
            )}
          </div>
          <button
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            className="rounded-md p-1 text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
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
                    ? 'bg-accent-primary/10 border-accent-primary/20 border text-accent-primary'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                <span className="shrink-0 text-lg">{item.icon}</span>
                {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto rounded-full bg-surface-hover px-2 py-0.5 text-xs text-text-tertiary">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border-subtle px-2 pt-4">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-widest text-text-tertiary">AETHER OS v2.4</p>
        )}
      </div>
    </motion.aside>
  );
};
