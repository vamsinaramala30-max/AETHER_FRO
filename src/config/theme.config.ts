export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  defaultMode: ThemeMode;
  storageKey: string;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  motion: {
    reducedMotion: boolean;
    defaultDurationMs: number;
  };
}

export const themeConfig: ThemeConfig = {
  defaultMode: 'system',
  storageKey: 'aether_theme_preference',
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1.0rem',
    full: '9999px',
  },
  motion: {
    reducedMotion: false,
    defaultDurationMs: 200,
  },
} as const;
