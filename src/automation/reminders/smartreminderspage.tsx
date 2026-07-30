import React from 'react';
import { Bell, CheckCircle2, Clock, Plus, Trash2 } from 'lucide-react';

export const SmartRemindersPage: React.FC = () => {
  const reminders = [
    { title: 'Follow up on GitHub PR #142 code review', due: 'In 30 minutes', tag: 'High Priority' },
    { title: 'Submit weekly team summary report', due: 'Today at 5:00 PM', tag: 'Routine' },
    { title: 'Review AWS billing threshold alerts', due: 'Tomorrow at 10:00 AM', tag: 'DevOps' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#192032] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-indigo-400" />
            Smart Reminders
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Contextual AI reminders and deadline notifications across projects.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-95 transition-all shadow-lg shadow-indigo-900/30"
        >
          <Plus className="w-4 h-4" />
          Add Reminder
        </button>
      </div>

      <div className="space-y-3">
        {reminders.map((rem, idx) => (
          <div
            key={idx}
            className="bg-[#0D121F] border border-[#192032] rounded-xl p-4 flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{rem.title}</h3>
                <span className="text-xs text-slate-400">{rem.due}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-2.5 py-1 rounded-md bg-[#161C2E] border border-[#242E47] text-slate-300 font-medium">
                {rem.tag}
              </span>
              <button type="button" className="text-slate-500 hover:text-rose-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
