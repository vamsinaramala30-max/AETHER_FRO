// frontend/src/settings/appearance/ThemeSelector.tsx
import React, { useState } from 'react';
import { appearanceService, AetherTheme } from './appearanceService';

export const ThemeSelector: React.FC = () => {
  const themes = appearanceService.getAvailableThemes();
  const [currentTheme, setCurrentTheme] = useState<AetherTheme>(appearanceService.getCurrentTheme());

  const handleThemeChange = async (themeId: AetherTheme) => {
    await appearanceService.setTheme(themeId);
    setCurrentTheme(themeId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {themes.map((t) => {
        const isActive = currentTheme === t.id;
        return (
          <button key={t.id} onClick={() => handleThemeChange(t.id)} className={`flex flex-col text-left p-4 rounded-lg border text-sm transition-all outline-none ${isActive ? 'bg-indigo-600/10 border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
            <span className={`font-semibold ${isActive ? 'text-indigo-400' : 'text-white'}`}>{t.label}</span>
            <span className="text-slate-400 mt-2 text-xs leading-relaxed">{t.description}</span>
          </button>
        );
      })}
    </div>
  );
};