import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/authcontext';
import { isPremiumUser } from '../permissions/access';

export interface PremiumGuardProps {
  children: ReactNode;
  upgradePrompt?: ReactNode;
}

export const PremiumGuard: React.FC<PremiumGuardProps> = ({ children, upgradePrompt }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div aria-busy="true">Checking subscription tier...</div>;
  }

  const isEligible =
    isAuthenticated && user
      ? isPremiumUser({
          role: user.role,
          permissions: user.permissions,
          isSubscribed: user.isSubscribed,
        })
      : false;

  if (!isEligible) {
    return (
      upgradePrompt ?? (
        <div role="region" aria-label="Premium Feature Gate">
          <h3>Premium Subscription Required</h3>
          <p>Upgrade your account to unlock advanced AI models and automated workflows.</p>
        </div>
      )
    );
  }

  return <>{children}</>;
};
