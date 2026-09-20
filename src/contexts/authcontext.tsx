import React, { useMemo, ReactNode } from 'react';
import { RoleType, Role } from '../permissions/roles';
import { PermissionType, Permission } from '../permissions/permissions';
import { useAuth as useAppAuth } from '../app/providers/authprovider';
import { authService, AuthUser as ServiceUser } from '../auth/authservice';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  permissions: PermissionType[];
  isSubscribed: boolean;
  avatarUrl?: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

function mapToContextUser(user: ServiceUser | null): AuthUser | null {
  if (!user) return null;

  const roleStr = (user.role || 'USER').toLowerCase();
  let role: RoleType = Role.USER;
  if (roleStr === 'admin' || roleStr === 'superadmin') {
    role = Role.ADMIN;
  } else if (roleStr === 'premium') {
    role = Role.PREMIUM;
  }

  const defaultUserPermissions: PermissionType[] = [
    Permission.PROJECTS_READ,
    Permission.PROJECTS_CREATE,
    Permission.PROJECTS_UPDATE,
    Permission.KNOWLEDGE_READ,
    Permission.AI_EXECUTE,
    Permission.WORKSPACE_READ,
  ];

  const adminPermissions: PermissionType[] = [
    ...defaultUserPermissions,
    Permission.PROJECTS_DELETE,
    Permission.PROJECTS_EXPORT,
    Permission.KNOWLEDGE_UPLOAD,
    Permission.KNOWLEDGE_MANAGE,
    Permission.AI_CONFIGURE,
    Permission.AUTOMATION_CREATE,
    Permission.AUTOMATION_EXECUTE,
    Permission.AUTOMATION_MANAGE,
    Permission.WORKSPACE_MANAGE,
    Permission.SETTINGS_UPDATE,
    Permission.USERS_MANAGE,
    Permission.BILLING_MANAGE,
    Permission.SYSTEM_CONFIGURE,
  ];

  const permissions: PermissionType[] =
    role === Role.ADMIN
      ? adminPermissions
      : (user.permissions as PermissionType[]) || defaultUserPermissions;

  return {
    id: user.id,
    email: user.email,
    name: user.name || user.fullName || user.email.split('@')[0],
    role,
    permissions,
    isSubscribed: Boolean(user.isSubscribed || role === Role.PREMIUM || role === Role.ADMIN),
    avatarUrl: user.avatarUrl || undefined,
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useAuth = (): AuthContextValue => {
  const appAuth = useAppAuth();

  const user = useMemo(() => mapToContextUser(appAuth.user), [appAuth.user]);

  const login = async (credentials: Record<string, unknown>) => {
    const email = String(credentials.email || '');
    const password = String(credentials.password || '');
    const result = await authService.signIn(email, password);
    if (result.error) {
      throw result.error;
    }
  };

  const status: AuthStatus = appAuth.isLoading
    ? 'loading'
    : appAuth.isAuthenticated
      ? 'authenticated'
      : 'unauthenticated';

  return {
    user,
    status,
    isAuthenticated: appAuth.isAuthenticated,
    isLoading: appAuth.isLoading,
    login,
    logout: appAuth.logout,
    refreshSession: appAuth.refreshSession,
  };
};
