import React from 'react';

export const OfflineView: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-3 rounded-2xl bg-surface-subtle p-12 text-center">
      <div className="text-4xl">📡</div>
      <h3 className="text-base font-semibold text-text-primary">Network Disconnected</h3>
      <p className="max-w-sm text-xs text-text-tertiary">
        Please check your internet connection to continue using AETHER.
      </p>
    </div>
  );
};
