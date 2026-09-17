import React, { useState } from 'react';
import { Task } from './taskservice';
import { Clock, Trash2, AlertTriangle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, nextStatus: Task['status']) => void;
  onDeleteTask?: (id: string) => void;
}

const PRIORITY_BADGES: Record<string, string> = {
  urgent:
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
  high: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
  medium:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onDeleteTask }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Task['status'];
    if (val === 'todo' || val === 'in_progress' || val === 'review' || val === 'done') {
      onStatusChange(task.id, val);
    }
  };

  const hasDueDate = typeof task.dueDate === 'string' && task.dueDate.trim() !== '';

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold leading-snug text-slate-900 dark:text-white">
          {task.title}
        </h4>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium
            }`}
          >
            {task.priority}
          </span>
          {onDeleteTask && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
              title="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {task.description}
        </p>
      )}

      {Array.isArray(task.tags) && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800/80 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <Clock className="h-3 w-3" />
          {hasDueDate ? task.dueDate : 'No due date'}
        </span>
        <div className="flex items-center gap-1">
          <span className="hidden text-[10px] font-medium text-slate-400 sm:inline">Status:</span>
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="todo">TODO</option>
            <option value="in_progress">IN EXECUTION</option>
            <option value="review">REVIEW</option>
            <option value="done">DONE</option>
          </select>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Task?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you sure you want to permanently delete this task?
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
                  if (onDeleteTask) onDeleteTask(task.id);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
