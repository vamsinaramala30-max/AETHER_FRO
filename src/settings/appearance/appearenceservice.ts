// frontend/src/settings/appearance/appearanceService.ts
import { themeSystem } from '../../shared/theme'; // Reusing established client application layout hooks/context

export type AetherTheme = 'dark-slate' | 'cyberpunk-dark' | 'oled-black';

export const appearanceService = {
  getAvailableThemes: (): { id: AetherTheme; label: string; description: string }[] => [
    { id: 'dark-slate', label: 'Dark Slate', description: 'Default dark workspace optimized for prolonged operations.' },
    { id: 'cyberpunk-dark', label: 'Cyberpunk Neon', description: 'High contrast vibrant color accents.' },
    { id: 'oled-black', label: 'OLED Pure Black', description: 'True black background optimized for power conservation.' }
  ],

  setTheme: async (themeId: AetherTheme): Promise<void> => {
    themeSystem.setTheme(themeId === 'dark-slate' || themeId === 'oled-black' ? 'dark' : 'dark');
  },

  getCurrentTheme: (): AetherTheme => {
    return (themeSystem.isDark() ? 'dark-slate' : 'dark-slate') as AetherTheme;
  }
};