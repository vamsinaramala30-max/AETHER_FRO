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
  Contact,
  Docs,
  Help,
  Login,
  Signup,
  Statuses,
  Complaint,
} from '../../public/pages/Index';

import { AuthSuccessPage } from '../../auth/AuthSuccessPage';
import { AdminLoginPage } from '../../admin/AdminLoginPage';
import { useAuth } from '../providers/authprovider';
import { Navigate } from 'react-router-dom';

const RootLandingRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="bg-background text-foreground flex min-h-screen items-center justify-center"
        aria-busy="true"
        aria-label="Verifying session"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <span className="text-sm font-medium tracking-wide opacity-75">Verifying session...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return <Home />;
};

export const publicRoutes: RouteObject[] = [
  {
    path: '/auth/success',
    element: <AuthSuccessPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <RootLandingRoute /> },
      { path: 'about', element: <About /> },
      { path: 'features', element: <Features /> },
      { path: 'ai', element: <AI /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'security', element: <Security /> },
      { path: 'terms', element: <Terms /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'contact', element: <Contact /> },
      { path: 'docs', element: <Docs /> },
      { path: 'help', element: <Help /> },
      { path: 'complaint', element: <Complaint /> },
      { path: 'report-problem', element: <Complaint /> },
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
