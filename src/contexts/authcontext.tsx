import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
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

  const refreshSession = useCallback(() => {
    setStatus('loading');
    try {
      const token = localStorage.getItem('aether_token');
      if (typeof token === 'string' && token.trim() !== '') {
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
    return Promise.resolve();
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(
    (credentials: Record<string, unknown>) => {
      setStatus('loading');
      void (async () => {
        try {
          const token =
            typeof credentials.token === 'string' ? credentials.token : 'mock_jwt_token';
          localStorage.setItem('aether_token', token);
          await refreshSession();
        } catch (err) {
          setStatus('unauthenticated');
          throw err;
        }
      })();
      return Promise.resolve();
    },
    [refreshSession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('aether_token');
    setUser(null);
    setStatus('unauthenticated');
    return Promise.resolve();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated' && user !== null,
      isLoading: status === 'loading',
      login,
      logout,
      refreshSession,
    }),
    [user, status, login, logout, refreshSession],
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
