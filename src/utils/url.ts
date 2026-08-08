/**
 * Appends query parameters cleanly onto existing URL paths.
 */
export const buildUrlWithParams = (
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined | null>,
): string => {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    url = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  }

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.append(key, String(val));
    }
  });

  return baseUrl.startsWith('http://') || baseUrl.startsWith('https://')
    ? url.toString()
    : url.pathname + url.search;
};
