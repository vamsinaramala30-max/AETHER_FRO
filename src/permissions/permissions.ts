/**
 * Action and Domain Permissions for AETHER Access Control
 */

export const PermissionAction = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  EXPORT: 'export',
  UPLOAD: 'upload',
  AUTOMATE: 'automate',
  CONFIGURE: 'configure',
  EXECUTE: 'execute',
} as const;

export type PermissionActionType = (typeof PermissionAction)[keyof typeof PermissionAction];

export const PermissionDomain = {
  WORKSPACE: 'workspace',
  PROJECTS: 'projects',
  KNOWLEDGE: 'knowledge',
  AI_MODELS: 'ai_models',
  AUTOMATION: 'automation',
  SETTINGS: 'settings',
  USERS: 'users',
  BILLING: 'billing',
} as const;

export type PermissionDomainType = (typeof PermissionDomain)[keyof typeof PermissionDomain];

/**
 * Granular Permission Definitions formatted as `domain:action`
 */
export const Permission = {
  // Projects
  PROJECTS_READ: 'projects:read',
  PROJECTS_CREATE: 'projects:create',
  PROJECTS_UPDATE: 'projects:update',
  PROJECTS_DELETE: 'projects:delete',
  PROJECTS_EXPORT: 'projects:export',

  // Knowledge Base
  KNOWLEDGE_READ: 'knowledge:read',
  KNOWLEDGE_UPLOAD: 'knowledge:upload',
  KNOWLEDGE_MANAGE: 'knowledge:manage',

  // AI & Automation
  AI_EXECUTE: 'ai_models:execute',
  AI_CONFIGURE: 'ai_models:configure',
  AUTOMATION_CREATE: 'automation:create',
  AUTOMATION_EXECUTE: 'automation:execute',
  AUTOMATION_MANAGE: 'automation:manage',

  // Workspace & Settings
  WORKSPACE_READ: 'workspace:read',
  WORKSPACE_MANAGE: 'workspace:manage',
  SETTINGS_UPDATE: 'settings:update',

  // Administration & Billing
  USERS_MANAGE: 'users:manage',
  BILLING_MANAGE: 'billing:manage',
  SYSTEM_CONFIGURE: 'settings:configure',
} as const;

export type PermissionType = (typeof Permission)[keyof typeof Permission];
