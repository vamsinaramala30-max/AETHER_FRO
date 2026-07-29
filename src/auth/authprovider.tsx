import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { authService, AuthUser, AuthSession } from '../../auth/authService';

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
  const isInitializingRef = useRef<boolean>(false);

  // Helper to prevent setting state if user object hasn't structurally changed
  const updateStateIfChanged = useCallback((newUser: AuthUser | null) => {
    setUser((prevUser) => {
      if (!prevUser && !newUser) return null;
      if (prevUser && newUser && prevUser.id === newUser.id && prevUser.email === newUser.email) {
        return prevUser; // Retain current object reference to avoid re-renders
      }
      return newUser;
    });
  }, []);

  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const { session, error } = await authService.getCurrentSession();
      if (error || !session) {
        updateStateIfChanged(null);
      } else {
        updateStateIfChanged(session.user);
      }
    } catch (error) {
      console.error('[AuthProvider] Session refresh error:', error);
      updateStateIfChanged(null);
    }
  }, [updateStateIfChanged]);

  useEffect(() => {
    // Guard against double execution in React StrictMode
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    const initializeAuth = async () => {
      try {
        const { session } = await authService.getCurrentSession();
        if (session?.user) {
          updateStateIfChanged(session.user);
        } else {
          updateStateIfChanged(null);
        }
      } catch (error) {
        console.error('[AuthProvider] Initial session fetch failed:', error);
        updateStateIfChanged(null);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();

    // Subscribe to live auth changes from authService
    const subscription = authService.subscribeToAuthChanges(
      (_event: string, session: AuthSession | null) => {
        if (session?.user) {
          updateStateIfChanged(session.user);
        } else {
          updateStateIfChanged(null);
        }
        setIsLoading(false);
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [updateStateIfChanged]);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.signOut();
      updateStateIfChanged(null);
    } catch (error) {
      console.error('[AuthProvider] Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updateStateIfChanged]);

  const value = useMemo(
    () => ({
      isAuthenticated: user !== null,
      isLoading,
      user,
      logout,
      refreshSession,
    }),
    [isLoading, user, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
