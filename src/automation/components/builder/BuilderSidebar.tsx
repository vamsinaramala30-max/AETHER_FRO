import React from 'react';
import { Plus, Zap, GitBranch, Sparkles, CheckSquare } from 'lucide-react';

interface Props {
  onAddStep: (type: 'condition' | 'ai_action' | 'action') => void;
}

export const BuilderSidebar: React.FC<Props> = ({ onAddStep }) => {
  const stepPalette = [
    {
      type: 'ai_action' as const,
      label: 'AI Directive / Logic',
      description: 'Ask Aether, summarize, analyze priorities, or transform format',
      icon: Sparkles,
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    },
    {
      type: 'condition' as const,
      label: 'Condition Gate',
      description: 'Equals, contains, exists, AND / OR filtering rule',
      icon: GitBranch,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      type: 'action' as const,
      label: 'Workspace Action',
      description: 'Tasks, projects, knowledge notes, calendar events, notifications',
      icon: CheckSquare,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="space-y-3 p-4 border-b border-slate-200 dark:border-slate-800 lg:border-b-0 lg:border-r">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Add Step Palette</h4>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:grid-cols-1">
        {stepPalette.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              onClick={() => onAddStep(item.type)}
              className="group flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left transition-all hover:border-amber-500 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500"
            >
              <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                  + Add {item.label}
                </h5>
                <p className="mt-0.5 text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
