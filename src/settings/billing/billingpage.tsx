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
          <CreditCard className="h-7 w-7 shrink-0 text-emerald-600 dark:text-emerald-400" />
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
