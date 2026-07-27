/**
 * Omits given keys from an object immutably.
 */
export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const keysSet = new Set<keyof T>(keys);
  const result: Record<string, unknown> = {};

  Object.keys(obj).forEach((key) => {
    if (!keysSet.has(key)) {
      result[key] = obj[key];
    }
  });

  return result as Omit<T, K>;
};

/**
 * Picks given keys from an object immutably.
 */
export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  const result = {} as Record<K, unknown>;
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  });
  return result as Pick<T, K>;
};
