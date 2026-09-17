export interface SubscriptionTier {
  name: string;
  cost: string;
  active: boolean;
  renewalDate?: string;
  activationDate?: string;
}

export function getExactOneYearRenewalDate(startDate: Date = new Date()): string {
  const renewal = new Date(startDate.getTime());
  renewal.setFullYear(renewal.getFullYear() + 1);
  return renewal.toISOString().split('T')[0];
}

export const billingService = {
  getCurrentSubscription(): Promise<SubscriptionTier> {
    const today = new Date();

    return Promise.resolve({
      name: 'AETHER Community Workspace',
      cost: 'Open Source / Self-Hosted',
      active: true,
      activationDate: today.toISOString().split('T')[0],
      renewalDate: 'Perpetual / Active',
    });
  },
};
