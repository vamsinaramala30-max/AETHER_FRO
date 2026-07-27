import { RoleType, ROLE_HIERARCHY, Role } from './roles';
import { PermissionType } from './permissions';

export interface UserAccessContext {
  role: RoleType;
  permissions: PermissionType[];
  isSubscribed?: boolean;
}

/**
 * Verifies if user holds minimum role weight in hierarchy.
 */
export function hasMinimumRole(userRole: RoleType, requiredRole: RoleType): boolean {
  const userWeight = ROLE_HIERARCHY[userRole];
  const requiredWeight = ROLE_HIERARCHY[requiredRole];
  return userWeight >= requiredWeight;
}

/**
 * Checks if user holds a specific permission string or explicit wildcards/admin rights.
 */
export function hasPermission(
  access: UserAccessContext | null | undefined,
  requiredPermission: PermissionType,
): boolean {
  if (
    access === null ||
    access === undefined ||
    typeof access.role !== 'string' ||
    access.role.trim() === ''
  )
    return false;
  if (access.role === Role.SUPERADMIN) return true;

  const perms = access.permissions as string[];
  if (perms.includes('*') || perms.includes(requiredPermission)) {
    return true;
  }

  // Domain-level wildcard support (e.g. "projects:*")
  const parts = requiredPermission.split(':');
  const domain = parts[0];
  if (typeof domain === 'string' && domain.trim() !== '' && perms.includes(`${domain}:*`)) {
    return true;
  }

  return false;
}

/**
 * Evaluates whether user has ALL required permissions.
 */
export function hasAllPermissions(
  access: UserAccessContext | null | undefined,
  requiredPermissions: PermissionType[],
): boolean {
  return requiredPermissions.every((perm) => hasPermission(access, perm));
}

/**
 * Evaluates whether user has AT LEAST ONE of the required permissions.
 */
export function hasAnyPermission(
  access: UserAccessContext | null | undefined,
  requiredPermissions: PermissionType[],
): boolean {
  return requiredPermissions.some((perm) => hasPermission(access, perm));
}

/**
 * Premium feature gate check.
 */
export function isPremiumUser(access: UserAccessContext | null | undefined): boolean {
  if (access === null || access === undefined) return false;
  return access.isSubscribed === true || hasMinimumRole(access.role, Role.PREMIUM);
}

/**
 * Admin status verification.
 */
export function isAdminUser(access: UserAccessContext | null | undefined): boolean {
  if (access === null || access === undefined) return false;
  return hasMinimumRole(access.role, Role.ADMIN);
}
