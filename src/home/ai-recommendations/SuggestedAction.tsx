import React from 'react';

interface SuggestedActionProps {
  label: string;
  onExecute: () => void;
}

export const SuggestedAction: React.FC<SuggestedActionProps> = ({ label, onExecute }) => {
  return (
    <button
      onClick={onExecute}
      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
    >
      {label}
    </button>
  );
};
