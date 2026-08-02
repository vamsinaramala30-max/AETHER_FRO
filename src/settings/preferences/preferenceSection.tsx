import React from 'react';

interface PreferenceSectionProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}

export const PreferenceSection: React.FC<PreferenceSectionProps> = ({
  title,
  description,
  isEnabled,
  onToggle,
}) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="pr-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
};
