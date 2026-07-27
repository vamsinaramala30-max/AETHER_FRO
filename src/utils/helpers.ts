/**
 * Executes a no-operation action (safe default function reference).
 */
export const noop = (): void => {};

/**
 * Generates a mock delay promise for UI testing or debouncing.
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Uniquely identifies dynamic runtime values via simple UUID generator.
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
