// frontend/src/settings/billing/BillingPage.tsx
import React, { useEffect, useState } from 'react';
import { BillingPlaceholder } from './BillingPlaceholder';
import { billingService, SubscriptionTier } from './billingService';

export const BillingPage: React.FC = () => {
  const [tier, setTier] = useState<SubscriptionTier | null>(null);

  useEffect(() => {
    billingService.getCurrentSubscription().then((data) => { setTier(data); });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Billing & Entitlements</h2>
        <p className="text-sm text-slate-400 mt-1">Review active system processing tiers and corporate subscription parameters.</p>
      </div>
      <hr className="border-slate-800" />
      {tier ? <BillingPlaceholder tier={tier} /> : <div className="text-xs text-slate-500 animate-pulse">Resolving parameters...</div>}
    </div>
  );
};