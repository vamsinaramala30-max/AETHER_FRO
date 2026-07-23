import React from 'react';

export const OfflineView: React.FC = () => {
  return (
    <div className="w-full p-12 text-center flex flex-col items-center justify-center space-y-3 bg-surface-subtle rounded-2xl">
      <div className="text-4xl">📡</div>
      <h3 className="text-base font-semibold text-text-primary">Network Disconnected</h3>
      <p className="text-xs text-text-tertiary max-w-sm">Please check your internet connection to continue using AETHER.</p>
    </div>
  );
};