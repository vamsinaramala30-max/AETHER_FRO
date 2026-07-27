import React from 'react';

interface AssistantHeaderProps {
  title: string;
  onClearSession?: () => void;
}

export const AssistantHeader: React.FC<AssistantHeaderProps> = ({ title, onClearSession }) => {
  return (
    <header className="z-10 flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center space-x-3">
        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-950/40" />
        <h1 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          {title}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        {onClearSession && (
          <button
            onClick={onClearSession}
            className="cursor-pointer rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Clear Thread
          </button>
        )}
      </div>
    </header>
  );
};
