/**
 * Role Definitions & Constants for AETHER
 */

export const Role = {
  GUEST: 'guest',
  USER: 'user',
  PREMIUM: 'premium',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

/**
 * Role Hierarchy mapping. Higher numerical weight inherits lower weight permissions.
 */
export const ROLE_HIERARCHY: Record<RoleType, number> = {
  [Role.GUEST]: 0,
  [Role.USER]: 10,
  [Role.PREMIUM]: 20,
  [Role.ADMIN]: 30,
  [Role.SUPERADMIN]: 40,
};

export interface RoleConfig {
  id: RoleType;
  displayName: string;
  description: string;
}

export const ROLE_CONFIGS: Record<RoleType, RoleConfig> = {
  [Role.GUEST]: {
    id: Role.GUEST,
    displayName: 'Guest',
    description: 'Unauthenticated or temporary visitor',
  },
  [Role.USER]: {
    id: Role.USER,
    displayName: 'Standard User',
    description: 'Standard account with core platform access',
  },
  [Role.PREMIUM]: {
    id: Role.PREMIUM,
    displayName: 'Premium Subscriber',
    description: 'Enhanced access including advanced AI models and automation',
  },
  [Role.ADMIN]: {
    id: Role.ADMIN,
    displayName: 'Administrator',
    description: 'Workspace and user management capabilities',
  },
  [Role.SUPERADMIN]: {
    id: Role.SUPERADMIN,
    displayName: 'Super Administrator',
    description: 'Full platform system administration access',
  },
};
