import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

export interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const colors = {
    success: 'border-status-success text-status-success bg-status-success/10',
    error: 'border-status-error text-status-error bg-status-error/10',
    warning: 'border-status-warning text-status-warning bg-status-warning/10',
    info: 'border-accent-primary text-accent-primary bg-accent-primary/10'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`pointer-events-auto min-w-[280px] max-w-md p-4 rounded-xl border bg-surface-elevated/95 backdrop-blur-md shadow-2xl flex items-start space-x-3`}
          >
            <div className={`p-1 rounded-full text-xs font-bold ${colors[toast.type]}`}>
              {icons[toast.type]}
            </div>
            <div className="flex-grow">
              <p className="text-sm font-semibold text-text-primary">{toast.title}</p>
              {toast.message && <p className="text-xs text-text-secondary mt-0.5">{toast.message}</p>}
            </div>
            <button onClick={() => { onDismiss(toast.id); }} className="text-text-tertiary hover:text-text-primary text-xs">
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};