/**
 * Shared theme configuration and constants.
 * Provides centralized theme values for the application.
 */

export const THEME = {
  colors: {
    primary: {
      DEFAULT: '#3b6eff',
      light: '#6d9eff',
      dark: '#254bf6',
    },
    background: {
      DEFAULT: '#020617',
      card: '#0f172a',
      elevated: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      muted: '#64748b',
    },
    border: {
      DEFAULT: '#1e293b',
      light: '#334155',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
} as const;

export type Theme = typeof THEME;

