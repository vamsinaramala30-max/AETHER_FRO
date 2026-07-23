// frontend/src/settings/security/SecurityPage.tsx
import React from 'react';
import { SecuritySettings } from './SecuritySettings';

export const SecurityPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Security Strategy Matrix</h2>
        <p className="text-sm text-slate-400 mt-1">Configure credentials, access layers, and token parameters safely.</p>
      </div>
      <hr className="border-slate-800" />
      <SecuritySettings />
    </div>
  );
};