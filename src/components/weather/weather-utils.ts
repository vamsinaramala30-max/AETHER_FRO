import {
  TEMPERATURE_TREND_CHART,
  TREND_CHART_RANGE_PADDING_DEGREES,
  UNKNOWN_WEATHER_DESCRIPTION,
  WEATHER_CODE_MAP,
  WEATHER_STORAGE_KEYS,
} from "./weather-constants";
import type {
  ChartCoordinate,
  CurrentWeather,
  DailyForecastDay,
  HourlyForecastEntry,
  LineChartGeometry,
  StoredWeatherPreferences,
  TemperatureTrendPoint,
  TemperatureTrendSeries,
  TemperatureUnit,
  WeatherDescription,
  WeatherLocation,
  WeatherReportSummary,
} from "./weather-types";

/**
 * Converts a Celsius temperature to Fahrenheit.
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Converts a Fahrenheit temperature to Celsius.
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Converts a temperature value that is already expressed in Celsius
 * (Open-Meteo's default unit) into the requested display unit.
 */
export function convertFromCelsius(valueInCelsius: number, unit: TemperatureUnit): number {
  return unit === "fahrenheit" ? celsiusToFahrenheit(valueInCelsius) : valueInCelsius;
}

/**
 * Formats a temperature for display, rounding to the nearest whole degree.
 */
export function formatTemperature(valueInCelsius: number, unit: TemperatureUnit): string {
  const converted = convertFromCelsius(valueInCelsius, unit);
  const symbol = unit === "fahrenheit" ? "°F" : "°C";
  return `${Math.round(converted)}${symbol}`;
}

/**
 * Formats a wind speed value (Open-Meteo returns km/h by default).
 */
export function formatWindSpeed(speedKmh: number, unit: TemperatureUnit): string {
  if (unit === "fahrenheit") {
    const mph = speedKmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

/**
 * Looks up a human-readable description and icon name for a WMO weather code.
 */
export function getWeatherDescription(code: number): WeatherDescription {
  return WEATHER_CODE_MAP[code] ?? UNKNOWN_WEATHER_DESCRIPTION;
}

/**
 * Formats an ISO date string into a short weekday label, e.g. "Mon".
 */
export function formatDayLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

/**
 * Formats an ISO datetime string into a short time label, e.g. "3 PM".
 */
export function formatHourLabel(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) {
    return isoDateTime;
  }
  return date.toLocaleTimeString(undefined, { hour: "numeric" });
}

/**
 * Formats an ISO datetime string into a readable clock time, e.g. "6:42 AM".
 */
export function formatClockTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) {
    return isoDateTime;
  }
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

/**
 * Builds a human-friendly display name for a location.
 */
export function formatLocationName(location: WeatherLocation): string {
  const parts = [location.name, location.region, location.country].filter(
    (part): part is string => Boolean(part && part.trim().length > 0),
  );
  return parts.length > 0 ? parts.join(", ") : "Unknown location";
}

function isLocalStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Persists the selected temperature unit to localStorage.
 */
export function saveUnitPreference(unit: TemperatureUnit): void {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.setItem(WEATHER_STORAGE_KEYS.unit, unit);
  } catch {
    // Ignore storage failures (e.g. private browsing mode, quota exceeded).
  }
}

/**
 * Reads the previously saved temperature unit from localStorage, if any.
 */
export function loadUnitPreference(): TemperatureUnit | null {
  if (!isLocalStorageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(WEATHER_STORAGE_KEYS.unit);
    if (raw === "fahrenheit" || raw === "celsius") {
      return raw;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persists the selected location to localStorage.
 */
export function saveLocationPreference(location: WeatherLocation): void {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.setItem(WEATHER_STORAGE_KEYS.location, JSON.stringify(location));
  } catch {
    // Ignore storage failures.
  }
}

/**
 * Reads the previously saved location from localStorage, if any.
 */
export function loadLocationPreference(): WeatherLocation | null {
  if (!isLocalStorageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(WEATHER_STORAGE_KEYS.location);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WeatherLocation;
    if (
      typeof parsed.latitude === "number" &&
      typeof parsed.longitude === "number" &&
      typeof parsed.name === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Loads all stored weather preferences at once.
 */
export function loadStoredPreferences(): StoredWeatherPreferences {
  return {
    unit: loadUnitPreference() ?? "fahrenheit",
    location: loadLocationPreference(),
  };
}

/**
 * Clamps latitude/longitude values to valid ranges, useful for defensive
 * checks before making an API request.
 */
export function areValidCoordinates(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * Builds a high/low temperature trend series (already converted to the
 * display unit) from a daily forecast, ready for charting.
 */
export function buildDailyTemperatureTrend(
  daily: DailyForecastDay[],
  unit: TemperatureUnit,
): TemperatureTrendSeries {
  const high: TemperatureTrendPoint[] = daily.map((day) => ({
    label: formatDayLabel(day.date),
    isoTime: day.date,
    value: convertFromCelsius(day.temperatureMax, unit),
    weatherCode: day.weatherCode,
  }));

  const low: TemperatureTrendPoint[] = daily.map((day) => ({
    label: formatDayLabel(day.date),
    isoTime: day.date,
    value: convertFromCelsius(day.temperatureMin, unit),
    weatherCode: day.weatherCode,
  }));

  const allValues = [...high, ...low].map((point) => point.value);
  const minValue = Math.min(...allValues) - TREND_CHART_RANGE_PADDING_DEGREES;
  const maxValue = Math.max(...allValues) + TREND_CHART_RANGE_PADDING_DEGREES;

  return { high, low, minValue, maxValue };
}

/**
 * Builds an hourly temperature trend series (already converted to the
 * display unit) from an hourly forecast, ready for charting.
 */
export function buildHourlyTemperatureTrend(
  hourly: HourlyForecastEntry[],
  unit: TemperatureUnit,
): TemperatureTrendSeries {
  const high: TemperatureTrendPoint[] = hourly.map((hour) => ({
    label: formatHourLabel(hour.time),
    isoTime: hour.time,
    value: convertFromCelsius(hour.temperature, unit),
    weatherCode: hour.weatherCode,
  }));

  const values = high.map((point) => point.value);
  const minValue = Math.min(...values) - TREND_CHART_RANGE_PADDING_DEGREES;
  const maxValue = Math.max(...values) + TREND_CHART_RANGE_PADDING_DEGREES;

  return { high, low: [], minValue, maxValue };
}

/**
 * Maps a series of temperature points onto the fixed SVG coordinate space
 * used by TEMPERATURE_TREND_CHART, without any charting library.
 */
export function plotTrendCoordinates(
  points: TemperatureTrendPoint[],
  minValue: number,
  maxValue: number,
): ChartCoordinate[] {
  const { viewBoxWidth, viewBoxHeight, paddingX, paddingY } = TEMPERATURE_TREND_CHART;

  if (points.length === 0) {
    return [];
  }

  const usableWidth = viewBoxWidth - paddingX * 2;
  const usableHeight = viewBoxHeight - paddingY * 2;
  const range = maxValue - minValue || 1;

  return points.map((point, index) => {
    const x =
      points.length === 1
        ? paddingX + usableWidth / 2
        : paddingX + (index / (points.length - 1)) * usableWidth;
    const normalized = (point.value - minValue) / range;
    const y = paddingY + usableHeight * (1 - normalized);
    return { x, y };
  });
}

/**
 * Converts a set of chart coordinates into an SVG line path and a closed
 * area path (for an optional fill under the line).
 */
export function buildLineChartGeometry(coordinates: ChartCoordinate[]): LineChartGeometry {
  if (coordinates.length === 0) {
    return { linePath: "", areaPath: "", coordinates: [] };
  }

  const { viewBoxHeight, paddingY } = TEMPERATURE_TREND_CHART;
  const baseline = viewBoxHeight - paddingY;

  const linePath = coordinates
    .map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x.toFixed(2)},${coord.y.toFixed(2)}`)
    .join(" ");

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  const areaPath = `${linePath} L${last.x.toFixed(2)},${baseline.toFixed(2)} L${first.x.toFixed(2)},${baseline.toFixed(2)} Z`;

  return { linePath, areaPath, coordinates };
}

/**
 * Builds the headline summary block for the weather report: place name,
 * a short plain-language description, and today's high/low.
 */
export function buildWeatherReportSummary(
  location: WeatherLocation,
  current: CurrentWeather,
  today: DailyForecastDay | undefined,
  unit: TemperatureUnit,
  description: WeatherDescription,
): WeatherReportSummary {
  const placeName = formatLocationName(location);
  const currentTemp = formatTemperature(current.temperature, unit);
  const headline = `${description.label}, ${currentTemp} right now`;

  return {
    placeName,
    headline,
    reportedAt: formatClockTime(current.time),
    highLabel: today ? formatTemperature(today.temperatureMax, unit) : "—",
    lowLabel: today ? formatTemperature(today.temperatureMin, unit) : "—",
  };
}