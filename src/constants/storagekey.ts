/**
 * Centralized keys used for LocalStorage, SessionStorage, and Cookie persistent states.
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'aether_auth_token',
  REFRESH_TOKEN: 'aether_refresh_token',
  THEME: 'aether_theme_preference',
  WORKSPACE_ID: 'aether_active_workspace',
  USER_PREFERENCES: 'aether_user_prefs',
  SIDEBAR_COLLAPSED: 'aether_sidebar_collapsed',
} as const;
