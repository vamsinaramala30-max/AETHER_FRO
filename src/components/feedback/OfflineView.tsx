import React from 'react';

export const OfflineView: React.FC = () => {
  return (
    <div className="bg-surface-subtle flex w-full flex-col items-center justify-center space-y-3 rounded-2xl p-12 text-center">
      <div className="text-4xl">📡</div>
      <h3 className="text-text-primary text-base font-semibold">Network Disconnected</h3>
      <p className="text-text-tertiary max-w-sm text-xs">
        Please check your internet connection to continue using AETHER.
      </p>
    </div>
  );
};
