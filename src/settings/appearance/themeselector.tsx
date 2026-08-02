import React, { useState } from 'react';
import { appearanceService, AetherTheme } from './appearanceService';
import { Check } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const themes = appearanceService.getAvailableThemes();
  const [currentTheme, setCurrentTheme] = useState<AetherTheme>(
    appearanceService.getCurrentTheme(),
  );

  const handleThemeChange = (themeId: AetherTheme) => {
    void (async () => {
      await appearanceService.setTheme(themeId);
      setCurrentTheme(themeId);
    })();
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {themes.map((t) => {
        const isActive = currentTheme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => handleThemeChange(t.id)}
            className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition-all ${
              isActive
                ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500 dark:bg-indigo-950/20'
                : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-slate-700'
            }`}
          >
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={`text-base font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}
                >
                  {t.label}
                </span>
                {isActive && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {t.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
