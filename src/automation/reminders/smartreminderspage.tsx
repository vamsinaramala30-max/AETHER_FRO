import React from 'react';
import { Bell, Plus, Clock, Trash2 } from 'lucide-react';

export const SmartRemindersPage: React.FC = () => {
  const reminders = [
    {
      title: 'Follow up on GitHub PR #142 code review',
      due: 'In 30 minutes',
      tag: 'High Priority',
    },
    { title: 'Submit weekly team summary report', due: 'Today at 5:00 PM', tag: 'Routine' },
    { title: 'Review AWS billing threshold alerts', due: 'Tomorrow at 10:00 AM', tag: 'DevOps' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-[#192032] pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white">
            <Bell className="h-6 w-6 text-indigo-400" />
            Smart Reminders
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Contextual AI reminders and deadline notifications across projects.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition-all hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          Add Reminder
        </button>
      </div>

      <div className="space-y-3">
        {reminders.map((rem, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-4 rounded-xl border border-[#192032] bg-[#0D121F] p-4 transition-all hover:border-indigo-500/40"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{rem.title}</h3>
                <span className="text-xs text-slate-400">{rem.due}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-[#242E47] bg-[#161C2E] px-2.5 py-1 text-xs font-medium text-slate-300">
                {rem.tag}
              </span>
              <button
                type="button"
                className="text-slate-500 transition-colors hover:text-rose-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
