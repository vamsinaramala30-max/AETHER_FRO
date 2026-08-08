import { useEffect, useMemo, useRef, useState } from "react";

import { TRUSTED_WEBSITES } from "./trusted-websites";
import { CATEGORY_FILTER_ALL, COUNTRIES, WEBSITE_CATEGORIES } from "./web-directory-constants";
import type {
  CountryInfo,
  TrustedWebsite,
  WebDirectoryViewMode,
  WebsiteCategory,
} from "./web-directory-types";
import {
  applyWebDirectoryFilters,
  buildCountryWebsiteGroups,
  loadFavoriteIds,
  loadRecentEntries,
  loadViewMode,
  pickRandomCountry,
  recordRecentVisit,
  resolveRecentWebsites,
  saveViewMode,
  searchCountries,
  toggleFavorite,
  withFavoriteMeta,
} from "./web-directory-utils";

/**
 * Design tokens for the "verified archive" identity: a dark ledger shell
 * holding cream paper entries, with a rubber-stamp motif standing in for
 * "official / verified". Colors are fixed (not theme-adaptive) so the
 * directory reads the same regardless of host page/dark-mode settings —
 * like a printed document has one look.
 *
 *   ink        #0B1120  page/shell background
 *   ink-panel  #141B33  raised panel / row hover
 *   ink-line   #2A3350  hairline borders on ink
 *   fog        #8B96BE  secondary text on ink
 *   mist       #F4EEDD  primary text on ink / paper background
 *   paper-line #D8CBA0  hairline borders on paper
 *   brass      #C7A34C  structural accent (tabs, focus, links)
 *   stamp      #9B3B33  verification stamp ink (rubber-stamp red)
 */

function FavoriteToggle({
  isFavorite,
  name,
  onToggle,
  tone,
}: {
  isFavorite: boolean;
  name: string;
  onToggle: () => void;
  tone: "ink" | "paper";
}): React.ReactElement {
  const activeColor = tone === "ink" ? "text-amber-400" : "text-amber-600";
  const idleColor = tone === "ink" ? "text-[#4B5580]" : "text-[#C9BC94]";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      className={`shrink-0 text-base leading-none transition-colors ${
        isFavorite ? activeColor : idleColor
      }`}
    >
      {isFavorite ? "★" : "☆"}
    </button>
  );
}

/** Small rubber-stamp dot used inline next to verified entries in list rows. */
function VerifiedMark(): React.ReactElement {
  return (
    <span
      title="Verified official source"
      aria-label="Verified official source"
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#9B3B33] text-[8px] leading-none text-[#9B3B33]"
    >
      ✓
    </span>
  );
}

function WebsiteListRow({
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
    <li className="flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-[#141B33] sm:flex-row sm:items-center sm:gap-4 sm:px-6">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[#C7A34C] sm:w-36 sm:shrink-0">
        {website.category}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-serif text-base text-[#F4EEDD]">{website.name}</h3>
          {website.verified && <VerifiedMark />}
        </div>
        <p className="truncate text-xs text-[#8B96BE]">{website.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-4 self-start sm:self-auto">
        <FavoriteToggle
          isFavorite={isFavorite}
          name={website.name}
          onToggle={() => onToggleFavorite(website.id)}
          tone="ink"
        />
        <a
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onOpen(website)}
          className="font-mono text-xs uppercase tracking-wide text-[#F4EEDD] underline decoration-[#C7A34C] decoration-2 underline-offset-4 hover:text-[#C7A34C]"
        >
          Visit ↗
        </a>
      </div>
    </li>
  );
}

/**
 * A country entry styled like a stamped passport page: the country's own
 * flag emoji sits in the corner like a visa sticker, and verified sources
 * get a rotated rubber-stamp badge. No image assets or third-party flag
 * services are used — flags are native Unicode emoji.
 */
function CountryStampCard({
  country,
  websites,
  favoriteIds,
  isHighlighted,
  onToggleFavorite,
  onOpen,
}: {
  country: CountryInfo;
  websites: TrustedWebsite[];
  favoriteIds: string[];
  isHighlighted: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (website: TrustedWebsite) => void;
}): React.ReactElement {
  const favoriteSet = new Set(favoriteIds);
  const isVerified = websites[0]?.verified;

  return (
    <div
      id={`country-${country.code}`}
      className={`relative overflow-hidden rounded-lg border-2 border-dashed bg-[#F4EEDD] p-5 transition-shadow duration-300 ${
        isHighlighted ? "border-[#C7A34C] shadow-[0_0_0_4px_rgba(199,163,76,0.35)]" : "border-[#C7A34C]/40"
      }`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -top-4 select-none text-6xl leading-none motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:rotate-6"
      >
        {country.flagEmoji}
      </span>

      <div className="relative max-w-[80%]">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#8A7A4E]">
          {country.code}
        </p>
        <h3 className="mt-1 font-serif text-lg text-[#1C1A14]">{country.name}</h3>
      </div>

      <ul className="relative mt-4 flex flex-col">
        {websites.map((website, index) => {
          const isFavorite = favoriteSet.has(website.id);
          return (
            <li
              key={website.id}
              className={`flex items-center justify-between gap-2 py-2 ${
                index > 0 ? "border-t border-dashed border-[#D8CBA0]" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#1C1A14]">{website.name}</p>
                <p className="truncate text-xs text-[#7A7256]">{website.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <FavoriteToggle
                  isFavorite={isFavorite}
                  name={website.name}
                  onToggle={() => onToggleFavorite(website.id)}
                  tone="paper"
                />
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onOpen(website)}
                  className="rounded-full border border-[#1C1A14]/25 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-[#1C1A14] transition-colors hover:bg-[#1C1A14] hover:text-[#F4EEDD]"
                >
                  Visit ↗
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      {isVerified && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 flex h-14 w-14 rotate-[-14deg] select-none flex-col items-center justify-center rounded-full border-2 border-[#9B3B33]/70 text-center font-mono text-[7px] uppercase leading-tight text-[#9B3B33]/80"
        >
          <span>Official</span>
          <span>Verified</span>
        </div>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }): React.ReactElement {
  return (
    <div className="rounded-lg border border-dashed border-[#2A3350] px-6 py-14 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B96BE]">
        No results
      </p>
      <p className="mt-2 font-serif text-base text-[#F4EEDD]">{label}</p>
    </div>
  );
}

export default function WebDirectory(): React.ReactElement {
  const [viewMode, setViewMode] = useState<WebDirectoryViewMode>(() => loadViewMode() ?? "category");
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<WebsiteCategory | "All">(CATEGORY_FILTER_ALL);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadFavoriteIds());
  const [recentEntries, setRecentEntries] = useState(() => loadRecentEntries());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [highlightedCountry, setHighlightedCountry] = useState<string | null>(null);

  const highlightTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimeout.current) {
        clearTimeout(highlightTimeout.current);
      }
    };
  }, []);

  const handleViewModeChange = (mode: WebDirectoryViewMode): void => {
    setViewMode(mode);
    saveViewMode(mode);
  };

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

  const countryGroups = useMemo(() => {
    const matchingCountries = searchCountries(COUNTRIES, viewMode === "country" ? query : "");
    const groups = buildCountryWebsiteGroups(TRUSTED_WEBSITES, matchingCountries);
    if (!showFavoritesOnly) return groups;
    const favoriteSet = new Set(favoriteIds);
    return groups
      .map((group) => ({
        ...group,
        websites: group.websites.filter((site) => favoriteSet.has(site.id)),
      }))
      .filter((group) => group.websites.length > 0);
  }, [query, viewMode, showFavoritesOnly, favoriteIds]);

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

  const handleSurpriseMe = (): void => {
    const random = pickRandomCountry(countryGroups.map((group) => group.country));
    if (!random) return;
    setHighlightedCountry(random.code);
    const target = document.getElementById(`country-${random.code}`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (highlightTimeout.current) {
      clearTimeout(highlightTimeout.current);
    }
    highlightTimeout.current = setTimeout(() => setHighlightedCountry(null), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-6xl rounded-3xl border border-[#2A3350] bg-[#0B1120] p-5 sm:p-8">
      {/* Hero / header — the "cover page" of the ledger */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2A3350] bg-gradient-to-b from-[#161D36] to-[#0F1526] px-6 py-8 sm:px-10 sm:py-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8B96BE]">
          Directory · Verified Sources Only
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-[#F4EEDD] sm:text-4xl">
          Web Directory
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[#B7C0DE]">
          Every link here is the real, official site — no third parties, no fakes. Browse it by
          category, or flip through it stamped by country.
        </p>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 hidden select-none sm:block"
        >
          <div className="flex h-28 w-28 rotate-12 items-center justify-center rounded-full border-2 border-dashed border-[#C7A34C]/50 text-center font-mono text-[10px] uppercase leading-tight tracking-widest text-[#C7A34C]/70">
            Verified
            <br />
            Only
          </div>
        </div>
      </div>

      {/* View mode — boarding-pass style tabs */}
      <div className="mt-6 flex border-b border-[#2A3350]">
        <button
          type="button"
          onClick={() => handleViewModeChange("category")}
          aria-pressed={viewMode === "category"}
          className={`relative px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
            viewMode === "category" ? "text-[#F4EEDD]" : "text-[#6B76A0] hover:text-[#B7C0DE]"
          }`}
        >
          By category
          {viewMode === "category" && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#C7A34C]" />
          )}
        </button>
        <button
          type="button"
          onClick={() => handleViewModeChange("country")}
          aria-pressed={viewMode === "country"}
          className={`relative px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
            viewMode === "country" ? "text-[#F4EEDD]" : "text-[#6B76A0] hover:text-[#B7C0DE]"
          }`}
        >
          By country
          {viewMode === "country" && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#C7A34C]" />
          )}
        </button>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            viewMode === "category"
              ? "Search by name, description, or category"
              : "Search by country name"
          }
          className="flex-1 border-b-2 border-[#2A3350] bg-transparent px-1 py-2 font-serif text-base text-[#F4EEDD] outline-none placeholder:text-[#4B5580] focus:border-[#C7A34C]"
          aria-label={viewMode === "category" ? "Search websites" : "Search countries"}
        />
        {viewMode === "category" && (
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as WebsiteCategory | "All")}
            className="border-b-2 border-[#2A3350] bg-transparent px-1 py-2 font-mono text-xs uppercase tracking-widest text-[#B7C0DE] outline-none focus:border-[#C7A34C]"
            aria-label="Filter by category"
          >
            <option className="bg-[#0F1526]" value={CATEGORY_FILTER_ALL}>
              All categories
            </option>
            {WEBSITE_CATEGORIES.map((cat) => (
              <option className="bg-[#0F1526]" key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
        <label className="flex items-center gap-2 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-[#B7C0DE]">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => setShowFavoritesOnly(event.target.checked)}
            className="h-3.5 w-3.5 accent-[#C7A34C]"
          />
          Favorites
        </label>
        {viewMode === "country" && (
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-[#C7A34C]/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-[#C7A34C] transition-colors hover:border-[#C7A34C] hover:bg-[#C7A34C]/10"
          >
            🎲 Random entry
          </button>
        )}
      </div>

      {/* Recently opened — ticket-stub row */}
      {recentWebsites.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#6B76A0]">
            Recently opened
          </p>
          <div className="flex flex-wrap gap-2">
            {recentWebsites.map((website) => (
              <a
                key={website.id}
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleOpen(website)}
                className="flex items-center gap-1.5 rounded-full border border-[#2A3350] px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-[#B7C0DE] transition-colors hover:border-[#C7A34C] hover:text-[#F4EEDD]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#C7A34C]" aria-hidden="true" />
                {website.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mt-8">
        {viewMode === "category" ? (
          websitesWithMeta.length === 0 ? (
            <EmptyState label="No websites match your search." />
          ) : (
            <ul className="divide-y divide-[#2A3350] overflow-hidden rounded-2xl border border-[#2A3350]">
              {websitesWithMeta.map((website) => (
                <WebsiteListRow
                  key={website.id}
                  website={website}
                  isFavorite={website.isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onOpen={handleOpen}
                />
              ))}
            </ul>
          )
        ) : countryGroups.length === 0 ? (
          <EmptyState label="No countries match your search." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {countryGroups.map((group) => (
              <CountryStampCard
                key={group.country.code}
                country={group.country}
                websites={group.websites}
                favoriteIds={favoriteIds}
                isHighlighted={highlightedCountry === group.country.code}
                onToggleFavorite={handleToggleFavorite}
                onOpen={handleOpen}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}