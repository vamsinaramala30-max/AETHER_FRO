/**
 * weather-api.ts
 * All network / device I/O for the Weather feature lives here.
 * Weather.tsx should never call fetch() or navigator.geolocation directly.
 */

import {
  AIR_QUALITY_PARAMS,
  API,
  CURRENT_PARAMS,
  DAILY_PARAMS,
  FORECAST_LIMITS,
  HOURLY_PARAMS,
  TIMINGS,
} from "./weather-constants";
import type {
  AirQuality,
  ApiResult,
  GeoCoordinates,
  GeocodingResult,
  WeatherData,
  WeatherLocation,
} from "./weather-types";

/* -------------------------------------------------------------------------- */
/* In-memory response cache (per lat/lon, short-lived)                        */
/* -------------------------------------------------------------------------- */

interface CacheEntry {
  data: WeatherData;
  expiresAt: number;
}

const weatherCache = new Map<string, CacheEntry>();

function cacheKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
}

function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "aborted";
  }
  if (error instanceof TypeError) {
    return "Unable to reach the weather service. Check your connection.";
  }
  return "Something went wrong. Please try again.";
}

/* -------------------------------------------------------------------------- */
/* Device location                                                             */
/* -------------------------------------------------------------------------- */

export type GeolocationErrorKind = "denied" | "unavailable" | "unsupported" | "timeout";

export interface GeolocationFailure {
  kind: GeolocationErrorKind;
  message: string;
}

/** Wraps navigator.geolocation.getCurrentPosition in a typed Promise. */
export function getCurrentPosition(): Promise<
  { ok: true; coords: GeoCoordinates } | { ok: false; error: GeolocationFailure }
> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({
        ok: false,
        error: { kind: "unsupported", message: "Your browser does not support location services." },
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          ok: true,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve({
            ok: false,
            error: { kind: "denied", message: "Location permission was denied." },
          });
        } else if (error.code === error.TIMEOUT) {
          resolve({
            ok: false,
            error: { kind: "timeout", message: "Locating your position took too long." },
          });
        } else {
          resolve({
            ok: false,
            error: { kind: "unavailable", message: "Unable to access your location." },
          });
        }
      },
      {
        enableHighAccuracy: false,
        timeout: TIMINGS.GEOLOCATION_TIMEOUT_MS,
        maximumAge: TIMINGS.GEOLOCATION_MAX_AGE_MS,
      }
    );
  });
}

/* -------------------------------------------------------------------------- */
/* Reverse geocoding (coordinates -> place name)                              */
/* -------------------------------------------------------------------------- */

interface BigDataCloudReverseResponse {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
  countryCode?: string;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<ApiResult<WeatherLocation>> {
  try {
    const url = new URL(API.REVERSE_GEOCODE);
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set("localityLanguage", "en");

    const response = await fetch(url.toString(), { signal });
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    if (!response.ok) {
      // Reverse geocoding failing shouldn't block showing weather.
      return {
        ok: true,
        data: { latitude, longitude, name: "Current Location", timezone },
      };
    }

    const json = (await response.json()) as BigDataCloudReverseResponse;
    const name = json.city || json.locality || "Current Location";

    return {
      ok: true,
      data: {
        latitude,
        longitude,
        name,
        admin1: json.principalSubdivision,
        country: json.countryName,
        countryCode: json.countryCode,
        timezone,
      },
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, error: "aborted", aborted: true };
    }
    // Non-fatal: fall back to a generic label rather than blocking weather.
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    return { ok: true, data: { latitude, longitude, name: "Current Location", timezone } };
  }
}

/* -------------------------------------------------------------------------- */
/* Forward geocoding (city search)                                            */
/* -------------------------------------------------------------------------- */

interface OpenMeteoGeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  admin1?: string;
  country?: string;
  country_code?: string;
}

interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[];
}

export async function searchLocations(
  query: string,
  signal?: AbortSignal
): Promise<ApiResult<GeocodingResult[]>> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { ok: true, data: [] };
  }

  try {
    const url = new URL(API.GEOCODING);
    url.searchParams.set("name", trimmed);
    url.searchParams.set("count", String(FORECAST_LIMITS.GEOCODING_RESULTS));
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");

    const response = await fetch(url.toString(), { signal });
    if (!response.ok) {
      return { ok: false, error: "Unable to find this city." };
    }

    const json = (await response.json()) as OpenMeteoGeocodingResponse;
    const results: GeocodingResult[] = (json.results ?? []).map((r) => ({
      id: `${r.id}`,
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone,
      admin1: r.admin1,
      country: r.country,
      countryCode: r.country_code,
    }));

    return { ok: true, data: results };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, error: "aborted", aborted: true };
    }
    return { ok: false, error: getFriendlyErrorMessage(error) };
  }
}

/* -------------------------------------------------------------------------- */
/* Weather forecast                                                            */
/* -------------------------------------------------------------------------- */

interface OpenMeteoForecastResponse {
  timezone: string;
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m?: number;
    apparent_temperature?: number;
    is_day: number;
    weather_code: number;
    surface_pressure?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    is_day: number[];
    precipitation_probability?: number[];
    visibility?: number[];
    uv_index?: number[];
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    uv_index_max?: number[];
    sunrise?: string[];
    sunset?: string[];
  };
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<ApiResult<Omit<WeatherData, "location" | "airQuality" | "fetchedAt"> & { timezone: string }>> {
  try {
    const url = new URL(API.FORECAST);
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set("current", CURRENT_PARAMS);
    url.searchParams.set("hourly", HOURLY_PARAMS);
    url.searchParams.set("daily", DAILY_PARAMS);
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("forecast_days", "8");

    const response = await fetch(url.toString(), { signal });
    if (!response.ok) {
      return { ok: false, error: "Weather data is currently unavailable." };
    }

    const json = (await response.json()) as OpenMeteoForecastResponse;

    if (!json.current || !json.hourly || !json.daily) {
      return { ok: false, error: "Weather data is currently unavailable." };
    }

    const current = {
      temperature: json.current.temperature_2m,
      apparentTemperature: json.current.apparent_temperature ?? null,
      weatherCode: json.current.weather_code,
      isDay: json.current.is_day === 1,
      humidity: json.current.relative_humidity_2m ?? null,
      windSpeedKmh: json.current.wind_speed_10m ?? null,
      windDirectionDeg: json.current.wind_direction_10m ?? null,
      pressureHpa: json.current.surface_pressure ?? null,
      // Visibility/UV are hourly-only in Open-Meteo; take the slot matching "now".
      visibilityMeters: findHourlyValueForNow(json.hourly.time, json.hourly.visibility, json.current.time),
      uvIndex: findHourlyValueForNow(json.hourly.time, json.hourly.uv_index, json.current.time),
      time: json.current.time,
    };

    const nowIndex = Math.max(0, json.hourly.time.findIndex((t) => t >= json.current!.time));
    const hourly = json.hourly.time
      .slice(nowIndex, nowIndex + FORECAST_LIMITS.HOURLY_ITEMS)
      .map((time, i) => {
        const index = nowIndex + i;
        return {
          time,
          temperature: json.hourly!.temperature_2m[index],
          weatherCode: json.hourly!.weather_code[index],
          isDay: json.hourly!.is_day[index] === 1,
          precipitationProbability: json.hourly!.precipitation_probability?.[index] ?? null,
        };
      });

    const daily = json.daily.time.slice(0, FORECAST_LIMITS.DAILY_ITEMS).map((date, index) => ({
      date,
      weatherCode: json.daily!.weather_code[index],
      temperatureMin: json.daily!.temperature_2m_min[index],
      temperatureMax: json.daily!.temperature_2m_max[index],
      uvIndexMax: json.daily!.uv_index_max?.[index] ?? null,
      sunrise: json.daily!.sunrise?.[index] ?? null,
      sunset: json.daily!.sunset?.[index] ?? null,
    }));

    return { ok: true, data: { current, hourly, daily, timezone: json.timezone } };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, error: "aborted", aborted: true };
    }
    return { ok: false, error: getFriendlyErrorMessage(error) };
  }
}

function findHourlyValueForNow(
  times: string[],
  values: number[] | undefined,
  nowIso: string
): number | null {
  if (!values || values.length === 0) return null;
  let index = times.findIndex((t) => t >= nowIso);
  if (index === -1) index = 0;
  const value = values[index];
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

/* -------------------------------------------------------------------------- */
/* Air quality                                                                 */
/* -------------------------------------------------------------------------- */

interface OpenMeteoAirQualityResponse {
  current?: {
    time: string;
    european_aqi?: number;
    us_aqi?: number;
    pm2_5?: number;
    pm10?: number;
    carbon_monoxide?: number;
    sulphur_dioxide?: number;
  };
}

export async function fetchAirQuality(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<ApiResult<AirQuality>> {
  try {
    const url = new URL(API.AIR_QUALITY);
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set("current", AIR_QUALITY_PARAMS);
    url.searchParams.set("timezone", "auto");

    const response = await fetch(url.toString(), { signal });
    if (!response.ok || !response.headers.get("content-type")?.includes("json")) {
      return { ok: false, error: "Air quality data is unavailable." };
    }

    const json = (await response.json()) as OpenMeteoAirQualityResponse;
    if (!json.current) {
      return { ok: false, error: "Air quality data is unavailable." };
    }

    return {
      ok: true,
      data: {
        europeanAqi: json.current.european_aqi ?? null,
        usAqi: json.current.us_aqi ?? null,
        pm2_5: json.current.pm2_5 ?? null,
        pm10: json.current.pm10 ?? null,
        carbonMonoxide: json.current.carbon_monoxide ?? null,
        sulphurDioxide: json.current.sulphur_dioxide ?? null,
        time: json.current.time,
      },
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, error: "aborted", aborted: true };
    }
    return { ok: false, error: "Air quality data is unavailable." };
  }
}

/* -------------------------------------------------------------------------- */
/* Composed fetch: weather + air quality for one location, with caching       */
/* -------------------------------------------------------------------------- */

export async function fetchWeatherBundle(
  location: WeatherLocation,
  signal?: AbortSignal,
  options: { skipCache?: boolean } = {}
): Promise<ApiResult<WeatherData>> {
  const key = cacheKey(location.latitude, location.longitude);
  const cached = weatherCache.get(key);
  if (!options.skipCache && cached && cached.expiresAt > Date.now()) {
    return { ok: true, data: cached.data };
  }

  const [weatherResult, airQualityResult] = await Promise.all([
    fetchWeather(location.latitude, location.longitude, signal),
    fetchAirQuality(location.latitude, location.longitude, signal),
  ]);

  if (!weatherResult.ok) {
    return weatherResult.aborted
      ? { ok: false, error: "aborted", aborted: true }
      : { ok: false, error: weatherResult.error };
  }

  const data: WeatherData = {
    location: { ...location, timezone: weatherResult.data.timezone || location.timezone },
    current: weatherResult.data.current,
    hourly: weatherResult.data.hourly,
    daily: weatherResult.data.daily,
    airQuality: airQualityResult.ok ? airQualityResult.data : null,
    fetchedAt: Date.now(),
  };

  weatherCache.set(key, { data, expiresAt: Date.now() + TIMINGS.WEATHER_CACHE_MS });
  return { ok: true, data };
}

export function clearWeatherCache(): void {
  weatherCache.clear();
}