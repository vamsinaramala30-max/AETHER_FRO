import React from 'react';
import { Sun, Calendar, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';

export const DailyOverviewPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#192032] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Sun className="w-6 h-6 text-amber-400" />
          Daily Overview
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Your daily executive brief, key metric highlights, and top action items.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0D121F] border border-[#192032] rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Tasks Completed</div>
            <div className="text-lg font-bold text-white">12 / 16</div>
          </div>
        </div>
        <div className="bg-[#0D121F] border border-[#192032] rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Focus Hours</div>
            <div className="text-lg font-bold text-white">5.4 hrs</div>
          </div>
        </div>
        <div className="bg-[#0D121F] border border-[#192032] rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Productivity Score</div>
            <div className="text-lg font-bold text-white">94%</div>
          </div>
        </div>
        <div className="bg-[#0D121F] border border-[#192032] rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Meetings Today</div>
            <div className="text-lg font-bold text-white">3 Scheduled</div>
          </div>
        </div>
      </div>

      <div className="bg-[#0D121F] border border-[#192032] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Today's Key Priorities</h2>
        <div className="space-y-3">
          {[
            { title: 'Finalize AETHER API Integration Docs', time: '10:00 AM', status: 'Done' },
            { title: 'Review Sprint Deliverables with Team', time: '02:00 PM', status: 'Upcoming' },
            { title: 'Optimize Database Query Indexes', time: '04:30 PM', status: 'Pending' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 bg-[#121827] border border-[#1E2638] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">{item.time}</span>
                <span className="text-sm font-medium text-slate-200">{item.title}</span>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
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
