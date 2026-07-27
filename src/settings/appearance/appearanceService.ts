// frontend/src/settings/appearance/appearanceService.ts

export type AetherTheme = 'dark-slate' | 'cyberpunk-dark' | 'oled-black';

export const appearanceService = {
  getAvailableThemes: (): { id: AetherTheme; label: string; description: string }[] => [
    {
      id: 'dark-slate',
      label: 'Dark Slate',
      description: 'Default dark workspace optimized for prolonged operations.',
    },
    {
      id: 'cyberpunk-dark',
      label: 'Cyberpunk Neon',
      description: 'High contrast vibrant color accents.',
    },
    {
      id: 'oled-black',
      label: 'OLED Pure Black',
      description: 'True black background optimized for power conservation.',
    },
  ],

  setTheme(themeId: AetherTheme): Promise<void> {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add('dark');
    root.setAttribute('data-theme', themeId);
    localStorage.setItem('aether_theme_preference', themeId);
    return Promise.resolve();
  },

  getCurrentTheme: (): AetherTheme => {
    return 'dark-slate';
  },
};
