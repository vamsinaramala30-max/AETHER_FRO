import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { AppLayout } from '../layouts/applayout';
import { useAuth } from '../providers/authprovider';

// Higher Order Component guarding future submodules
const ProtectedGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-background text-foreground"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium tracking-wide opacity-75">Loading Aether Framework...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const protectedRoutes: RouteObject[] = [
  {
    path: '/app',
    element: (
      <ProtectedGuard>
        <AppLayout />
      </ProtectedGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg bg-card text-center p-6">
            <h2 className="text-xl font-bold tracking-tight mb-2">Core Core Application Shell Mounted</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              AETHER application foundation initialized successfully. Submodules will hook into this protected routing tree structure directly.
            </p>
          </div>
        )
      }
    ]
  }
];