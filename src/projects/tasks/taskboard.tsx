import React from 'react';
import { Task } from './taskservice';
import { TaskCard } from './taskcard';

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (id: string, nextStatus: Task['status']) => void;
}

const COLUMNS: { id: Task['status']; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Execution' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onStatusChange }) => {
  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div
            key={col.id}
            className="flex min-h-[450px] flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                {col.title}
              </h3>
              <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex max-h-[calc(100vh-320px)] flex-col gap-3 overflow-y-auto p-0.5">
              {columnTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs font-medium italic text-slate-400 dark:border-slate-800 dark:text-slate-500">
                  No active tasks
                </div>
              ) : (
                columnTasks.map((t) => (
                  <TaskCard key={t.id} task={t} onStatusChange={onStatusChange} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
