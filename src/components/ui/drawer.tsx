import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  title?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'right',
  title,
  children
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => { document.removeEventListener('keydown', handleEscape); };
  }, [isOpen, onClose]);

  const variants = {
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            variants={variants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 ${position === 'left' ? 'left-0' : 'right-0'} w-full max-w-md bg-surface-elevated/95 backdrop-blur-xl border-l border-border-strong shadow-2xl p-6 flex flex-col z-10`}
          >
            {title && (
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-4">
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                <button onClick={onClose} className="text-text-tertiary hover:text-text-primary p-1 rounded-lg">
                  ✕
                </button>
              </div>
            )}
            <div className="flex-grow overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};