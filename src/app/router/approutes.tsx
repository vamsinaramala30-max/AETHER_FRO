import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { publicRoutes } from './publicroutes';
import { protectedRoutes } from './protectedroutes';
import { useAuth } from '@/app/providers/authprovider';

export const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const routingElement = useRoutes([
    ...publicRoutes,
    ...protectedRoutes,
    {
      path: '*',
      element: isLoading ? null : isAuthenticated ? (
        <Navigate to="/app" replace />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
  ]);

  return <>{routingElement}</>;
};
