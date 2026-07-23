import React, { createContext, useContext, useMemo, useState, useEffect, useCallback, ReactNode } from 'react';
import { RoleType, Role } from '../permissions/roles';
import { PermissionType } from '../permissions/permissions';

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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const refreshSession = useCallback(async () => {
    setStatus('loading');
    try {
      // Integration hook to underlying API / AuthService session check
      const token = localStorage.getItem('aether_token');
      if (token) {
        // Mock session revalidation
        setUser({
          id: 'usr_01',
          email: 'operator@aether.ai',
          name: 'Aether Operator',
          role: Role.USER,
          permissions: ['projects:read', 'knowledge:read', 'ai_models:execute'],
          isSubscribed: false,
        });
        setStatus('authenticated');
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }
    } catch {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (_credentials: Record<string, unknown>) => {
    setStatus('loading');
    try {
      localStorage.setItem('aether_token', 'mock_jwt_token');
      await refreshSession();
    } catch (err) {
      setStatus('unauthenticated');
      throw err;
    }
  }, [refreshSession]);

  const logout = useCallback(async () => {
    localStorage.removeItem('aether_token');
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated' && !!user,
      isLoading: status === 'loading',
      login,
      logout,
      refreshSession,
    }),
    [user, status, login, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};