/**
 * API Endpoint mappings and HTTP configuration constants.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    LOGOUT: '/v1/auth/logout',
    REFRESH: '/v1/auth/refresh',
    ME: '/v1/auth/me',
  },
  AI: {
    COMPLETION: '/v1/ai/completion',
    STREAM: '/v1/ai/stream',
    CONVERSATIONS: '/v1/ai/conversations',
    ASSISTANTS: '/v1/ai/assistants',
  },
  PROJECTS: {
    BASE: '/v1/projects',
    DETAIL: (id: string) => `/v1/projects/${id}`,
    TASKS: (id: string) => `/v1/projects/${id}/tasks`,
  },
  KNOWLEDGE: {
    BASE: '/v1/knowledge',
    DOCUMENTS: '/v1/knowledge/documents',
    SEARCH: '/v1/knowledge/search',
  },
  AUTOMATION: {
    WORKFLOWS: '/v1/automation/workflows',
    EXECUTE: (id: string) => `/v1/automation/workflows/${id}/execute`,
  },
  WORKSPACE: {
    BASE: '/v1/workspace',
    MEMBERS: '/v1/workspace/members',
    INVITES: '/v1/workspace/invites',
  },
  SETTINGS: {
    PROFILE: '/v1/settings/profile',
    KEYS: '/v1/settings/keys',
  },
  NOTIFICATIONS: {
    BASE: '/v1/notifications',
    MARK_READ: (id: string) => `/v1/notifications/${id}/read`,
  },
} as const;

export const API_TIMEOUTS = {
  DEFAULT: 15000,
  UPLOAD: 60000,
  STREAM: 120000,
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
