import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/authcontext';

export interface GuestGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({
  children,
  fallback = <div aria-busy="true" aria-label="Verifying access">Verifying access...</div>,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (isAuthenticated) {
    return (
      <div role="status">
        <p>You are already authenticated. Redirecting to workspace...</p>
      </div>
    );
  }

  return <>{children}</>;
};