import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { publicRoutes } from './publicroutes';
import { protectedRoutes } from './protectedroutes';
import { useAuth } from '@/app/providers/authprovider';
import { useSessionTracker } from '@/your-aether/useLastSession';

export const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  useSessionTracker();

  const routingElement = useRoutes([
    ...publicRoutes,
    ...protectedRoutes,
    {
      path: '*',
      element: isLoading ? null : isAuthenticated ? (
        <Navigate to="/welcome" replace />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
  ]);

  return <>{routingElement}</>;
};

