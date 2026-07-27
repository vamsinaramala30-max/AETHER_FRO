// frontend/src/settings/billing/BillingPage.tsx
import React, { useEffect, useState } from 'react';
import { BillingPlaceholder } from './billingplaceholders';
import { billingService, SubscriptionTier } from './billingService';

export const BillingPage: React.FC = () => {
  const [tier, setTier] = useState<SubscriptionTier | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await billingService.getCurrentSubscription();
      setTier(data);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">Billing & Entitlements</h2>
        <p className="mt-1 text-sm text-slate-400">
          Review active system processing tiers and corporate subscription parameters.
        </p>
      </div>
      <hr className="border-slate-800" />
      {tier ? (
        <BillingPlaceholder tier={tier} />
      ) : (
        <div className="animate-pulse text-xs text-slate-500">Resolving parameters...</div>
      )}
    </div>
  );
};
