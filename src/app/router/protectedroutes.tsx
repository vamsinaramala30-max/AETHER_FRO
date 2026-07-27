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
        className="bg-background text-foreground flex min-h-screen items-center justify-center"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <span className="text-sm font-medium tracking-wide opacity-75">
            Loading Aether Framework...
          </span>
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
          <div className="border-border bg-card flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
            <h2 className="mb-2 text-xl font-bold tracking-tight">
              Core Core Application Shell Mounted
            </h2>
            <p className="text-muted-foreground max-w-md text-sm">
              AETHER application foundation initialized successfully. Submodules will hook into this
              protected routing tree structure directly.
            </p>
          </div>
        ),
      },
    ],
  },
];
