import React from 'react';
import { ThemeProvider } from './themeprovider';
import { AuthProvider } from './authprovider';
import { VisualEffectsProvider } from '../../providers/VisualEffectsProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <VisualEffectsProvider>{children}</VisualEffectsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
