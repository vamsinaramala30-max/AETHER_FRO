/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        aether: {
          bg: 'var(--aether-bg-app)',
          surface: 'var(--aether-bg-surface)',
          elevated: 'var(--aether-bg-surface-elevated)',
          subtle: 'var(--aether-bg-subtle)',
          hover: 'var(--aether-bg-hover)',
          selected: 'var(--aether-bg-selected)',
          border: 'var(--aether-border-color)',
          'border-strong': 'var(--aether-border-strong)',
          main: 'var(--aether-text-main)',
          muted: 'var(--aether-text-muted)',
          subtleText: 'var(--aether-text-subtle)',
          primary: 'var(--aether-primary)',
          secondary: 'var(--aether-secondary)',
          accent: 'var(--aether-accent)',
        },
        surface: {
          base: 'var(--aether-bg-app)',
          elevated: 'var(--aether-bg-surface)',
          subtle: 'var(--aether-bg-subtle)',
          hover: 'var(--aether-bg-hover)',
        },
        border: {
          subtle: 'var(--aether-border-color)',
          strong: 'var(--aether-border-strong)',
        },
        text: {
          primary: 'var(--aether-text-main)',
          secondary: 'var(--aether-text-muted)',
          tertiary: 'var(--aether-text-subtle)',
        },
        accent: {
          primary: 'var(--aether-primary)',
          'primary-hover': 'var(--aether-primary-hover)',
          secondary: 'var(--aether-secondary)',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        neutral: {
          0: '#ffffff',
          1000: '#000000',
        },
        glow: {
          cyan: '#22D3EE',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          pink: '#EC4899',
        },
      },
    },
  },
  plugins: [],
};