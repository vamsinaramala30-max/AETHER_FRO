import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CommandAction {
  id: string;
  title: string;
  category: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  actions: CommandAction[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, actions }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const filtered = actions.filter(
    (action) =>
      action.title.toLowerCase().includes(query.toLowerCase()) ||
      action.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            className="bg-surface-elevated/95 border-border-strong relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-2xl"
          >
            <div className="border-border-subtle flex items-center space-x-3 border-b p-4">
              <span className="text-text-tertiary">🔍</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                placeholder="Type a command or search..."
                className="text-text-primary placeholder:text-text-tertiary w-full bg-transparent text-sm outline-none"
              />
              <span className="bg-surface-hover text-text-tertiary rounded px-2 py-0.5 text-[10px]">
                ESC
              </span>
            </div>
            <div className="max-h-80 space-y-1 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="text-text-tertiary p-4 text-center text-xs">No actions found.</p>
              ) : (
                filtered.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      action.onSelect();
                      onClose();
                    }}
                    className="hover:bg-surface-hover text-text-primary flex w-full items-center justify-between rounded-xl p-3 text-left text-sm transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {action.icon && <span>{action.icon}</span>}
                      <span>{action.title}</span>
                    </div>
                    <span className="text-text-tertiary bg-surface-subtle border-border-subtle rounded border px-2 py-0.5 text-[10px] font-semibold uppercase">
                      {action.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
