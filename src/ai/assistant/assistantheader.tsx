import React from 'react';
import { PanelLeft, Plus } from 'lucide-react';
import { useAssistantActions } from './assistanthooks';

interface AssistantHeaderProps {
  title: string;
  onClearSession?: () => void;
}

export const AssistantHeader: React.FC<AssistantHeaderProps> = ({ title, onClearSession }) => {
  const { toggleSidebar } = useAssistantActions();

  return (
    <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
      <div className="flex min-w-0 items-center space-x-2.5">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          title="Toggle Sidebar"
          aria-label="Toggle Conversations Sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
        <div className="flex min-w-0 items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-950/40" />
          <h1 className="xs:max-w-[200px] max-w-[140px] truncate text-xs font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:max-w-md sm:text-sm">
            {title}
          </h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center space-x-2">
        {onClearSession && (
          <button
            onClick={onClearSession}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-700/80 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700 sm:px-3"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="xs:inline hidden">New Chat</span>
            <span className="xs:hidden">New</span>
          </button>
        )}
      </div>
    </header>
  );
};
