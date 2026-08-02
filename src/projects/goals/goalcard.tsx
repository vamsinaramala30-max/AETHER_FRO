import React, { useState } from 'react';
import { Goal } from './goalservice';
import { GoalProgress } from './goalprogress';
import { Check, Edit2 } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (id: string, nextProgress: number) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdateProgress }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(goal.progress);

  const saveProgress = () => {
    onUpdateProgress(goal.id, inputValue);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-block rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            {goal.category}
          </span>
          <h3 className="mt-2 text-base font-bold leading-snug text-slate-900 dark:text-white">
            {goal.title}
          </h3>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        {goal.description}
      </p>

      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/50">
        <strong className="font-bold text-slate-900 dark:text-slate-200">Success Criteria:</strong>{' '}
        <span className="text-slate-600 dark:text-slate-400">{goal.metrics}</span>
      </div>

      <div className="mt-auto pt-2">
        <GoalProgress progress={goal.progress} />
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
        {editing ? (
          <div className="flex w-full items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              value={inputValue}
              onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
              className="w-20 rounded-lg border border-indigo-500 bg-white px-2 py-1 text-xs font-bold text-slate-900 outline-none dark:bg-slate-800 dark:text-white"
            />
            <button
              onClick={saveProgress}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <Check className="h-3.5 w-3.5" /> Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <Edit2 className="h-3.5 w-3.5" /> Adjust Progress
          </button>
        )}
        <span className="ml-auto text-[11px] font-medium text-slate-500 dark:text-slate-400">
          Target: {goal.targetDate}
        </span>
      </div>
    </div>
  );
};
