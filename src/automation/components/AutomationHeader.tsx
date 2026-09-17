import React from 'react';
import { Zap, Sparkles, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onOpenQuickAi: () => void;
  onOpenBuilder: () => void;
}

export const AutomationHeader: React.FC<Props> = ({ onOpenQuickAi, onOpenBuilder }) => {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5">
          <Zap className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Automation Engine
            </h1>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              AI OS Core
            </span>
          </div>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Intelligent daily planning, workspace triggers, autonomous task execution, and
            background workflows
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          onClick={onOpenQuickAi}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:from-amber-600 hover:to-orange-600"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          AI Creator
        </Button>
        <Button
          onClick={onOpenBuilder}
          variant="outline"
          className="border-slate-300 dark:border-slate-700"
        >
          <Sliders className="mr-2 h-4 w-4" />
          Advanced Builder
        </Button>
      </div>
    </div>
  );
};
