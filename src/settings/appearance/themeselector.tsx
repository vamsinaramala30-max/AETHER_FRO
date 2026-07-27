// frontend/src/settings/appearance/ThemeSelector.tsx
import React, { useState } from 'react';
import { appearanceService, AetherTheme } from './appearanceService';

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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {themes.map((t) => {
        const isActive = currentTheme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => {
              handleThemeChange(t.id);
            }}
            className={`flex flex-col rounded-lg border p-4 text-left text-sm outline-none transition-all ${isActive ? 'border-indigo-500 bg-indigo-600/10 shadow-md ring-1 ring-indigo-500' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
          >
            <span className={`font-semibold ${isActive ? 'text-indigo-400' : 'text-white'}`}>
              {t.label}
            </span>
            <span className="mt-2 text-xs leading-relaxed text-slate-400">{t.description}</span>
          </button>
        );
      })}
    </div>
  );
};
