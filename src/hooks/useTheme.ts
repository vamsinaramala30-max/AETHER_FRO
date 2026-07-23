import { useCallback, useEffect } from 'react';
import { useSettingsStore } from '../state/settingsStore';

export const useTheme = () => {
  const theme = useSettingsStore((s) => s.settings.theme);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const setTheme = useCallback(
    (newTheme: 'light' | 'dark' | 'system') => {
      updateSettings({ theme: newTheme });
    },
    [updateSettings]
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }
  }, [theme]);

  return { theme, setTheme };
};