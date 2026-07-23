/**
 * Appends query parameters cleanly onto existing URL paths.
 */
export const buildUrlWithParams = (
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined | null>
): string => {
  const url = new URL(baseUrl, window.location.origin);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.append(key, String(val));
    }
  });
  return url.pathname + url.search;
};