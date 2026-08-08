/**
 * Shared TypeScript types and interfaces for the Web Directory feature.
 */

export type WebsiteCategory =
  | "Government"
  | "Education"
  | "Developers"
  | "AI"
  | "Social Media"
  | "Cloud"
  | "Payments"
  | "News"
  | "Cyber Security"
  | "Shopping"
  | "Entertainment"
  | "Sports"
  | "Travel"
  | "Health"
  | "Productivity"
  | "Design"
  | "Finance"
  | "Jobs & Careers"
  | "Communication"
  | "Research"
  | "Open Source";

export interface TrustedWebsite {
  id: string;
  name: string;
  url: string;
  category: WebsiteCategory;
  description: string;
  verified: boolean;
  /**
   * ISO 3166-1 alpha-2 country code, present for entries that represent a
   * specific country's official/trusted site (used by the "Browse by
   * country" view). Omitted for global or non-country-specific entries.
   */
  countryCode?: CountryCode;
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
  category: WebsiteCategory | "All";
}

export interface UrlValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * ISO 3166-1 alpha-2 codes for the countries represented in the directory's
 * "Browse by country" view.
 */
export type CountryCode =
  | "US"
  | "GB"
  | "CA"
  | "AU"
  | "DE"
  | "FR"
  | "IN"
  | "JP"
  | "BR"
  | "ZA"
  | "SG"
  | "AE"
  | "IT"
  | "ES"
  | "MX"
  | "NZ"
  | "IE"
  | "NL"
  | "SE"
  | "CH"
  | "NG"
  | "CN"
  | "PL"
  | "IL"
  | "KR"
  | "NO"
  | "TR"
  | "ID"
  | "PH"
  | "KE"
  | "AR"
  | "CO"
  | "PT"
  | "GR"
  | "MY";

export interface CountryInfo {
  code: CountryCode;
  name: string;
  /** Unicode regional-indicator flag emoji, e.g. "🇺🇸". No image assets used. */
  flagEmoji: string;
}

/** A country paired with the trusted websites tagged for it. */
export interface CountryWebsiteGroup {
  country: CountryInfo;
  websites: TrustedWebsite[];
}

export type WebDirectoryViewMode = "category" | "country";