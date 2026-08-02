import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`bg-surface-elevated/95 absolute z-50 mt-2 w-48 rounded-xl border border-border-strong py-1.5 shadow-2xl backdrop-blur-lg ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {items.map((item) => {
              const isDisabled = item.disabled === true;
              const isDanger = item.danger === true;
              const hasIcon = item.icon !== undefined && item.icon !== null;
              return (
                <button
                  key={item.id}
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled && item.onClick !== undefined) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                  className={`flex w-full items-center px-3 py-2 text-xs font-medium transition-colors ${
                    isDanger
                      ? 'text-status-error hover:bg-status-error/10'
                      : 'text-text-primary hover:bg-surface-hover'
                  } ${isDisabled ? 'cursor-not-allowed opacity-40' : ''}`}
                >
                  {hasIcon && <span className="mr-2.5 text-base">{item.icon}</span>}
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
