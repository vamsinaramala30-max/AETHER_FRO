import React from 'react';
import { BarChart3, TrendingUp, Target, Clock, Bot, ArrowUpRight } from 'lucide-react';

interface AnalyticsPageProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export const AnalyticsReportPage: React.FC<AnalyticsPageProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#192032] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          {icon}
          {title}
        </h1>
        <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0D121F] border border-[#192032] rounded-2xl p-5 space-y-2">
          <div className="text-xs text-slate-400 font-medium">Metric Score</div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            92.8%
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +5.4%
            </span>
          </div>
        </div>

        <div className="bg-[#0D121F] border border-[#192032] rounded-2xl p-5 space-y-2">
          <div className="text-xs text-slate-400 font-medium">Efficiency Index</div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            4.8 / 5.0
            <span className="text-xs font-semibold text-purple-400">Optimal</span>
          </div>
        </div>

        <div className="bg-[#0D121F] border border-[#192032] rounded-2xl p-5 space-y-2">
          <div className="text-xs text-slate-400 font-medium">Weekly Growth</div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            +14%
            <span className="text-xs font-semibold text-indigo-400">vs last week</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0D121F] border border-[#192032] rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Performance Overview Chart</h3>
        <div className="h-48 bg-[#131A2B] rounded-xl flex items-center justify-center border border-[#1E2638] text-slate-400 text-sm">
          [ Interactive Visual Analytics Chart Container ]
        </div>
      </div>
    </div>
  );
};
