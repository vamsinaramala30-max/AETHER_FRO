import React,{ useMemo, useState } from "react";

import { TRUSTED_WEBSITES } from "./trusted-websites";
import { CATEGORY_FILTER_ALL, WEBSITE_CATEGORIES } from "./web-directory-constants";
import type { TrustedWebsite, WebsiteCategory } from "./web-directory-types";
import {
  applyWebDirectoryFilters,
  loadFavoriteIds,
  loadRecentEntries,
  recordRecentVisit,
  resolveRecentWebsites,
  toggleFavorite,
  withFavoriteMeta,
} from "./web-directory-utils";

function WebsiteCard({
  website,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: {
  website: TrustedWebsite;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (website: TrustedWebsite) => void;
}): React.ReactElement {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div>
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">{website.name}</h3>
          <button
            type="button"
            onClick={() => onToggleFavorite(website.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remove ${website.name} from favorites` : `Add ${website.name} to favorites`}
            className={`shrink-0 text-lg leading-none ${
              isFavorite ? "text-amber-400" : "text-slate-300 dark:text-slate-600"
            }`}
          >
            {isFavorite ? "★" : "☆"}
          </button>
        </div>
        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">{website.description}</p>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {website.category}
          </span>
          {website.verified && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              ✓ Verified
            </span>
          )}
        </div>
      </div>
      <a
        href={website.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onOpen(website)}
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
      >
        Visit site
      </a>
    </div>
  );
}

export default function WebDirectory(): React.ReactElement {
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<WebsiteCategory | "All">(CATEGORY_FILTER_ALL);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadFavoriteIds());
  const [recentEntries, setRecentEntries] = useState(() => loadRecentEntries());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  const filteredWebsites = useMemo(() => {
    const filtered = applyWebDirectoryFilters(TRUSTED_WEBSITES, { query, category });
    if (!showFavoritesOnly) return filtered;
    const favoriteSet = new Set(favoriteIds);
    return filtered.filter((website) => favoriteSet.has(website.id));
  }, [query, category, showFavoritesOnly, favoriteIds]);

  const websitesWithMeta = useMemo(
    () => withFavoriteMeta(filteredWebsites, favoriteIds),
    [filteredWebsites, favoriteIds],
  );

  const recentWebsites = useMemo(
    () => resolveRecentWebsites(TRUSTED_WEBSITES, recentEntries),
    [recentEntries],
  );

  const handleToggleFavorite = (websiteId: string): void => {
    setFavoriteIds((current) => toggleFavorite(current, websiteId));
  };

  const handleOpen = (website: TrustedWebsite): void => {
    setRecentEntries(recordRecentVisit(website.id));
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h2 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
          Web Directory
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          A curated list of trusted, official websites across common categories.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, description, or category"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
          aria-label="Search websites"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as WebsiteCategory | "All")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
          aria-label="Filter by category"
        >
          <option value={CATEGORY_FILTER_ALL}>All categories</option>
          {WEBSITE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => setShowFavoritesOnly(event.target.checked)}
          />
          Favorites only
        </label>
      </div>

      {recentWebsites.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Recently opened
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentWebsites.map((website) => (
              <a
                key={website.id}
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleOpen(website)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300"
              >
                {website.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {websitesWithMeta.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          No websites match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {websitesWithMeta.map((website) => (
            <WebsiteCard
              key={website.id}
              website={website}
              isFavorite={website.isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onOpen={handleOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}