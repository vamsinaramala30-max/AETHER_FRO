export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
  },
  AI: {
    CHAT: '/ai/chat',
    STREAM: '/ai/chat/stream',
    MODELS: '/ai/models',
    PROMPTS: '/ai/prompts',
  },
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id: string) => `/projects/${id}`,
    MEMBERS: (id: string) => `/projects/${id}/members`,
  },
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
  },
  GOALS: {
    BASE: '/goals',
    BY_ID: (id: string) => `/goals/${id}`,
    PROGRESS: (id: string) => `/goals/${id}/progress`,
  },
  CALENDAR: {
    CALENDARS: '/calendar',
    CALENDAR_BY_ID: (id: string) => `/calendar/${id}`,
    EVENTS: '/calendar/events',
    EVENT_BY_ID: (id: string) => `/calendar/events/${id}`,
    // Also support the /workspace/calendar prefix
    WS_CALENDARS: '/workspace/calendar',
    WS_EVENTS: '/workspace/calendar/events',
    WS_EVENT_BY_ID: (id: string) => `/workspace/calendar/events/${id}`,
  },
  FAVORITES: {
    BASE: '/favorites',
    BY_ID: (id: string) => `/favorites/${id}`,
    BY_RESOURCE: (type: string, resourceId: string) => `/favorites/resource/${type}/${resourceId}`,
    REORDER: '/favorites/reorder',
  },
  KNOWLEDGE: {
    BASE: '/knowledge',
    BY_ID: (id: string) => `/knowledge/${id}`,
    SEARCH: '/knowledge/search',
    DOCUMENTS: '/knowledge/documents',
  },
  AUTOMATION: {
    WORKFLOWS: '/automation/workflows',
    WORKFLOW_BY_ID: (id: string) => `/automation/workflows/${id}`,
    EXECUTE: (id: string) => `/automation/workflows/${id}/execute`,
    LOGS: (id: string) => `/automation/workflows/${id}/logs`,
  },
  WORKSPACE: {
    BASE: '/workspaces',
    BY_ID: (id: string) => `/workspaces/${id}`,
    MEMBERS: (id: string) => `/workspaces/${id}/members`,
  },
  SETTINGS: {
    BASE: '/settings',
    PROFILE: '/settings/profile',
    ORGANIZATION: '/settings/organization',
    SECURITY: '/settings/security',
    API_KEYS: '/settings/api-keys',
  },
  UPLOADS: {
    SINGLE: '/uploads/single',
    MULTIPART: '/uploads/multipart',
    PRESIGNED_URL: '/uploads/presigned-url',
  },
  DASHBOARD: {
    BASE: '/dashboard',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
} as const;
