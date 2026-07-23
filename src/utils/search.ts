/**
 * Filters objects array by matching query against specified field keys.
 */
export const searchFilter = <T extends Record<string, any>>(
  items: T[],
  query: string,
  keys: (keyof T)[]
): T[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((item) =>
    keys.some((key) => {
      const val = item[key];
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(normalized);
    })
  );
};