import React from 'react';
import { PanelLeft, Plus } from 'lucide-react';
import { useAssistantState, useAssistantActions } from './assistanthooks';

interface AssistantHeaderProps {
  title: string;
  onClearSession?: () => void;
}

export const AssistantHeader: React.FC<AssistantHeaderProps> = ({ title, onClearSession }) => {
  const { sidebarOpen } = useAssistantState();
  const { toggleSidebar } = useAssistantActions();

  return (
    <header className="z-10 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 md:px-6">
      <div className="flex items-center space-x-3">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Open Sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-950/40" />
          <h1 className="max-w-xs truncate text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 md:max-w-md">
            {title}
          </h1>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {onClearSession && (
          <button
            onClick={onClearSession}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-700/80 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Plus className="h-3.5 w-3.5" />
            New Chat
          </button>
        )}
      </div>
    </header>
  );
};
