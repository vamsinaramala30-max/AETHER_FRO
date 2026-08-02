import React, { useEffect, useState } from 'react';
import { BillingPlaceholder } from './billingplaceholders';
import { billingService, SubscriptionTier } from './billingservice';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CreditCard } from 'lucide-react';

export const BillingPage: React.FC = () => {
  const [tier, setTier] = useState<SubscriptionTier | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await billingService.getCurrentSubscription();
      setTier(data);
    })();
  }, []);

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Billing & Plan
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Review active workspace subscription tier, payment methods, and renewal dates.
            </p>
          </div>
        </div>

        {tier ? (
          <BillingPlaceholder tier={tier} />
        ) : (
          <div className="animate-pulse text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Resolving subscription plan...
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
