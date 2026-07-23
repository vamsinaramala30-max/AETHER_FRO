import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Structural integration boundary for Supabase / Auth listener
    // Remains strictly true to initial loading state until hooked up in future sprints
    const initializeAuth = async () => {
      try {
        setUser(null);
      } catch (error) {
        console.error('Auth initialization sequence failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async (): Promise<void> => {
    // Prepared anchor for active token refreshes
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