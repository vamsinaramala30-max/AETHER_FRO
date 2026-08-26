import React from 'react';
import { Server, Bell, ShieldCheck, Cpu, Database, Info, ExternalLink } from 'lucide-react';

export const Tier2IntegrationDoc: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
      {/* Notice Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-300">
        <Info className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
        <div>
          <h4 className="font-extrabold text-sm">In-Tab Reminder Escalation Notice</h4>
          <p className="mt-1 leading-relaxed">
            Reminders work while this browser tab is open — full native push notifications, background cron tasks, and cross-device synchronization require the Aether backend server connection.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            AETHER OS Tier-2 Backend Architecture Integration
          </h3>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          How the client-side Rule Engine interfaces with server-side infrastructure for enterprise-grade automation.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Bell className="h-4 w-4 text-amber-500" />
            <span>1. Real-time Web Push & System Toasts</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            In-tab timers dispatch ServiceWorker WebPush payloads when tabs are closed, maintaining T-15m, T-0m, and T+20m escalation pings seamlessly across mobile & desktop devices.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Cpu className="h-4 w-4 text-purple-500" />
            <span>2. Server-side Cron & Micro-Services</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Scheduled jobs trigger Morning, Evening, and Night Briefs at 07:00, 21:00, and 23:00 UTC/Local time server-side, pre-generating summary state patches before user logon.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>3. Non-Mutating Patch Verification</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All rule execution passes through a server validator confirming idempotency, rate limits, and security permissions before applying database patches or triggering external webhooks.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Database className="h-4 w-4 text-blue-500" />
            <span>4. Immutable Audit Trail & Rollback DB</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            State patches and undo payloads are archived in append-only database logs, enabling infinite temporal rollback and compliance auditing across workspace history.
          </p>
        </div>
      </div>
    </div>
  );
};
