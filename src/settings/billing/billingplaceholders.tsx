// frontend/src/settings/billing/BillingPlaceholder.tsx
import React from 'react';
import { SubscriptionTier } from './billingservice';

interface BillingPlaceholderProps {
  tier: SubscriptionTier;
}

export const BillingPlaceholder: React.FC<BillingPlaceholderProps> = ({ tier }) => {
  return (
    <div className="max-w-2xl space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Active Tier
          </span>
          <h3 className="mt-0.5 text-lg font-bold text-white">{tier.name}</h3>
        </div>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
          Status: Operational
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-2 text-sm">
        <div>
          <span className="block text-xs text-slate-400">Allocation Pricing Metrics</span>
          <span className="mt-0.5 block font-medium text-white">{tier.cost}</span>
        </div>
        <div>
          <span className="block text-xs text-slate-400">Next Renewal Cycle Milestone</span>
          <span className="mt-0.5 block font-medium text-white">{tier.renewalDate}</span>
        </div>
      </div>

      <div className="mt-4 rounded border border-slate-800/80 bg-slate-950/50 p-3 text-xs leading-relaxed text-slate-400">
        Transactional processing features, payment ledger updates, and automated invoicing profiles
        are managed directly by corporate system supervisors. Please reach out to administrative
        channels for account tier scaling.
      </div>
    </div>
  );
};
