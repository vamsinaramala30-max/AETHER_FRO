import React from 'react';
import { ShieldCheck, Cpu, Database, Activity } from 'lucide-react';

interface Props {
  healthStatus?: 'Optimal' | 'Degraded' | 'Attention Required';
  successRate?: number;
}

export const AutomationHealth: React.FC<Props> = ({
  healthStatus = 'Optimal',
  successRate = 98.4,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 text-white shadow-xl dark:border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Automation Engine Health</h3>
            <p className="text-xs text-slate-400">Real-time AI backend operational status</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          {healthStatus}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Cpu className="h-4 w-4 text-sky-400" />
            AI Execution Engine
          </div>
          <p className="mt-2 text-xl font-bold text-white">Active (Local/API)</p>
          <p className="mt-0.5 text-xs text-slate-400">Zero cloud latency</p>
        </div>

        <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Activity className="h-4 w-4 text-emerald-400" />
            Execution Reliability
          </div>
          <p className="mt-2 text-xl font-bold text-white">{successRate}%</p>
          <p className="mt-0.5 text-xs text-slate-400">Passed standard assertions</p>
        </div>

        <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Database className="h-4 w-4 text-amber-400" />
            Workspace Context Sync
          </div>
          <p className="mt-2 text-xl font-bold text-white">Synchronized</p>
          <p className="mt-0.5 text-xs text-slate-400">Tasks, Calendar, Knowledge</p>
        </div>
      </div>
    </div>
  );
};
