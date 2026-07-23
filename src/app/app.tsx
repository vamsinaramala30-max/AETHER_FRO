import React from 'react';
import { AppProviders } from './providers/appprovider';
import { AppRouter } from './router/approutes';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};

export default App;