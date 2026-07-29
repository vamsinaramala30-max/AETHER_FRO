import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useauth';

export interface ProtectedGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedGuard: React.FC<ProtectedGuardProps> = ({
  children,
  fallback = (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        <span className="text-sm font-medium tracking-wide opacity-75">Restoring session...</span>
      </div>
    </div>
  ),
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
