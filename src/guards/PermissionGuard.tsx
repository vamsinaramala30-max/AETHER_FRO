import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/authcontext';
import { PermissionType } from '../permissions/permissions';
import { hasAllPermissions, hasAnyPermission, UserAccessContext } from '../permissions/access';

export interface PermissionGuardProps {
  children: ReactNode;
  permissions: PermissionType[];
  requireAll?: boolean;
  unauthorizedFallback?: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions,
  requireAll = true,
  unauthorizedFallback = (
    <div role="alert">
      <p>Permission Denied: Missing required security credentials.</p>
    </div>
  ),
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div aria-busy="true">Verifying credentials...</div>;
  }

  if (!isAuthenticated || !user) {
    return <>{unauthorizedFallback}</>;
  }

  const accessCtx: UserAccessContext = {
    role: user.role,
    permissions: user.permissions,
    isSubscribed: user.isSubscribed,
  };

  const isAllowed = requireAll
    ? hasAllPermissions(accessCtx, permissions)
    : hasAnyPermission(accessCtx, permissions);

  if (!isAllowed) {
    return <>{unauthorizedFallback}</>;
  }

  return <>{children}</>;
};