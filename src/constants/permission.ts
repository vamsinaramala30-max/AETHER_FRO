/**
 * Granular Permission keys for RBAC matrix validation.
 */
export const PERMISSIONS = {
  WORKSPACE: {
    MANAGE: 'workspace:manage',
    READ: 'workspace:read',
    INVITE: 'workspace:invite',
  },
  PROJECTS: {
    CREATE: 'projects:create',
    READ: 'projects:read',
    UPDATE: 'projects:update',
    DELETE: 'projects:delete',
  },
  AI: {
    EXECUTE: 'ai:execute',
    FINE_TUNE: 'ai:finetune',
  },
  KNOWLEDGE: {
    UPLOAD: 'knowledge:upload',
    DELETE: 'knowledge:delete',
  },
  SETTINGS: {
    BILLING: 'settings:billing',
    API_KEYS: 'settings:api_keys',
  },
} as const;

export type Permission = string;