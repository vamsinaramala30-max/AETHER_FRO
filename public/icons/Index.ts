/**
 * AETHER Platform Icon Registry
 * Export paths and metadata helpers for runtime icon instantiation in Vite/React.
 */

export const APP_ICONS = {
  logo: '/icons/app/logo.svg',
  logoDark: '/icons/app/logo-dark.svg',
  logoLight: '/icons/app/logo-light.svg',
  logoIcon: '/icons/app/logo-icon.svg',
  logoSymbol: '/icons/app/logo-symbol.svg',
  wordmark: '/icons/app/wordmark.svg',
  brandMark: '/icons/app/brand-mark.svg',
} as const;

export const NAV_ICONS = {
  dashboard: '/icons/navigation/dashboard.svg',
  ai: '/icons/navigation/ai.svg',
  projects: '/icons/navigation/projects.svg',
  knowledge: '/icons/navigation/knowledge.svg',
  automation: '/icons/navigation/automation.svg',
  workspace: '/icons/navigation/workspace.svg',
  settings: '/icons/navigation/settings.svg',
  profile: '/icons/navigation/profile.svg',
  notifications: '/icons/navigation/notifications.svg',
  search: '/icons/navigation/search.svg',
  menu: '/icons/navigation/menu.svg',
  close: '/icons/navigation/close.svg',
  back: '/icons/navigation/back.svg',
  next: '/icons/navigation/next.svg',
} as const;

export const SOCIAL_ICONS = {
  github: '/icons/social/github.svg',
  google: '/icons/social/google.svg',
  linkedin: '/icons/social/linkedin.svg',
  x: '/icons/social/x.svg',
  youtube: '/icons/social/youtube.svg',
  discord: '/icons/social/discord.svg',
  facebook: '/icons/social/facebook.svg',
  instagram: '/icons/social/instagram.svg',
} as const;

export const FAVICON_ASSETS = {
  svg: '/icons/favicon/favicon.svg',
  ico: '/icons/favicon/favicon.ico',
  png16: '/icons/favicon/favicon-16x16.png',
  png32: '/icons/favicon/favicon-32x32.png',
  appleTouch: '/icons/favicon/apple-touch-icon.png',
  android192: '/icons/favicon/android-chrome-192x192.png',
  android512: '/icons/favicon/android-chrome-512x512.png',
  safariPinned: '/icons/favicon/safari-pinned-tab.svg',
  manifest: '/icons/favicon/site.webmanifest',
} as const;

export type AppIconName = keyof typeof APP_ICONS;
export type NavIconName = keyof typeof NAV_ICONS;
export type SocialIconName = keyof typeof SOCIAL_ICONS;

export const AETHER_ICONS = {
  app: APP_ICONS,
  nav: NAV_ICONS,
  social: SOCIAL_ICONS,
  favicon: FAVICON_ASSETS,
} as const;

export default AETHER_ICONS;