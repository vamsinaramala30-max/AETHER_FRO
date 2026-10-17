/**
 * Module-level coordinator to prevent race conditions between initial
 * authentication session resolution and protected API requests.
 */

let _initPromise: Promise<unknown> | null = null;

export function registerAuthInitPromise(promise: Promise<unknown> | null): void {
  _initPromise = promise;
}

export async function waitForAuthInit(): Promise<void> {
  if (_initPromise) {
    try {
      await _initPromise;
    } catch {
      // Proceed safely even if initialization rejects
    }
  }
}
