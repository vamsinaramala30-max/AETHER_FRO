import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PublicLayout } from '../layouts/publiclayouts';
import { GuestGuard } from '../../guards/GuestGuard';

// Importing verified existing landing components safely via barrel export
import {
  Home,
  About,
  Features,
  AI,
  Privacy,
  Security,
  Terms,
  PrivacyPolicy,
  Login,
  Signup,
  Statuses,
} from '../../public/pages/Index';

import { AuthSuccessPage } from '../../auth/AuthSuccessPage';

export const publicRoutes: RouteObject[] = [
  {
    path: '/auth/success',
    element: <AuthSuccessPage />,
  },
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'features', element: <Features /> },
      { path: 'ai', element: <AI /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'security', element: <Security /> },
      { path: 'terms', element: <Terms /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'states', element: <Statuses /> },
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
      {
        path: 'signup',
        element: (
          <GuestGuard>
            <Signup />
          </GuestGuard>
        ),
      },
    ],
  },
];
