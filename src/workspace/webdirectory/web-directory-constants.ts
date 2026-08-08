import type { CountryInfo, WebsiteCategory } from "./web-directory-types";

export const WEBSITE_CATEGORIES: WebsiteCategory[] = [
  "Government",
  "Education",
  "Developers",
  "AI",
  "Social Media",
  "Cloud",
  "Payments",
  "News",
  "Cyber Security",
  "Shopping",
  "Entertainment",
  "Sports",
  "Travel",
  "Health",
  "Productivity",
  "Design",
  "Finance",
  "Jobs & Careers",
  "Communication",
  "Research",
  "Open Source",
];

export const CATEGORY_FILTER_ALL = "All" as const;

export const WEB_DIRECTORY_STORAGE_KEYS = {
  favorites: "web-directory:favorites",
  recents: "web-directory:recents",
  viewMode: "web-directory:view-mode",
} as const;

export const MAX_RECENT_WEBSITES = 10;

export const DEFAULT_VIEW_MODE = "category" as const;

/**
 * Countries represented in the "Browse by country" view, each paired with
 * its official trusted website in trusted-websites.ts via countryCode.
 * Flags are rendered with native Unicode regional-indicator emoji — no
 * image files or third-party flag services are used.
 */
export const COUNTRIES: CountryInfo[] = [
  { code: "US", name: "United States", flagEmoji: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flagEmoji: "🇬🇧" },
  { code: "CA", name: "Canada", flagEmoji: "🇨🇦" },
  { code: "AU", name: "Australia", flagEmoji: "🇦🇺" },
  { code: "DE", name: "Germany", flagEmoji: "🇩🇪" },
  { code: "FR", name: "France", flagEmoji: "🇫🇷" },
  { code: "IN", name: "India", flagEmoji: "🇮🇳" },
  { code: "JP", name: "Japan", flagEmoji: "🇯🇵" },
  { code: "BR", name: "Brazil", flagEmoji: "🇧🇷" },
  { code: "ZA", name: "South Africa", flagEmoji: "🇿🇦" },
  { code: "SG", name: "Singapore", flagEmoji: "🇸🇬" },
  { code: "AE", name: "United Arab Emirates", flagEmoji: "🇦🇪" },
  { code: "IT", name: "Italy", flagEmoji: "🇮🇹" },
  { code: "ES", name: "Spain", flagEmoji: "🇪🇸" },
  { code: "MX", name: "Mexico", flagEmoji: "🇲🇽" },
  { code: "NZ", name: "New Zealand", flagEmoji: "🇳🇿" },
  { code: "IE", name: "Ireland", flagEmoji: "🇮🇪" },
  { code: "NL", name: "Netherlands", flagEmoji: "🇳🇱" },
  { code: "SE", name: "Sweden", flagEmoji: "🇸🇪" },
  { code: "CH", name: "Switzerland", flagEmoji: "🇨🇭" },
  { code: "NG", name: "Nigeria", flagEmoji: "🇳🇬" },
  { code: "CN", name: "China", flagEmoji: "🇨🇳" },
  { code: "PL", name: "Poland", flagEmoji: "🇵🇱" },
  { code: "IL", name: "Israel", flagEmoji: "🇮🇱" },
  { code: "KR", name: "South Korea", flagEmoji: "🇰🇷" },
  { code: "NO", name: "Norway", flagEmoji: "🇳🇴" },
  { code: "TR", name: "Turkey", flagEmoji: "🇹🇷" },
  { code: "ID", name: "Indonesia", flagEmoji: "🇮🇩" },
  { code: "PH", name: "Philippines", flagEmoji: "🇵🇭" },
  { code: "KE", name: "Kenya", flagEmoji: "🇰🇪" },
  { code: "AR", name: "Argentina", flagEmoji: "🇦🇷" },
  { code: "CO", name: "Colombia", flagEmoji: "🇨🇴" },
  { code: "PT", name: "Portugal", flagEmoji: "🇵🇹" },
  { code: "GR", name: "Greece", flagEmoji: "🇬🇷" },
  { code: "MY", name: "Malaysia", flagEmoji: "🇲🇾" },
];