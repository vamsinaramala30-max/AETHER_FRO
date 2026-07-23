/**
 * Key identifiers for iconography registry mapping.
 */
export const ICON_NAMES = {
  DASHBOARD: 'layout-dashboard',
  AI_CHAT: 'bot',
  PROJECTS: 'folder-git-2',
  KNOWLEDGE: 'book-open',
  AUTOMATION: 'workflow',
  SETTINGS: 'settings',
  USER: 'user',
  BELL: 'bell',
  SEARCH: 'search',
  CHEVRON_RIGHT: 'chevron-right',
  CHEVRON_DOWN: 'chevron-down',
  CHECK: 'check',
  X: 'x',
  ALERT: 'alert-triangle',
} as const;

export type IconName = (typeof ICON_NAMES)[keyof typeof ICON_NAMES];