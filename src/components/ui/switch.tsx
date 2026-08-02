import React from 'react';
import { motion } from 'framer-motion';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, disabled = false }) => {
  const hasLabel = typeof label === 'string' && label.trim() !== '';

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label
      className={`inline-flex items-center space-x-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <div
        onClick={handleClick}
        className={`h-6 w-11 rounded-full p-1 transition-colors ${checked ? 'bg-accent-primary' : 'border border-border-subtle bg-surface-hover'}`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="h-4 w-4 rounded-full bg-white shadow-md"
        />
      </div>
      {hasLabel && <span className="text-sm font-medium text-text-primary">{label}</span>}
    </label>
  );
};
