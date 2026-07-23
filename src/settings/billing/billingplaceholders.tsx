// frontend/src/settings/billing/BillingPlaceholder.tsx
import React from 'react';
import { SubscriptionTier } from './billingService';

interface BillingPlaceholderProps {
  tier: SubscriptionTier;
}

export const BillingPlaceholder: React.FC<BillingPlaceholderProps> = ({ tier }) => {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg space-y-4 max-w-2xl">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">Active Tier</span>
          <h3 className="text-lg font-bold text-white mt-0.5">{tier.name}</h3>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          Status: Operational
        </span>
      </div>
      
      <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-400 text-xs block">Allocation Pricing Metrics</span>
          <span className="text-white font-medium mt-0.5 block">{tier.cost}</span>
        </div>
        <div>
          <span className="text-slate-400 text-xs block">Next Renewal Cycle Milestone</span>
          <span className="text-white font-medium mt-0.5 block">{tier.renewalDate}</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-950/50 rounded border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
        Transactional processing features, payment ledger updates, and automated invoicing profiles are managed directly by corporate system supervisors. Please reach out to administrative channels for account tier scaling.
      </div>
    </div>
  );
};