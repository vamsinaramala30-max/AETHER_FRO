import React, { useState } from 'react';
import { Goal, GoalStatus } from './goalservice';
import { GoalProgress } from './goalprogress';
import { Check, Edit2, Trash2, Calendar, Target, AlertTriangle } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (id: string, nextProgress: number) => void;
  onStatusChange?: (id: string, status: GoalStatus) => void;
  onDeleteGoal?: (id: string) => void;
}

const STATUS_CONFIG: Record<GoalStatus, { label: string; style: string }> = {
  PLANNED: {
    label: 'PLANNED',
    style: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  },
  IN_PROGRESS: {
    label: 'IN PROGRESS',
    style: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
  },
  AT_RISK: {
    label: 'AT RISK',
    style: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  },
  COMPLETED: {
    label: 'COMPLETED',
    style: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  },
  ARCHIVED: {
    label: 'ARCHIVED',
    style: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-500 dark:border-slate-800',
  },
};

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onUpdateProgress,
  onStatusChange,
  onDeleteGoal,
}) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(goal.progress);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const saveProgress = () => {
    onUpdateProgress(goal.id, inputValue);
    setEditing(false);
  };

  const currentStatusConfig = STATUS_CONFIG[goal.status] || STATUS_CONFIG.IN_PROGRESS;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              {goal.category}
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider ${currentStatusConfig.style}`}
            >
              {currentStatusConfig.label}
            </span>
          </div>
          <h3 className="mt-2 text-base font-bold leading-snug text-slate-900 dark:text-white">
            {goal.title}
          </h3>
        </div>

        {onDeleteGoal && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
            title="Delete goal"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {goal.description && (
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {goal.description}
        </p>
      )}

      {goal.metrics && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/50">
          <strong className="font-bold text-slate-900 dark:text-slate-200">Success Criteria:</strong>{' '}
          <span className="text-slate-600 dark:text-slate-400">{goal.metrics}</span>
        </div>
      )}

      <div className="mt-auto pt-2">
        <GoalProgress progress={goal.progress} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              value={inputValue}
              onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
              className="w-16 rounded-lg border border-indigo-500 bg-white px-2 py-1 text-xs font-bold text-slate-900 outline-none dark:bg-slate-800 dark:text-white"
            />
            <button
              onClick={saveProgress}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <Check className="h-3.5 w-3.5" /> Save
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              <Edit2 className="h-3.5 w-3.5" /> Adjust Progress
            </button>

            {onStatusChange && (
              <select
                value={goal.status}
                onChange={(e) => onStatusChange(goal.id, e.target.value as GoalStatus)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="PLANNED">Planned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="AT_RISK">At Risk</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            )}
          </div>
        )}

        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <Calendar className="h-3 w-3 text-slate-400" />
          {goal.targetDate ? `Target: ${goal.targetDate}` : 'No target date'}
        </span>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Goal?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you sure you want to permanently delete "{goal.title}"?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  if (onDeleteGoal) onDeleteGoal(goal.id);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500"
              >
                Delete Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

