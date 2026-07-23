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
    { key: 'ai_query', label: 'Query AI Node', description: 'Initialize Aether Core LLM runtime', icon: '🤖' },
    { key: 'new_task', label: 'Push Direct Task', description: 'Allocate unit onto workspace stack', icon: '⚡' },
    { key: 'note_append', label: 'Append Raw Note', description: 'Commit volatile insight text', icon: '📝' },
    { key: 'doc_stage', label: 'Stage Document', description: 'Ingest vector payload binary', icon: '📤' }
  ];

  const handleTrigger = (key: string, customHandler?: () => void) => {
    if (customHandler) customHandler();
    else if (onActionTrigger) onActionTrigger(key);
  };

  return (
    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Command Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions ? actions.map((act, index) => (
          <button
            key={index}
            onClick={act.handler}
            className="flex items-start text-left gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 group"
          >
            <span className="text-xl p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform">{act.icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{act.label}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{act.description}</p>
            </div>
          </button>
        )) : defaultActions.map((act) => (
          <button
            key={act.key}
            onClick={() => { handleTrigger(act.key); }}
            className="flex items-start text-left gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 group"
          >
            <span className="text-xl p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform">{act.icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{act.label}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{act.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;