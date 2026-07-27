import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { publicRoutes } from './publicroutes';
import { protectedRoutes } from './protectedroutes';

export const AppRouter: React.FC = () => {
  const routingElement = useRoutes([
    ...publicRoutes,
    ...protectedRoutes,
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return <>{routingElement}</>;
};
