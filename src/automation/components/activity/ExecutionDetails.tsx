import React from 'react';
import { ExecutionLog } from '../../automation-types';
import { AutomationDialog } from '../shared/AutomationDialog';
import { ExecutionTimeline } from './ExecutionTimeline';
import { ExecutionStatusBadge } from './ExecutionStatus';
import { AlertTriangle } from 'lucide-react';

interface Props {
  log: ExecutionLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutionDetails: React.FC<Props> = ({ log, isOpen, onClose }) => {
  if (!log) return null;

  return (
    <AutomationDialog
      isOpen={isOpen}
      onClose={onClose}
      title={log.automationName}
      description={`Execution ID: ${log.id}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <div>
            <p className="text-xs text-slate-500">Triggered By</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{log.trigger}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Duration</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{log.duration || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Status</p>
            <ExecutionStatusBadge status={log.status} />
          </div>
        </div>

        {log.userFriendlyError && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Attention Required</p>
              <p className="mt-0.5">{log.userFriendlyError}</p>
            </div>
          </div>
        )}

        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Execution Flow Timeline
          </h4>
          <ExecutionTimeline stepLogs={log.stepLogs} />
        </div>
      </div>
    </AutomationDialog>
  );
};
