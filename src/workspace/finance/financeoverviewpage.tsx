import React from 'react';
import { DollarSign, ArrowDownRight } from 'lucide-react';

export const FinanceOverviewPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="border-b border-[#192032] pb-5">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white">
          <DollarSign className="h-6 w-6 text-emerald-400" />
          Finance & Expense Overview
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Monitor subscription budgets, API usage costs, and cloud service billing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-[#192032] bg-[#0D121F] p-5">
          <div className="text-xs font-medium text-slate-400">Monthly Cloud Spend</div>
          <div className="flex items-baseline gap-2 text-2xl font-bold text-white">
            $1,240.50
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <ArrowDownRight className="h-3.5 w-3.5" /> -4.2%
            </span>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-[#192032] bg-[#0D121F] p-5">
          <div className="text-xs font-medium text-slate-400">AI API Credits Remaining</div>
          <div className="flex items-baseline gap-2 text-2xl font-bold text-white">
            $450.00
            <span className="text-xs font-semibold text-purple-400">Pro Plan</span>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-[#192032] bg-[#0D121F] p-5">
          <div className="text-xs font-medium text-slate-400">Active Subscriptions</div>
          <div className="flex items-baseline gap-2 text-2xl font-bold text-white">
            8 Tools
            <span className="text-xs font-semibold text-slate-400">$320/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
