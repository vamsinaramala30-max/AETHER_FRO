import type { TemperatureUnit, WeatherDescription } from "./weather-types";

export const OPEN_METEO_FORECAST_BASE_URL = "https://api.open-meteo.com/v1/forecast";
export const OPEN_METEO_GEOCODING_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

export const DEFAULT_TEMPERATURE_UNIT: TemperatureUnit = "fahrenheit";

export const WEATHER_STORAGE_KEYS = {
  unit: "weather:unit",
  location: "weather:location",
} as const;

export const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 5 * 60 * 1000,
};

export const HOURLY_FORECAST_HOURS = 24;
export const DAILY_FORECAST_DAYS = 7;
export const GEOCODING_RESULT_LIMIT = 5;

export const CURRENT_WEATHER_PARAMS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "wind_speed_10m",
  "wind_direction_10m",
  "weather_code",
  "is_day",
  "precipitation",
].join(",");

export const HOURLY_WEATHER_PARAMS = [
  "temperature_2m",
  "weather_code",
  "precipitation_probability",
].join(",");

export const DAILY_WEATHER_PARAMS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "sunrise",
  "sunset",
].join(",");

/**
 * WMO Weather interpretation codes, as used by Open-Meteo.
 * https://open-meteo.com/en/docs
 */
export const WEATHER_CODE_MAP: Record<number, WeatherDescription> = {
  0: { label: "Clear sky", icon: "sun" },
  1: { label: "Mainly clear", icon: "sun" },
  2: { label: "Partly cloudy", icon: "cloud-sun" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Fog", icon: "cloud-fog" },
  48: { label: "Depositing rime fog", icon: "cloud-fog" },
  51: { label: "Light drizzle", icon: "cloud-drizzle" },
  53: { label: "Moderate drizzle", icon: "cloud-drizzle" },
  55: { label: "Dense drizzle", icon: "cloud-drizzle" },
  56: { label: "Light freezing drizzle", icon: "cloud-drizzle" },
  57: { label: "Dense freezing drizzle", icon: "cloud-drizzle" },
  61: { label: "Slight rain", icon: "cloud-rain" },
  63: { label: "Moderate rain", icon: "cloud-rain" },
  65: { label: "Heavy rain", icon: "cloud-rain-heavy" },
  66: { label: "Light freezing rain", icon: "cloud-rain" },
  67: { label: "Heavy freezing rain", icon: "cloud-rain-heavy" },
  71: { label: "Slight snow fall", icon: "cloud-snow" },
  73: { label: "Moderate snow fall", icon: "cloud-snow" },
  75: { label: "Heavy snow fall", icon: "cloud-snow" },
  77: { label: "Snow grains", icon: "cloud-snow" },
  80: { label: "Slight rain showers", icon: "cloud-rain" },
  81: { label: "Moderate rain showers", icon: "cloud-rain" },
  82: { label: "Violent rain showers", icon: "cloud-rain-heavy" },
  85: { label: "Slight snow showers", icon: "cloud-snow" },
  86: { label: "Heavy snow showers", icon: "cloud-snow" },
  95: { label: "Thunderstorm", icon: "cloud-lightning" },
  96: { label: "Thunderstorm with slight hail", icon: "cloud-lightning" },
  99: { label: "Thunderstorm with heavy hail", icon: "cloud-lightning" },
};

export const UNKNOWN_WEATHER_DESCRIPTION: WeatherDescription = {
  label: "Unknown conditions",
  icon: "cloud-question",
};

/**
 * Layout configuration for the inline SVG temperature trend graph rendered
 * in the weather report. No charting library is used — the graph is plotted
 * by hand using this fixed coordinate space, then scaled responsively via
 * the SVG's viewBox.
 */
export const TEMPERATURE_TREND_CHART = {
  viewBoxWidth: 640,
  viewBoxHeight: 200,
  paddingX: 32,
  paddingY: 24,
  highStrokeWidth: 3,
  lowStrokeWidth: 2,
  pointRadius: 3,
} as const;

export const TREND_CHART_RANGE_PADDING_DEGREES = 4;