// frontend/src/settings/security/SecurityPage.tsx
import React from 'react';
import { SecuritySettings } from './securitysetting';

export const SecurityPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Security Strategy Matrix
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Configure credentials, access layers, and token parameters safely.
        </p>
      </div>
      <hr className="border-slate-800" />
      <SecuritySettings />
    </div>
  );
};
