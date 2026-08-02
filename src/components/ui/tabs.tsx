import React from 'react';
import { motion } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex space-x-1 border-b border-border-subtle p-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const hasIcon = tab.icon !== undefined && tab.icon !== null;
        return (
          <button
            key={tab.id}
            onClick={() => {
              onChange(tab.id);
            }}
            className={`relative flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium outline-none transition-colors ${
              isActive ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {hasIcon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? 'bg-accent-primary/20 text-accent-primary' : 'bg-surface-hover text-text-tertiary'}`}
              >
                {tab.badge}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
