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
            <div className="text-lg font-bold text-white">12 / 16</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#192032] bg-[#0D121F] p-4">
          <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Focus Hours</div>
            <div className="text-lg font-bold text-white">5.4 hrs</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#192032] bg-[#0D121F] p-4">
          <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Productivity Score</div>
            <div className="text-lg font-bold text-white">94%</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#192032] bg-[#0D121F] p-4">
          <div className="rounded-lg bg-indigo-500/10 p-2.5 text-indigo-400">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Meetings Today</div>
            <div className="text-lg font-bold text-white">3 Scheduled</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-[#192032] bg-[#0D121F] p-6">
        <h2 className="text-lg font-semibold text-white">Today's Key Priorities</h2>
        <div className="space-y-3">
          {[
            { title: 'Finalize AETHER API Integration Docs', time: '10:00 AM', status: 'Done' },
            { title: 'Review Sprint Deliverables with Team', time: '02:00 PM', status: 'Upcoming' },
            { title: 'Optimize Database Query Indexes', time: '04:30 PM', status: 'Pending' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border border-[#1E2638] bg-[#121827] p-3.5"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-400">{item.time}</span>
                <span className="text-sm font-medium text-slate-200">{item.title}</span>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  item.status === 'Done'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : item.status === 'Upcoming'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
