import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface AnalyticsPageProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export const AnalyticsReportPage: React.FC<AnalyticsPageProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="border-b border-[#192032] pb-5">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white">
          {icon}
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-[#192032] bg-[#0D121F] p-5">
          <div className="text-xs font-medium text-slate-400">Metric Score</div>
          <div className="flex items-baseline gap-2 text-2xl font-bold text-white">
            92.8%
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" /> +5.4%
            </span>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-[#192032] bg-[#0D121F] p-5">
          <div className="text-xs font-medium text-slate-400">Efficiency Index</div>
          <div className="flex items-baseline gap-2 text-2xl font-bold text-white">
            4.8 / 5.0
            <span className="text-xs font-semibold text-purple-400">Optimal</span>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-[#192032] bg-[#0D121F] p-5">
          <div className="text-xs font-medium text-slate-400">Weekly Growth</div>
          <div className="flex items-baseline gap-2 text-2xl font-bold text-white">
            +14%
            <span className="text-xs font-semibold text-indigo-400">vs last week</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-[#192032] bg-[#0D121F] p-6">
        <h3 className="text-lg font-semibold text-white">Performance Overview Chart</h3>
        <div className="flex h-48 items-center justify-center rounded-xl border border-[#1E2638] bg-[#131A2B] text-sm text-slate-400">
          [ Interactive Visual Analytics Chart Container ]
        </div>
      </div>
    </div>
  );
};
