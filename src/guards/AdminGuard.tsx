import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/authcontext';
import { isAdminUser } from '../permissions/access';

export interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children, fallback }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return fallback !== undefined && fallback !== null ? (
      <>{fallback}</>
    ) : (
      <div aria-busy="true">Loading security controls...</div>
    );
  }

  const hasAdmin =
    isAuthenticated && user
      ? isAdminUser({ role: user.role, permissions: user.permissions })
      : false;

  if (!hasAdmin) {
    return (
      <div role="alert">
        <h2>Administrator Access Required</h2>
        <p>You do not have administrative permissions to view this system zone.</p>
      </div>
    );
  }

  return <>{children}</>;
};
