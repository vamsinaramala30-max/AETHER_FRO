import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../../auth/authservice';

export interface UserSession {
  id: string;
  email?: string;
  created_at: string;
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
    const initializeAuth = async () => {
      try {
        const { session, error } = await authService.getCurrentSession();
        if (error) throw error;
        if (session?.access_token) {
          setUser({
            id: 'authenticated',
            email: 'user@aether.app',
            created_at: new Date().toISOString(),
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

    initializeAuth();
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const { session, error } = await authService.getCurrentSession();
      if (error) throw error;
      if (session?.access_token) {
        setUser({
          id: 'authenticated',
          email: 'user@aether.app',
          created_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
    }
  }, []);

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
