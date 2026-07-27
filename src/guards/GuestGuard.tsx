import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../app/providers/authprovider';

export interface GuestGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({
  children,
  fallback = (
    <div
      className="bg-background text-foreground flex min-h-screen items-center justify-center"
      aria-busy="true"
      aria-label="Verifying access"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        <span className="text-sm font-medium tracking-wide opacity-75">Verifying session...</span>
      </div>
    </div>
  ),
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};
