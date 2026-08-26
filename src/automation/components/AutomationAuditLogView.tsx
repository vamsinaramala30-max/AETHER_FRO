import React, { useEffect, useState } from 'react';
import { History, Undo2, CheckCircle2, AlertCircle, Clock, ShieldCheck, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ruleEngine } from '../engine/RuleEngine';
import { Patch, PatchStatus } from '../engine/types';

export const AutomationAuditLogView: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<Patch[]>(ruleEngine.getState().auditLogs);
  const [filterStatus, setFilterStatus] = useState<PatchStatus | 'ALL'>('ALL');

  useEffect(() => {
    return ruleEngine.subscribe((state) => {
      setAuditLogs(state.auditLogs);
    });
  }, []);

  const handleUndo = (patchId: string) => {
    ruleEngine.undoPatch(patchId);
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (filterStatus === 'ALL') return true;
    return log.status === filterStatus;
  });

  const getStatusBadge = (status: PatchStatus) => {
    switch (status) {
      case 'applied':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Applied
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Clock className="h-3 w-3 animate-spin" /> Pending Proposal
          </span>
        );
      case 'undone':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 line-through">
            <Undo2 className="h-3 w-3" /> Undone
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <AlertCircle className="h-3 w-3" /> Rejected
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <History className="h-5 w-5 text-amber-500" />
            Automation Audit Log & Patch Rollback
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Transparent log of every state patch produced by the Rule Engine with one-click reversible state undo.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-800/80">
          {(['ALL', 'applied', 'pending', 'undone'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-md px-2.5 py-1 text-xs font-bold capitalize transition-colors ${
                filterStatus === st
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
            <ShieldCheck className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">No automation patches in this view yet.</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-600">Advance the Simulated Clock or complete tasks to observe engine events.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition-all dark:border-slate-800 dark:bg-slate-900/60 gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-slate-900 dark:text-white">{log.description}</span>
                  {getStatusBadge(log.status)}
                  <span className="rounded bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {log.type}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">{log.reason}</p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Rule: <strong className="text-slate-600 dark:text-slate-300">{log.ruleName}</strong></span>
                  <span>•</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              {log.status === 'applied' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUndo(log.id)}
                  className="h-8 border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40 shrink-0 font-bold"
                >
                  <Undo2 className="mr-1.5 h-3.5 w-3.5" /> Undo Patch
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
