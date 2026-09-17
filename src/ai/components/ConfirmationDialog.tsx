// ============================================================================
// AETHER AI — Confirmation Dialog Component
// ============================================================================
// Accessible modal dialog for confirming high-risk and destructive AI tool actions.
// Explicitly presents: WHAT will happen, WHY it is needed, WHICH resource will change.
// ============================================================================

import React, { memo, useEffect, useRef } from 'react';
import type { PendingConfirmation } from '../ai-types';

export interface ConfirmationDialogProps {
  confirmation: PendingConfirmation;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = memo(
  ({ confirmation, onConfirm, onCancel }) => {
    const isDestructive =
      confirmation.riskLevel === 'DESTRUCTIVE' ||
      confirmation.riskLevel === 'HIGH_IMPACT';
    const isHighRisk =
      confirmation.riskLevel === 'HIGH_RISK_WRITE' ||
      confirmation.riskLevel === 'MODIFY';

    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    // Trap focus and handle Escape key
    useEffect(() => {
      cancelButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    // Parse description for WHAT/WHY/WHICH breakdown if present
    const descriptionLines = confirmation.description.split('\n');

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-desc"
      >
        <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl backdrop-blur-2xl sm:p-7">
          {/* Header with Risk Icon */}
          <div className="flex items-start gap-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                isDestructive
                  ? 'border border-rose-500/30 bg-rose-500/20 text-rose-400'
                  : isHighRisk
                    ? 'border border-amber-500/30 bg-amber-500/20 text-amber-400'
                    : 'border border-indigo-500/30 bg-indigo-500/20 text-indigo-400'
              }`}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <div className="min-w-0 flex-1">
              <h3 id="confirmation-dialog-title" className="text-base font-bold text-slate-100">
                {isDestructive
                  ? 'Confirm Destructive Action'
                  : isHighRisk
                    ? 'Confirm State Modification'
                    : 'Confirm Tool Execution'}
              </h3>
              <div className="mt-0.5 flex items-center gap-2">
                <span
                  className={`inline-block font-mono text-xs font-semibold ${
                    isDestructive ? 'text-rose-400' : isHighRisk ? 'text-amber-400' : 'text-indigo-400'
                  }`}
                >
                  {confirmation.toolName}
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 border border-slate-700">
                  {confirmation.riskLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Description / Explanation */}
          <div id="confirmation-dialog-desc" className="mt-4 space-y-2 text-sm text-slate-300">
            {descriptionLines.map((line, idx) => (
              <p key={idx} className="leading-relaxed">
                {line}
              </p>
            ))}
          </div>

          {/* Reversibility Warning */}
          <div
            className={`mt-4 rounded-xl border p-3 text-xs ${
              isDestructive
                ? 'border-rose-500/30 bg-rose-950/30 text-rose-300'
                : 'border-slate-800 bg-slate-950/40 text-slate-400'
            }`}
          >
            <span className="font-semibold">Reversibility: </span>
            {isDestructive
              ? 'This operation is permanent and cannot be undone.'
              : 'This operation modifies workspace state and will create an audit entry.'}
          </div>

          {/* Parameters View */}
          {confirmation.args && Object.keys(confirmation.args).length > 0 && (
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 font-mono text-xs text-slate-400">
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                Action Parameters:
              </span>
              <pre className="max-h-32 overflow-x-auto overflow-y-auto text-[11px] leading-relaxed text-slate-300">
                {JSON.stringify(confirmation.args, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition-all active:scale-95 ${
                isDestructive
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 shadow-rose-900/30 hover:from-rose-500 hover:to-red-500 focus-visible:ring-2 focus-visible:ring-rose-400'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-900/30 hover:from-indigo-500 hover:to-purple-500 focus-visible:ring-2 focus-visible:ring-indigo-400'
              }`}
            >
              Authorize & Proceed
            </button>
          </div>
        </div>
      </div>
    );
  },
);

ConfirmationDialog.displayName = 'ConfirmationDialog';
