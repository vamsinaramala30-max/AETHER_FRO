import { RoleType, ROLE_HIERARCHY, Role } from './roles';
import { PermissionType, Permission } from './permissions';

export interface UserAccessContext {
  role: RoleType;
  permissions: PermissionType[];
  isSubscribed?: boolean;
}

/**
 * Verifies if user holds minimum role weight in hierarchy.
 */
export function hasMinimumRole(userRole: RoleType, requiredRole: RoleType): boolean {
  const userWeight = ROLE_HIERARCHY[userRole] ?? 0;
  const requiredWeight = ROLE_HIERARCHY[requiredRole] ?? 0;
  return userWeight >= requiredWeight;
}

/**
 * Checks if user holds a specific permission string or explicit wildcards/admin rights.
 */
export function hasPermission(
  access: UserAccessContext,
  requiredPermission: PermissionType
): boolean {
  if (!access || !access.role) return false;
  if (access.role === Role.SUPERADMIN) return true;

  if (access.permissions.includes('*') || access.permissions.includes(requiredPermission)) {
    return true;
  }

  // Domain-level wildcard support (e.g. "projects:*")
  const [domain] = requiredPermission.split(':');
  if (domain && access.permissions.includes(`${domain}:*`)) {
    return true;
  }

  return false;
}

/**
 * Evaluates whether user has ALL required permissions.
 */
export function hasAllPermissions(
  access: UserAccessContext,
  requiredPermissions: PermissionType[]
): boolean {
  return requiredPermissions.every((perm) => hasPermission(access, perm));
}

/**
 * Evaluates whether user has AT LEAST ONE of the required permissions.
 */
export function hasAnyPermission(
  access: UserAccessContext,
  requiredPermissions: PermissionType[]
): boolean {
  return requiredPermissions.some((perm) => hasPermission(access, perm));
}

/**
 * Premium feature gate check.
 */
export function isPremiumUser(access: UserAccessContext): boolean {
  if (!access) return false;
  return (
    access.isSubscribed === true ||
    hasMinimumRole(access.role, Role.PREMIUM)
  );
}

/**
 * Admin status verification.
 */
export function isAdminUser(access: UserAccessContext): boolean {
  if (!access) return false;
  return hasMinimumRole(access.role, Role.ADMIN);
}