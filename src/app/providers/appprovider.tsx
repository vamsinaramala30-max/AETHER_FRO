import React from 'react';
import { ThemeProvider } from './themeprovider';
import { AuthProvider } from './authprovider';
import { AIProvider } from '../../contexts/AIContext';
import { VisualEffectsProvider } from '../../providers/VisualEffectsProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AIProvider>
          <VisualEffectsProvider>{children}</VisualEffectsProvider>
        </AIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
