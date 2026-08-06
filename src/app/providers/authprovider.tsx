import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService, AuthUser } from '../../auth/authservice';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateUser = useCallback((nextUser: AuthUser | null) => {
    setUser((previousUser) => {
      if (!previousUser && !nextUser) {
        return null;
      }

      if (previousUser && nextUser) {
        const hasSameProfile =
          previousUser.id === nextUser.id &&
          previousUser.email === nextUser.email &&
          previousUser.name === nextUser.name &&
          previousUser.fullName === nextUser.fullName &&
          previousUser.firstName === nextUser.firstName &&
          previousUser.lastName === nextUser.lastName &&
          previousUser.avatarUrl === nextUser.avatarUrl &&
          previousUser.bio === nextUser.bio &&
          previousUser.company === nextUser.company &&
          previousUser.role === nextUser.role;

        if (hasSameProfile) {
          return previousUser;
        }
      }

      return nextUser;
    });
  }, []);

  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const { session, error } = await authService.getCurrentSession();
      if (error || !session) {
        updateUser(null);
      } else {
        updateUser(session.user);
      }
    } catch (error) {
      console.error('[AuthProvider] Session refresh failed:', error);
      updateUser(null);
    }
  }, [updateUser]);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.signOut();
      updateUser(null);
    } catch (error) {
      console.error('[AuthProvider] Logout operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    let isMounted = true;

    const subscription = authService.subscribeToAuthChanges((_, session) => {
      if (!isMounted) return;
      updateUser(session?.user ?? null);
      setIsLoading(false);
    });

    const handleProfileUpdated = () => {
      if (!isMounted) return;
      void refreshSession();
    };

    // Fired by the HTTP client when a 401 occurs AND token refresh fails.
    // This ensures the UI is logged out only when both tokens are invalid.
    const handleAuthExpired = () => {
      if (!isMounted) return;
      void authService.signOut().then(() => {
        if (isMounted) updateUser(null);
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('aether-profile-updated', handleProfileUpdated);
      window.addEventListener('aether-auth-expired', handleAuthExpired);
    }

    const initializeAuth = async () => {
      try {
        const { session } = await authService.initialize();
        if (!isMounted) return;
        updateUser(session?.user ?? null);
      } catch (error) {
        console.error('[AuthProvider] Initial session fetch failed:', error);
        if (isMounted) {
          updateUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('aether-profile-updated', handleProfileUpdated);
        window.removeEventListener('aether-auth-expired', handleAuthExpired);
      }
      subscription.unsubscribe();
    };
  }, [refreshSession, updateUser]);

  const contextValue = useMemo(
    () => ({
      isAuthenticated: user !== null,
      isLoading,
      user,
      logout,
      refreshSession,
    }),
    [isLoading, user, logout, refreshSession],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
