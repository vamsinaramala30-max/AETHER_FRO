/**
 * weather-constants.ts
 * Centralized constants: API endpoints, storage keys, timings, and limits.
 * No magic numbers should live outside this file.
 */

export const API = {
  FORECAST: "https://api.open-meteo.com/v1/forecast",
  AIR_QUALITY: "https://air-quality-api.open-meteo.com/v1/air-quality",
  GEOCODING: "https://geocoding-api.open-meteo.com/v1/search",
  // Free, key-less client-side reverse geocoding service.
  REVERSE_GEOCODE: "https://api.bigdatacloud.net/data/reverse-geocode-client",
} as const;

export const STORAGE_KEYS = {
  SAVED_LOCATIONS: "weather:saved-locations:v1",
} as const;

export const TIMINGS = {
  SEARCH_DEBOUNCE_MS: 350,
  WEATHER_CACHE_MS: 5 * 60 * 1000, // 5 minutes
  GEOLOCATION_TIMEOUT_MS: 12_000,
  GEOLOCATION_MAX_AGE_MS: 60_000,
} as const;

export const FORECAST_LIMITS = {
  HOURLY_ITEMS: 12,
  DAILY_ITEMS: 7,
  GEOCODING_RESULTS: 8,
} as const;

export const CURRENT_PARAMS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "is_day",
  "weather_code",
  "surface_pressure",
  "wind_speed_10m",
  "wind_direction_10m",
].join(",");

export const HOURLY_PARAMS = [
  "temperature_2m",
  "weather_code",
  "is_day",
  "precipitation_probability",
  "visibility",
  "uv_index",
].join(",");

export const DAILY_PARAMS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "uv_index_max",
  "sunrise",
  "sunset",
].join(",");

export const AIR_QUALITY_PARAMS = [
  "european_aqi",
  "us_aqi",
  "pm2_5",
  "pm10",
  "carbon_monoxide",
  "sulphur_dioxide",
].join(",");

/** European AQI bands (1-6 / "I"-"VI"), per Open-Meteo / EEA definitions. */
export const AQI_BANDS: ReadonlyArray<{ max: number; label: string; band: number; colorVar: string }> = [
  { max: 20, label: "Good", band: 1, colorVar: "var(--aqi-good)" },
  { max: 40, label: "Fair", band: 2, colorVar: "var(--aqi-fair)" },
  { max: 60, label: "Moderate", band: 3, colorVar: "var(--aqi-moderate)" },
  { max: 80, label: "Poor", band: 4, colorVar: "var(--aqi-poor)" },
  { max: 100, label: "Very Poor", band: 5, colorVar: "var(--aqi-very-poor)" },
  { max: Infinity, label: "Extremely Poor", band: 6, colorVar: "var(--aqi-extremely-poor)" },
];

/** Beaufort scale upper bounds in km/h, used for the "Force N" wind label. */
export const BEAUFORT_KMH_THRESHOLDS: readonly number[] = [
  1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117,
];

export const COMPASS_DIRECTIONS: readonly string[] = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];