/**
 * weather-utils.ts
 * Pure, side-effect-free helper functions. No network calls live here.
 */

import { AQI_BANDS, BEAUFORT_KMH_THRESHOLDS, COMPASS_DIRECTIONS } from "./weather-constants";
import type { AqiCategory, TemperatureUnit, WeatherConditionInfo } from "./weather-types";

/* -------------------------------------------------------------------------- */
/* Weather code mapping                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Maps WMO / Open-Meteo weather codes to a condition label + semantic group.
 * https://open-meteo.com/en/docs (WMO Weather interpretation codes)
 */
export function getWeatherCondition(code: number): WeatherConditionInfo {
  const map: Record<number, WeatherConditionInfo> = {
    0: { label: "Clear", group: "clear" },
    1: { label: "Mostly Clear", group: "clear" },
    2: { label: "Partly Cloudy", group: "partly-cloudy" },
    3: { label: "Cloudy", group: "cloudy" },
    45: { label: "Foggy", group: "fog" },
    48: { label: "Rime Fog", group: "fog" },
    51: { label: "Light Drizzle", group: "drizzle" },
    53: { label: "Drizzle", group: "drizzle" },
    55: { label: "Dense Drizzle", group: "drizzle" },
    56: { label: "Freezing Drizzle", group: "drizzle" },
    57: { label: "Freezing Drizzle", group: "drizzle" },
    61: { label: "Light Rain", group: "rain" },
    63: { label: "Rain", group: "rain" },
    65: { label: "Heavy Rain", group: "rain" },
    66: { label: "Freezing Rain", group: "rain" },
    67: { label: "Freezing Rain", group: "rain" },
    71: { label: "Light Snow", group: "snow" },
    73: { label: "Snow", group: "snow" },
    75: { label: "Heavy Snow", group: "snow" },
    77: { label: "Snow Grains", group: "snow" },
    80: { label: "Light Showers", group: "rain" },
    81: { label: "Showers", group: "rain" },
    82: { label: "Violent Showers", group: "rain" },
    85: { label: "Snow Showers", group: "snow" },
    86: { label: "Heavy Snow Showers", group: "snow" },
    95: { label: "Thunderstorm", group: "thunderstorm" },
    96: { label: "Thunderstorm w/ Hail", group: "thunderstorm" },
    99: { label: "Severe Thunderstorm", group: "thunderstorm" },
  };
  return map[code] ?? { label: "Unavailable", group: "unknown" };
}

/**
 * Returns a stable icon key used to pick a lucide-react icon component.
 * Kept separate from getWeatherCondition so icon choice can consider isDay.
 */
export type WeatherIconKey =
  | "sun"
  | "moon"
  | "cloud-sun"
  | "cloud-moon"
  | "cloud"
  | "cloud-fog"
  | "cloud-drizzle"
  | "cloud-rain"
  | "cloud-snow"
  | "cloud-lightning"
  | "help-circle";

export function getWeatherIconKey(code: number, isDay: boolean): WeatherIconKey {
  const { group } = getWeatherCondition(code);
  switch (group) {
    case "clear":
      return isDay ? "sun" : "moon";
    case "partly-cloudy":
      return isDay ? "cloud-sun" : "cloud-moon";
    case "cloudy":
      return "cloud";
    case "fog":
      return "cloud-fog";
    case "drizzle":
      return "cloud-drizzle";
    case "rain":
      return "cloud-rain";
    case "snow":
      return "cloud-snow";
    case "thunderstorm":
      return "cloud-lightning";
    default:
      return "help-circle";
  }
}

export function getWeatherAriaLabel(code: number, isDay: boolean): string {
  const { label } = getWeatherCondition(code);
  if (label === "Unavailable") return "Weather condition unavailable";
  return `${label}${isDay ? "" : ", night"}`;
}

/* -------------------------------------------------------------------------- */
/* AQI                                                                          */
/* -------------------------------------------------------------------------- */

export function getAqiCategory(europeanAqi: number | null): AqiCategory | null {
  if (europeanAqi === null || Number.isNaN(europeanAqi)) return null;
  const band = AQI_BANDS.find((b) => europeanAqi <= b.max) ?? AQI_BANDS[AQI_BANDS.length - 1];
  return { label: band.label, band: band.band, colorVar: band.colorVar };
}

/* -------------------------------------------------------------------------- */
/* Temperature                                                                 */
/* -------------------------------------------------------------------------- */

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  return unit === "fahrenheit" ? (celsius * 9) / 5 + 32 : celsius;
}

export function formatTemperature(
  celsius: number | null | undefined,
  unit: TemperatureUnit = "celsius",
  options: { withUnit?: boolean; decimals?: number } = {}
): string {
  if (celsius === null || celsius === undefined || Number.isNaN(celsius)) return "--";
  const { withUnit = false, decimals = 0 } = options;
  const value = convertTemperature(celsius, unit);
  const rounded = value.toFixed(decimals);
  const symbol = unit === "fahrenheit" ? "°F" : "°C";
  return withUnit ? `${rounded}${symbol}` : rounded;
}

/* -------------------------------------------------------------------------- */
/* Date & time — always driven by the location's IANA timezone                */
/* -------------------------------------------------------------------------- */

export function formatTime(isoTime: string, timezone: string): string {
  const date = new Date(isoTime);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  }).format(date);
}

export function formatShortDate(isoDate: string, timezone: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone,
  }).format(date);
}

export function formatWeekday(isoDate: string, timezone: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: timezone }).format(date);
}

/** Returns the current date string (YYYY-MM-DD) as seen in a given timezone. */
export function getTodayInTimezone(timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone,
  }).formatToParts(new Date());
  const lookup: Record<string, string> = {};
  for (const part of parts) lookup[part.type] = part.value;
  return `${lookup.year}-${lookup.month}-${lookup.day}`;
}

/** "Today" / "Tomorrow" / weekday name, based on the location's timezone. */
export function getRelativeDayLabel(isoDate: string, timezone: string): string {
  const today = getTodayInTimezone(timezone);
  const todayDate = new Date(`${today}T00:00:00`);
  const targetDate = new Date(`${isoDate.slice(0, 10)}T00:00:00`);
  const diffDays = Math.round((targetDate.getTime() - todayDate.getTime()) / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return formatWeekday(isoDate, timezone);
}

/** Label for the first hourly slot ("Now") vs. subsequent hourly times. */
export function getHourlySlotLabel(isoTime: string, timezone: string, isFirst: boolean): string {
  return isFirst ? "Now" : formatTime(isoTime, timezone);
}

/* -------------------------------------------------------------------------- */
/* Wind                                                                         */
/* -------------------------------------------------------------------------- */

export function getWindDirectionLabel(degrees: number | null): string {
  if (degrees === null || Number.isNaN(degrees)) return "--";
  const index = Math.round(degrees / 22.5) % 16;
  return COMPASS_DIRECTIONS[(index + 16) % 16];
}

/** Converts km/h wind speed into a "Force N" Beaufort label, as in the reference UI. */
export function getBeaufortForce(kmh: number | null): string {
  if (kmh === null || Number.isNaN(kmh)) return "--";
  let force = 0;
  for (let i = 0; i < BEAUFORT_KMH_THRESHOLDS.length; i++) {
    if (kmh > BEAUFORT_KMH_THRESHOLDS[i]) force = i + 1;
  }
  return `Force ${force}`;
}

export function formatWindSpeed(kmh: number | null): string {
  if (kmh === null || Number.isNaN(kmh)) return "Unavailable";
  return `${Math.round(kmh)} km/h`;
}

/* -------------------------------------------------------------------------- */
/* Other measurements                                                          */
/* -------------------------------------------------------------------------- */

export function formatPressure(hpa: number | null): string {
  if (hpa === null || Number.isNaN(hpa)) return "Unavailable";
  return `${Math.round(hpa).toLocaleString("en-US")} hPa`;
}

export function formatVisibility(meters: number | null): string {
  if (meters === null || Number.isNaN(meters)) return "Unavailable";
  const km = meters / 1000;
  return `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
}

export function formatHumidity(percent: number | null): string {
  if (percent === null || Number.isNaN(percent)) return "Unavailable";
  return `${Math.round(percent)}%`;
}

export function formatUvIndex(uv: number | null): string {
  if (uv === null || Number.isNaN(uv)) return "Unavailable";
  if (uv < 3) return "Weaker";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very High";
  return "Extreme";
}

export function formatAirQualityValue(value: number | null, unit = ""): string {
  if (value === null || Number.isNaN(value)) return "--";
  return `${Math.round(value)}${unit}`;
}

/* -------------------------------------------------------------------------- */
/* Chart geometry — smooth SVG path via Catmull-Rom -> cubic Bezier            */
/* -------------------------------------------------------------------------- */

export interface ChartPoint {
  x: number;
  y: number;
}

/**
 * Builds a smooth SVG path "d" attribute through the given points.
 * Safe against fewer than 2 points (returns an empty string).
 */
export function buildSmoothPath(points: ChartPoint[]): string {
  if (points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return path;
}

/** Maps a list of values into chart-space [x,y] points, safe for empty/flat data. */
export function mapValuesToPoints(
  values: Array<number | null>,
  width: number,
  height: number,
  paddingY = 16
): ChartPoint[] {
  const finiteValues = values.filter((v): v is number => v !== null && !Number.isNaN(v));
  if (finiteValues.length === 0) return [];

  const min = Math.min(...finiteValues);
  const max = Math.max(...finiteValues);
  const range = max - min || 1;
  const usableHeight = height - paddingY * 2;
  const step = values.length > 1 ? width / (values.length - 1) : 0;

  const points: ChartPoint[] = [];
  values.forEach((value, index) => {
    if (value === null || Number.isNaN(value)) return;
    const x = step * index;
    const normalized = (value - min) / range;
    const y = paddingY + (1 - normalized) * usableHeight;
    points.push({ x, y });
  });
  return points;
}

/* -------------------------------------------------------------------------- */
/* Misc                                                                         */
/* -------------------------------------------------------------------------- */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function safeRound(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${Math.round(value)}`;
}

/** localStorage read that never throws (private mode, quota, corrupt JSON, SSR). */
export function safeGetStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined" || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

/** localStorage write that never throws. Returns whether it succeeded. */
export function safeSetStorage<T>(key: string, value: T): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}