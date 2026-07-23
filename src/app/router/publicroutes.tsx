import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PublicLayout } from '../layouts/publiclayouts';

// Importing verified existing landing components safely via barrel export
import { Home, About, Features, AI, Privacy, Security, Terms, PrivacyPolicy, Login, Signup } from '../../public/pages';

export const publicRoutes: RouteObject[] = [
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
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> }
    ]
  }
];