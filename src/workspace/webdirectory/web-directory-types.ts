/**
 * Shared TypeScript types and interfaces for the Web Directory feature.
 */

export type WebsiteCategory =
  | 'Government'
  | 'Education'
  | 'Developers'
  | 'AI'
  | 'Social Media'
  | 'Cloud'
  | 'Payments'
  | 'News'
  | 'Cyber Security'
  | 'Shopping'
  | 'Entertainment'
  | 'Sports'
  | 'Travel'
  | 'Health'
  | 'Productivity'
  | 'Design'
  | 'Finance'
  | 'Jobs & Careers'
  | 'Communication'
  | 'Research'
  | 'Open Source';

export interface TrustedWebsite {
  id: string;
  name: string;
  url: string;
  category: WebsiteCategory;
  description: string;
  verified: boolean;
}

export interface WebsiteWithMeta extends TrustedWebsite {
  isFavorite: boolean;
}

export interface RecentWebsiteEntry {
  id: string;
  visitedAt: string;
}

export type FavoriteWebsiteIds = string[];

export interface WebDirectoryFilters {
  query: string;
  category: WebsiteCategory | 'All';
}

export interface UrlValidationResult {
  isValid: boolean;
  reason?: string;
}
