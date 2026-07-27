import React from 'react';

interface QuickActionItem {
  label: string;
  description: string;
  handler: () => void;
  icon: string;
}

interface QuickActionsProps {
  actions?: QuickActionItem[];
  onActionTrigger?: (actionKey: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions, onActionTrigger }) => {
  // Safe Fallback Architecture using predefined workspace standard events
  const defaultActions = [
    {
      key: 'ai_query',
      label: 'Query AI Node',
      description: 'Initialize Aether Core LLM runtime',
      icon: '🤖',
    },
    {
      key: 'new_task',
      label: 'Push Direct Task',
      description: 'Allocate unit onto workspace stack',
      icon: '⚡',
    },
    {
      key: 'note_append',
      label: 'Append Raw Note',
      description: 'Commit volatile insight text',
      icon: '📝',
    },
    {
      key: 'doc_stage',
      label: 'Stage Document',
      description: 'Ingest vector payload binary',
      icon: '📤',
    },
  ];

  const handleTrigger = (key: string, customHandler?: () => void) => {
    if (customHandler) customHandler();
    else if (onActionTrigger) onActionTrigger(key);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
      <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Command Actions</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions
          ? actions.map((act, index) => (
              <button
                key={index}
                onClick={act.handler}
                className="focus:ring-primary-500/40 group flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-left transition-all duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 dark:border-slate-800 dark:hover:bg-slate-800/60"
              >
                <span className="rounded-lg bg-slate-100 p-1.5 text-xl transition-transform group-hover:scale-105 dark:bg-slate-800">
                  {act.icon}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                    {act.label}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">
                    {act.description}
                  </p>
                </div>
              </button>
            ))
          : defaultActions.map((act) => (
              <button
                key={act.key}
                onClick={() => {
                  handleTrigger(act.key);
                }}
                className="focus:ring-primary-500/40 group flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-left transition-all duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 dark:border-slate-800 dark:hover:bg-slate-800/60"
              >
                <span className="rounded-lg bg-slate-100 p-1.5 text-xl transition-transform group-hover:scale-105 dark:bg-slate-800">
                  {act.icon}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                    {act.label}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">
                    {act.description}
                  </p>
                </div>
              </button>
            ))}
      </div>
    </div>
  );
};

export default QuickActions;
