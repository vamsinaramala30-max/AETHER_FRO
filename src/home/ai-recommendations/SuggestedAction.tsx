import React from 'react';

interface SuggestedActionProps {
  label: string;
  onExecute: () => void;
}

export const SuggestedAction: React.FC<SuggestedActionProps> = ({ label, onExecute }) => {
  return (
    <button
      onClick={onExecute}
      className="text-xs font-medium px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm"
    >
      {label}
    </button>
  );
};