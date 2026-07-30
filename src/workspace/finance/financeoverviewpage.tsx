import React from 'react';
import { DollarSign, CreditCard, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const FinanceOverviewPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#192032] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <DollarSign className="w-6 h-6 text-emerald-400" />
          Finance & Expense Overview
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor subscription budgets, API usage costs, and cloud service billing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0D121F] border border-[#192032] rounded-2xl p-5 space-y-2">
          <div className="text-xs text-slate-400 font-medium">Monthly Cloud Spend</div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            $1,240.50
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" /> -4.2%
            </span>
          </div>
        </div>

        <div className="bg-[#0D121F] border border-[#192032] rounded-2xl p-5 space-y-2">
          <div className="text-xs text-slate-400 font-medium">AI API Credits Remaining</div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            $450.00
            <span className="text-xs font-semibold text-purple-400">Pro Plan</span>
          </div>
        </div>

        <div className="bg-[#0D121F] border border-[#192032] rounded-2xl p-5 space-y-2">
          <div className="text-xs text-slate-400 font-medium">Active Subscriptions</div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            8 Tools
            <span className="text-xs font-semibold text-slate-400">$320/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
