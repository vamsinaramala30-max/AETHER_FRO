import React from 'react';
import { Task } from './taskservice';
import { Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, nextStatus: Task['status']) => void;
}

const PRIORITY_BADGES = {
  high: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
  medium:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange }) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
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
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium
          }`}
        >
          {task.priority}
        </span>
      </div>

      <p className="line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        {task.description}
      </p>

      {task.tags.length > 0 && (
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
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">In Review</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
};
