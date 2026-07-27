export const ROUTES = {
  PUBLIC: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    ANALYTICS: '/dashboard/analytics',
  },
  AI: {
    CHAT: '/ai/chat',
    CHAT_DETAIL: (id: string) => `/ai/chat/${id}`,
    PROMPTS: '/ai/prompts',
  },
  PROJECTS: {
    LIST: '/projects',
    DETAIL: (id: string) => `/projects/${id}`,
    SETTINGS: (id: string) => `/projects/${id}/settings`,
  },
  KNOWLEDGE: {
    ROOT: '/knowledge',
    DOCUMENTS: '/knowledge/documents',
    VECTORS: '/knowledge/vectors',
  },
  AUTOMATION: {
    WORKFLOWS: '/automation/workflows',
    LOGS: '/automation/logs',
  },
  WORKSPACE: {
    ROOT: '/workspace',
    MEMBERS: '/workspace/members',
  },
  SETTINGS: {
    PROFILE: '/settings/profile',
    SECURITY: '/settings/security',
    API_KEYS: '/settings/api-keys',
  },
} as const;

export type AppRoutes = typeof ROUTES;
