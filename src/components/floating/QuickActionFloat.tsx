import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Search, Plus, X, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionFloatProps {
  onOpenSearch?: () => void;
}

export const QuickActionFloat: React.FC<QuickActionFloatProps> = ({ onOpenSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNav = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      role="region"
      aria-label="Quick Actions Floating Menu"
    >
      {/* Action Buttons Popup */}
      {isOpen && (
        <div
          className="flex flex-col gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/90 p-2 shadow-2xl backdrop-blur-xl transition-all duration-200 ease-out dark:bg-slate-900/95"
          role="menu"
          aria-orientation="vertical"
        >
          <button
            type="button"
            onClick={() => handleNav('/app/ai')}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-amber-500/10 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            role="menuitem"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>AI Platform</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenSearch) {
                onOpenSearch();
              } else {
                handleNav('/app/knowledge/search');
              }
            }}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800/80 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
            role="menuitem"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <span>Quick Search</span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('/app/automation')}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            role="menuitem"
          >
            <Zap className="h-4 w-4 text-emerald-400" />
            <span>Automations</span>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Toggle */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close Quick Actions Menu' : 'Open Quick Actions Menu'}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500/40 active:scale-95"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      </button>
    </div>
  );
};
