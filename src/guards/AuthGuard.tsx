import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/authcontext';

export interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback = (
    <div aria-busy="true" aria-label="Loading authentication">
      Loading authentication...
    </div>
  ),
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return (
      <div role="alert" aria-live="polite">
        <p>Access Denied. Please sign in to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};
