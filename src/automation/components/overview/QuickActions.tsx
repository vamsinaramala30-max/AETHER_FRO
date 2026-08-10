import React from 'react';
import { Sparkles, Calendar, BookOpen, Sliders, ArrowRight } from 'lucide-react';

interface Props {
  onOpenQuickAi: () => void;
  onOpenTemplates: () => void;
  onOpenBuilder: () => void;
}

export const QuickActions: React.FC<Props> = ({ onOpenQuickAi, onOpenTemplates, onOpenBuilder }) => {
  const actions = [
    {
      title: 'Daily Planning Briefing',
      description: 'Ask Aether AI to synthesize daily tasks & calendar schedule every morning.',
      icon: Calendar,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400',
      action: onOpenQuickAi,
    },
    {
      title: 'Browse Ready Templates',
      description: 'Choose pre-built workflows for tasks, projects, document indexing, and AI digests.',
      icon: BookOpen,
      color: 'from-sky-500/10 to-indigo-500/10 text-sky-600 dark:text-sky-400',
      action: onOpenTemplates,
    },
    {
      title: 'Custom Workflow Canvas',
      description: 'Build multi-step logic linking triggers, condition rules, and AI workspace actions.',
      icon: Sliders,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400',
      action: onOpenBuilder,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {actions.map((act, i) => {
        const Icon = act.icon;
        return (
          <button
            key={i}
            onClick={act.action}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 text-left transition-all hover:border-amber-500/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500/40"
          >
            <div>
              <div className={`mb-3.5 inline-flex rounded-xl bg-gradient-to-r p-3 ${act.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                {act.title}
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{act.description}</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400">
              Configure Now
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
