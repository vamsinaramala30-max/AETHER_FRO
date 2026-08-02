import React from 'react';
import { SubscriptionTier } from './billingservice';
import { ShieldCheck, Calendar, CreditCard } from 'lucide-react';

interface BillingPlaceholderProps {
  tier: SubscriptionTier;
}

export const BillingPlaceholder: React.FC<BillingPlaceholderProps> = ({ tier }) => {
  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Current Active Plan
          </span>
          <h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{tier.name}</h3>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Operational
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <CreditCard className="h-3.5 w-3.5 text-indigo-500" /> Plan Pricing
          </span>
          <span className="mt-1 block text-lg font-bold text-slate-900 dark:text-white">
            {tier.cost}
          </span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5 text-indigo-500" /> Next Renewal Date
          </span>
          <span className="mt-1 block text-lg font-bold text-slate-900 dark:text-white">
            {tier.renewalDate}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium leading-relaxed text-slate-600 dark:border-slate-800/80 dark:bg-slate-800/50 dark:text-slate-400">
        Payment invoicing and plan upgrades are managed directly by organization supervisors.
        Contact workspace administration to scale team seats or modify billing methods.
      </div>
    </div>
  );
};
