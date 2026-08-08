import type { WebsiteCategory } from "./web-directory-types";

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
} as const;

export const MAX_RECENT_WEBSITES = 10;