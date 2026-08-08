/**
 * weather-types.ts
 * Shared, strict TypeScript types for the Weather feature.
 */

/** Temperature unit. Centralized so a second unit can be added later. */
export type TemperatureUnit = "celsius" | "fahrenheit";

/** High level lifecycle of the whole weather screen. */
export type WeatherState =
  | "idle"
  | "locating"
  | "loading-weather"
  | "weather-loaded"
  | "weather-error"
  | "location-denied"
  | "location-unavailable"
  | "geolocation-unsupported";

/** Browser geolocation permission lifecycle. */
export type LocationPermissionState =
  | "prompt"
  | "locating"
  | "granted"
  | "denied"
  | "unavailable"
  | "unsupported";

/** Which top-level screen is currently visible. */
export type WeatherView = "details" | "city-management";

/** A bare geographic point, as returned by geolocation/geocoding. */
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

/** A resolved place, from geocoding, reverse geocoding, or device location. */
export interface WeatherLocation extends GeoCoordinates {
  /** Human readable name, e.g. "Kurnool" */
  name: string;
  admin1?: string;
  country?: string;
  countryCode?: string;
  timezone: string;
}

/** A location the user has saved for quick access. */
export interface SavedLocation extends WeatherLocation {
  id: string;
  /** True for the device's live/current location entry. */
  isCurrentLocation: boolean;
  savedAt: number;
}

/** A single geocoding search result (before it is saved). */
export interface GeocodingResult extends WeatherLocation {
  id: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number | null;
  weatherCode: number;
  isDay: boolean;
  humidity: number | null;
  windSpeedKmh: number | null;
  windDirectionDeg: number | null;
  pressureHpa: number | null;
  visibilityMeters: number | null;
  uvIndex: number | null;
  time: string;
}

export interface HourlyWeatherPoint {
  time: string;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  precipitationProbability: number | null;
}

export interface DailyWeatherPoint {
  date: string;
  weatherCode: number;
  temperatureMin: number;
  temperatureMax: number;
  uvIndexMax: number | null;
  sunrise: string | null;
  sunset: string | null;
}

export interface AirQuality {
  europeanAqi: number | null;
  usAqi: number | null;
  pm2_5: number | null;
  pm10: number | null;
  carbonMonoxide: number | null;
  sulphurDioxide: number | null;
  time: string | null;
}

export interface WeatherData {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyWeatherPoint[];
  daily: DailyWeatherPoint[];
  airQuality: AirQuality | null;
  fetchedAt: number;
}

export interface AqiCategory {
  label: string;
  /** 1-6, matching the European AQI "I" to "VI" band shown in the UI. */
  band: number;
  colorVar: string;
}

export interface WeatherConditionInfo {
  label: string;
  group:
    | "clear"
    | "partly-cloudy"
    | "cloudy"
    | "fog"
    | "drizzle"
    | "rain"
    | "snow"
    | "thunderstorm"
    | "unknown";
}

/** Discriminated result wrapper used by weather-api.ts calls. */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; aborted?: boolean };