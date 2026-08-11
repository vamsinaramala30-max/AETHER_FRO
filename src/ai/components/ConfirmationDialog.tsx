// ============================================================================
// AETHER AI — Confirmation Dialog Component
// ============================================================================
// Modal dialog for confirming high-risk and destructive AI tool actions.
// ============================================================================

import React, { memo } from 'react';
import type { PendingConfirmation } from '../ai-types';

export interface ConfirmationDialogProps {
  confirmation: PendingConfirmation;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = memo(({
  confirmation,
  onConfirm,
  onCancel,
}) => {
  const isDestructive = confirmation.riskLevel === 'DESTRUCTIVE';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-dialog-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isDestructive
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isDestructive ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
          </div>
          <div>
            <h3
              id="confirmation-dialog-title"
              className="text-base font-semibold text-slate-100"
            >
              {isDestructive ? 'Action Requires Confirmation' : 'Confirm Operation'}
            </h3>
            <span
              className={`inline-block text-xs font-mono font-medium ${
                isDestructive ? 'text-rose-400' : 'text-amber-400'
              }`}
            >
              Tool: {confirmation.toolName} ({confirmation.riskLevel})
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-300 leading-relaxed">
          {confirmation.description}
        </p>

        {Object.keys(confirmation.args).length > 0 && (
          <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs font-mono text-slate-400">
            <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-1">
              Parameters:
            </span>
            <pre className="overflow-x-auto text-[11px]">
              {JSON.stringify(confirmation.args, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Cancel Action
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-xs font-medium text-white transition-all shadow-lg ${
              isDestructive
                ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-900/30'
                : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-amber-900/30'
            }`}
          >
            Authorize Execution
          </button>
        </div>
      </div>
    </div>
  );
});

ConfirmationDialog.displayName = 'ConfirmationDialog';
