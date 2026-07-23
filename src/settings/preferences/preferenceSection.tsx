// frontend/src/settings/preferences/PreferenceSection.tsx
import React from 'react';

interface PreferenceSectionProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}

export const PreferenceSection: React.FC<PreferenceSectionProps> = ({ title, description, isEnabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg max-w-2xl">
      <div className="pr-4">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
      </div>
      <button type="button" onClick={onToggle} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isEnabled ? 'bg-indigo-600' : 'bg-slate-700'}`}>
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
};