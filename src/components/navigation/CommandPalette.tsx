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
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [isOpen, onClose]);

  const filtered = actions.filter(action =>
    action.title.toLowerCase().includes(query.toLowerCase()) ||
    action.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
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
            className="relative w-full max-w-xl bg-surface-elevated/95 backdrop-blur-2xl border border-border-strong rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            <div className="p-4 border-b border-border-subtle flex items-center space-x-3">
              <span className="text-text-tertiary">🔍</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); }}
                placeholder="Type a command or search..."
                className="w-full bg-transparent text-text-primary text-sm outline-none placeholder:text-text-tertiary"
              />
              <span className="text-[10px] bg-surface-hover px-2 py-0.5 rounded text-text-tertiary">ESC</span>
            </div>
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <p className="text-xs text-text-tertiary p-4 text-center">No actions found.</p>
              ) : (
                filtered.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      action.onSelect();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors text-left text-sm text-text-primary"
                  >
                    <div className="flex items-center space-x-3">
                      {action.icon && <span>{action.icon}</span>}
                      <span>{action.title}</span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-text-tertiary bg-surface-subtle px-2 py-0.5 rounded border border-border-subtle">
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