export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
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
} as const;
