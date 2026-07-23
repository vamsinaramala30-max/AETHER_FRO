/**
 * Global Styles Module Barrel Export
 */
import './global.css';

export const THEME_KEYS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type ThemeMode = typeof THEME_KEYS[keyof typeof THEME_KEYS];