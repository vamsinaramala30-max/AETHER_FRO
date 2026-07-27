// frontend/src/app/providers/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authservice';

export interface UserSession {
  id: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserSession | null;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initializing existing active token session safely
    const initializeAuth = async () => {
      try {
        const { session, error } = await authService.getCurrentSession();
        if (error) throw error;

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization sequence failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();

    // Wire global active live session event handler boundary
    const subscription = authService.subscribeToAuthChanges(
      (_event: string, session: { user?: { id: string; email?: string } } | null) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async (): Promise<void> => {
    try {
      const { session, error } = await authService.getCurrentSession();
      if (error) throw error;
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
        });
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
    }
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
