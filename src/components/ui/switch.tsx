import React from 'react';
import { motion } from 'framer-motion';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className={`inline-flex items-center space-x-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`w-11 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-accent-primary' : 'bg-surface-hover border border-border-subtle'}`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-4 h-4 rounded-full bg-white shadow-md"
        />
      </div>
      {label && <span className="text-sm font-medium text-text-primary">{label}</span>}
    </label>
  );
};