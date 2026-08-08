import {
  CATEGORY_FILTER_ALL,
  MAX_RECENT_WEBSITES,
  WEB_DIRECTORY_STORAGE_KEYS,
} from './web-directory-constants';
import type {
  FavoriteWebsiteIds,
  RecentWebsiteEntry,
  TrustedWebsite,
  UrlValidationResult,
  WebDirectoryFilters,
  WebsiteCategory,
  WebsiteWithMeta,
} from './web-directory-types';

function isLocalStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Validates that a URL uses HTTPS (or HTTP) and is well-formed.
 */
export function validateWebsiteUrl(url: string): UrlValidationResult {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { isValid: false, reason: 'URL must use the http or https protocol.' };
    }
    if (!parsed.hostname || parsed.hostname.length === 0) {
      return { isValid: false, reason: 'URL is missing a hostname.' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, reason: 'URL is not well-formed.' };
  }
}

/**
 * Filters websites by a case-insensitive text query across name, URL, and description.
 */
export function searchWebsites(websites: TrustedWebsite[], query: string): TrustedWebsite[] {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length === 0) {
    return websites;
  }
  return websites.filter((website) => {
    return (
      website.name.toLowerCase().includes(trimmed) ||
      website.description.toLowerCase().includes(trimmed) ||
      website.url.toLowerCase().includes(trimmed) ||
      website.category.toLowerCase().includes(trimmed)
    );
  });
}

/**
 * Filters websites by category. Passing the "All" sentinel returns every website.
 */
export function filterWebsitesByCategory(
  websites: TrustedWebsite[],
  category: WebsiteCategory | 'All',
): TrustedWebsite[] {
  if (category === CATEGORY_FILTER_ALL) {
    return websites;
  }
  return websites.filter((website) => website.category === category);
}

/**
 * Applies both search and category filters in one pass.
 */
export function applyWebDirectoryFilters(
  websites: TrustedWebsite[],
  filters: WebDirectoryFilters,
): TrustedWebsite[] {
  const byCategory = filterWebsitesByCategory(websites, filters.category);
  return searchWebsites(byCategory, filters.query);
}

/**
 * Merges favorite state into a list of websites for rendering.
 */
export function withFavoriteMeta(
  websites: TrustedWebsite[],
  favoriteIds: FavoriteWebsiteIds,
): WebsiteWithMeta[] {
  const favoriteSet = new Set(favoriteIds);
  return websites.map((website) => ({
    ...website,
    isFavorite: favoriteSet.has(website.id),
  }));
}

/**
 * Reads the saved favorite website IDs from localStorage.
 */
export function loadFavoriteIds(): FavoriteWebsiteIds {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(WEB_DIRECTORY_STORAGE_KEYS.favorites);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Persists the favorite website IDs to localStorage.
 */
export function saveFavoriteIds(favoriteIds: FavoriteWebsiteIds): void {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.setItem(WEB_DIRECTORY_STORAGE_KEYS.favorites, JSON.stringify(favoriteIds));
  } catch {
    // Ignore storage failures.
  }
}

/**
 * Toggles a website's favorite status and returns the updated ID list.
 */
export function toggleFavorite(
  favoriteIds: FavoriteWebsiteIds,
  websiteId: string,
): FavoriteWebsiteIds {
  const isFavorited = favoriteIds.includes(websiteId);
  const updated = isFavorited
    ? favoriteIds.filter((id) => id !== websiteId)
    : [...favoriteIds, websiteId];
  saveFavoriteIds(updated);
  return updated;
}

/**
 * Reads the saved list of recently opened websites from localStorage,
 * most recent first.
 */
export function loadRecentEntries(): RecentWebsiteEntry[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(WEB_DIRECTORY_STORAGE_KEYS.recents);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is RecentWebsiteEntry =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as RecentWebsiteEntry).id === 'string' &&
        typeof (entry as RecentWebsiteEntry).visitedAt === 'string',
    );
  } catch {
    return [];
  }
}

/**
 * Records a website as recently opened, moving it to the front of the list
 * and trimming the list to the configured maximum length.
 */
export function recordRecentVisit(websiteId: string): RecentWebsiteEntry[] {
  const existing = loadRecentEntries().filter((entry) => entry.id !== websiteId);
  const updated: RecentWebsiteEntry[] = [
    { id: websiteId, visitedAt: new Date().toISOString() },
    ...existing,
  ].slice(0, MAX_RECENT_WEBSITES);

  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(WEB_DIRECTORY_STORAGE_KEYS.recents, JSON.stringify(updated));
    } catch {
      // Ignore storage failures.
    }
  }

  return updated;
}

/**
 * Resolves recent entries into full website records, skipping any entries
 * whose website is no longer in the dataset.
 */
export function resolveRecentWebsites(
  websites: TrustedWebsite[],
  recents: RecentWebsiteEntry[],
): TrustedWebsite[] {
  const websiteMap = new Map(websites.map((website) => [website.id, website]));
  return recents
    .map((entry) => websiteMap.get(entry.id))
    .filter((website): website is TrustedWebsite => Boolean(website));
}

/**
 * Groups websites by category, preserving the input order within each group.
 */
export function groupWebsitesByCategory(
  websites: TrustedWebsite[],
): Map<WebsiteCategory, TrustedWebsite[]> {
  const grouped = new Map<WebsiteCategory, TrustedWebsite[]>();
  for (const website of websites) {
    const group = grouped.get(website.category);
    if (group) {
      group.push(website);
    } else {
      grouped.set(website.category, [website]);
    }
  }
  return grouped;
}
