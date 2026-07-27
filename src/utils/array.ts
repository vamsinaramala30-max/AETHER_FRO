/**
 * Removes duplicate items from an array based on explicit key function.
 */
export const uniqueBy = <T>(arr: T[], keyFn: (item: T) => string | number | symbol): T[] => {
  const seen = new Set<string | number | symbol>();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/**
 * Groups items of an array by key extractor.
 */
export const groupBy = <T, K extends string | number | symbol>(
  arr: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> => {
  return arr.reduce<Partial<Record<K, T[]>>>((acc, item) => {
    const key = keyFn(item);
    const group = acc[key] ?? [];
    group.push(item);
    acc[key] = group;
    return acc;
  }, {}) as Record<K, T[]>;
};
