import React from 'react';
import { Sun, Calendar, CheckCircle2, Clock, Zap } from 'lucide-react';

export const DailyOverviewPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="border-b border-[#192032] pb-5">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white">
          <Sun className="h-6 w-6 text-amber-400" />
          Daily Overview
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Your daily executive brief, key metric highlights, and top action items.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-[#192032] bg-[#0D121F] p-4">
          <div className="rounded-lg bg-purple-500/10 p-2.5 text-purple-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Tasks Completed</div>
            <div className="text-lg font-bold text-white">0</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#192032] bg-[#0D121F] p-4">
          <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Focus Hours</div>
            <div className="text-lg font-bold text-white">0.0 hrs</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#192032] bg-[#0D121F] p-4">
          <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Productivity Score</div>
            <div className="text-lg font-bold text-white">0%</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#192032] bg-[#0D121F] p-4">
          <div className="rounded-lg bg-indigo-500/10 p-2.5 text-indigo-400">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Meetings Today</div>
            <div className="text-lg font-bold text-white">0 Scheduled</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-[#192032] bg-[#0D121F] p-6">
        <h2 className="text-lg font-semibold text-white">Today's Key Priorities</h2>
        <div className="space-y-2 py-8 text-center">
          <p className="text-sm font-semibold text-slate-300">No priority tasks set for today</p>
          <p className="text-xs text-slate-400">
            Create or assign priority tasks to view them on your daily overview.
          </p>
        </div>
      </div>
    </div>
  );
};
