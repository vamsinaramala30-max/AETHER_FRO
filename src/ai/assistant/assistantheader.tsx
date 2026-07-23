import React from 'react';

interface AssistantHeaderProps {
  title: string;
  onClearSession?: () => void;
}

export const AssistantHeader: React.FC<AssistantHeaderProps> = ({ title, onClearSession }) => {
  return (
    <header className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between z-10">
      <div className="flex items-center space-x-3">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-950/40 animate-pulse" />
        <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
          {title}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        {onClearSession && (
          <button
            onClick={onClearSession}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Clear Thread
          </button>
        )}
      </div>
    </header>
  );
};