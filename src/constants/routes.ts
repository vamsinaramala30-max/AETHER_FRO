/**
 * Application routes constant mapping to prevent magic strings throughout the routing system.
 */
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    ANALYTICS: '/dashboard/analytics',
    METRICS: '/dashboard/metrics',
  },
  AI: {
    CHAT: '/ai/chat',
    ASSISTANTS: '/ai/assistants',
    PROMPTS: '/ai/prompts',
    MODELS: '/ai/models',
  },
  PROJECTS: {
    LIST: '/projects',
    DETAIL: (id: string) => `/projects/${id}`,
    TASKS: (id: string) => `/projects/${id}/tasks`,
    SETTINGS: (id: string) => `/projects/${id}/settings`,
  },
  KNOWLEDGE: {
    BASE: '/knowledge',
    DOCUMENT: (id: string) => `/knowledge/${id}`,
    CATEGORIES: '/knowledge/categories',
  },
  AUTOMATION: {
    WORKFLOWS: '/automation/workflows',
    DETAIL: (id: string) => `/automation/workflows/${id}`,
    RUNS: '/automation/runs',
  },
  WORKSPACE: {
    OVERVIEW: '/workspace',
    MEMBERS: '/workspace/members',
    TEAMS: '/workspace/teams',
  },
  SETTINGS: {
    PROFILE: '/settings/profile',
    ACCOUNT: '/settings/account',
    SECURITY: '/settings/security',
    NOTIFICATIONS: '/settings/notifications',
    BILLING: '/settings/billing',
    API_KEYS: '/settings/api-keys',
  },
} as const;

export type RouteKey = keyof typeof ROUTES;