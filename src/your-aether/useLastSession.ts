/**
 * useLastSession.ts
 *
 * Tracks the last page the user visited within the app (both /app/... and /ya/...),
 * stores it in localStorage scoped by user ID, and provides genuine restoration.
 *
 * Supports:
 * - CASE A: User worked in workspace (/app or /app/...) -> restores workspace destination
 * - CASE B: User used launcher (/app/your-aether or /ya/...) -> restores launcher destination
 * - CASE C: User visited specific sub-modules -> restores exact location
 * - Validates saved destinations before navigation to prevent loops or invalid redirects
 */

import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/authprovider';
import { normalizeUserProfile } from '@/auth/userProfile';

const STORAGE_KEY_PREFIX = 'aether_last_session_';

// Paths that should never be stored as "last session" (transient / auth / hub)
export const EXCLUDED_PATHS = new Set([
  '/welcome',
  '/login',
  '/signup',
  '/auth/success',
  '/',
  '/about',
  '/features',
  '/ai',
  '/privacy',
  '/security',
  '/terms',
  '/privacy-policy',
  '/contact',
  '/docs',
  '/help',
  '/states',
]);

export function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

/**
 * Validates whether a destination path is safe, authorized, and meaningful to restore.
 */
export function isValidDestination(path: unknown): path is string {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
    return false;
  }
  // Disallow protocol, domain or traversal injection
  if (path.includes(':') || path.includes('\\')) {
    return false;
  }
  // Exclude transient and auth paths
  if (EXCLUDED_PATHS.has(path)) {
    return false;
  }
  // Must be within authorized app workspace or your-aether module scope
  if (!path.startsWith('/app') && !path.startsWith('/ya')) {
    return false;
  }
  // Prevent loops back to welcome
  if (path === '/welcome' || path.startsWith('/welcome/')) {
    return false;
  }
  return true;
}

/**
 * Persists the destination for a specific authenticated user.
 */
export function setLastSession(userId: string, path: string): void {
  if (!isValidDestination(path)) return;
  try {
    localStorage.setItem(
      getStorageKey(userId),
      JSON.stringify({ path, ts: Date.now() }),
    );
  } catch {
    // localStorage may be unavailable in some private browser modes
  }
}

/**
 * Returns the stored path for the current user, or null if no valid session is saved.
 */
export function getStoredLastSession(userId: string): string | null {
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    if (stored) {
      const parsed = JSON.parse(stored) as { path?: unknown; ts?: unknown };
      if (isValidDestination(parsed?.path)) {
        return parsed.path;
      }
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

/**
 * Returns the last visited path for the current user.
 * Falls back to /app (Workspace Dashboard) if nothing valid is stored.
 */
export function getLastSession(userId: string): string {
  return getStoredLastSession(userId) ?? '/app';
}

/**
 * Hook used inside pages or at router level to automatically record the current location
 * as an authenticated user navigates.
 */
export function useSessionTracker(): void {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const normalizedUser = normalizeUserProfile(user as Record<string, unknown> | null | undefined);
  const userId = normalizedUser.id ?? 'anonymous';

  useEffect(() => {
    if (!isAuthenticated) return;
    const path = location.pathname;
    if (isValidDestination(path)) {
      setLastSession(userId, path);
    }
  }, [location.pathname, userId, isAuthenticated]);
}

/**
 * Hook that returns session restoration helpers for the active user.
 */
export function useLastSession(): {
  lastPath: string;
  hasSession: boolean;
  continueSession: () => void;
} {
  const { user } = useAuth();
  const navigate = useNavigate();
  const normalizedUser = normalizeUserProfile(user as Record<string, unknown> | null | undefined);
  const userId = normalizedUser.id ?? 'anonymous';

  const storedPath = getStoredLastSession(userId);
  const lastPath = storedPath ?? '/app';
  const hasSession = storedPath !== null;

  const continueSession = useCallback(() => {
    navigate(lastPath);
  }, [navigate, lastPath]);

  return { lastPath, hasSession, continueSession };
}

