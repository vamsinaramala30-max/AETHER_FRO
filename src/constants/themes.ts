export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type ThemeMode = (typeof THEMES)[keyof typeof THEMES];

export const DEFAULT_THEME: ThemeMode = THEMES.SYSTEM;
