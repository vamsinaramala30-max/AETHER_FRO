// frontend/src/settings/appearance/AppearancePage.tsx
import React from 'react';
import { ThemeSelector } from './themeselector';

export const AppearancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Appearance Customization
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Configure interface rendering properties and design layout tokens.
        </p>
      </div>
      <hr className="border-slate-800" />
      <div className="space-y-4">
        <h3 className="text-base font-medium text-white">Visual Workspace Interface</h3>
        <ThemeSelector />
      </div>
    </div>
  );
};
