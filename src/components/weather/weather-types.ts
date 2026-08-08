/**
 * Shared TypeScript types and interfaces for the Weather feature.
 */

export type TemperatureUnit = "fahrenheit" | "celsius";

export type LocationSource = "geolocation" | "manual" | "stored";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface WeatherLocation extends Coordinates {
  name: string;
  region?: string;
  country?: string;
  source: LocationSource;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
  time: string;
}

export interface DailyForecastDay {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecastEntry {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface WeatherData {
  location: WeatherLocation;
  unit: TemperatureUnit;
  current: CurrentWeather;
  hourly: HourlyForecastEntry[];
  daily: DailyForecastDay[];
  timezone: string;
  fetchedAt: string;
}

export interface WeatherDescription {
  label: string;
  icon: string;
}

export type WeatherRequestStatus = "idle" | "loading" | "success" | "error";

export type GeolocationPermissionState =
  | "unknown"
  | "prompt"
  | "granted"
  | "denied"
  | "unsupported";

export interface WeatherErrorInfo {
  message: string;
  kind: "permission-denied" | "geolocation-unsupported" | "network" | "not-found" | "unknown";
}

export interface StoredWeatherPreferences {
  unit: TemperatureUnit;
  location: WeatherLocation | null;
}

export interface OpenMeteoCurrentUnits {
  temperature_2m: string;
  apparent_temperature: string;
  relative_humidity_2m: string;
  wind_speed_10m: string;
  precipitation: string;
}

export interface OpenMeteoCurrentBlock {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  weather_code: number;
  is_day: number;
  precipitation: number;
}

export interface OpenMeteoHourlyBlock {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
}

export interface OpenMeteoDailyBlock {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  sunrise: string[];
  sunset: string[];
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: OpenMeteoCurrentBlock;
  current_units: OpenMeteoCurrentUnits;
  hourly: OpenMeteoHourlyBlock;
  daily: OpenMeteoDailyBlock;
}

export interface OpenMeteoGeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
}

export interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[];
}

/**
 * A single labeled data point used to plot a temperature trend graph
 * (e.g. one day of a 7-day forecast, or one hour of a 24-hour forecast).
 */
export interface TemperatureTrendPoint {
  /** Short axis label, e.g. "Mon" or "3 PM". */
  label: string;
  /** ISO date or datetime this point represents. */
  isoTime: string;
  /** Display-unit temperature value (already converted). */
  value: number;
  /** Weather code for this point, used to pick an icon/description. */
  weatherCode: number;
}

/**
 * A two-line trend series (e.g. daily high/low) ready to be rendered as a graph.
 */
export interface TemperatureTrendSeries {
  high: TemperatureTrendPoint[];
  low: TemperatureTrendPoint[];
  minValue: number;
  maxValue: number;
}

/** A plotted x/y coordinate pair within an SVG chart's viewBox. */
export interface ChartCoordinate {
  x: number;
  y: number;
}

/** The result of laying out a value series into SVG-ready geometry. */
export interface LineChartGeometry {
  linePath: string;
  areaPath: string;
  coordinates: ChartCoordinate[];
}

/**
 * A compact human-readable summary of the current conditions and place,
 * used as the headline of the weather report.
 */
export interface WeatherReportSummary {
  placeName: string;
  headline: string;
  reportedAt: string;
  highLabel: string;
  lowLabel: string;
}