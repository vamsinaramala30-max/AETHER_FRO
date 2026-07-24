// frontend/src/settings/appearance/appearanceService.ts
import { THEME } from '../../shared/theme';

export type AetherTheme = 'dark-slate' | 'cyberpunk-dark' | 'oled-black';

export const appearanceService = {
  getAvailableThemes: (): { id: AetherTheme; label: string; description: string }[] => [
    { id: 'dark-slate', label: 'Dark Slate', description: 'Default dark workspace optimized for prolonged operations.' },
    { id: 'cyberpunk-dark', label: 'Cyberpunk Neon', description: 'High contrast vibrant color accents.' },
    { id: 'oled-black', label: 'OLED Pure Black', description: 'True black background optimized for power conservation.' }
  ],

  setTheme: async (themeId: AetherTheme): Promise<void> => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('aether_theme_preference', 'dark');
  },

  getCurrentTheme: (): AetherTheme => {
    return 'dark-slate' as AetherTheme;
  }
};
