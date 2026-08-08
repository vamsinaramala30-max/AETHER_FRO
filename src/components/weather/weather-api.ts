import {
  CURRENT_WEATHER_PARAMS,
  DAILY_WEATHER_PARAMS,
  GEOCODING_RESULT_LIMIT,
  HOURLY_WEATHER_PARAMS,
  OPEN_METEO_FORECAST_BASE_URL,
  OPEN_METEO_GEOCODING_BASE_URL,
} from "./weather-constants";
import type {
  Coordinates,
  GeocodingResult,
  OpenMeteoForecastResponse,
  OpenMeteoGeocodingResponse,
  WeatherData,
  WeatherLocation,
} from "./weather-types";

/**
 * Fetches current, hourly, and daily forecast data from the Open-Meteo
 * forecast API for the given coordinates. No API key is required.
 */
export async function fetchWeatherData(location: WeatherLocation): Promise<WeatherData> {
  const url = new URL(OPEN_METEO_FORECAST_BASE_URL);
  url.searchParams.set("latitude", String(location.latitude));
  url.searchParams.set("longitude", String(location.longitude));
  url.searchParams.set("current", CURRENT_WEATHER_PARAMS);
  url.searchParams.set("hourly", HOURLY_WEATHER_PARAMS);
  url.searchParams.set("daily", DAILY_WEATHER_PARAMS);
  url.searchParams.set("temperature_unit", "celsius");
  url.searchParams.set("wind_speed_unit", "kmh");
  url.searchParams.set("timezone", "auto");

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch {
    throw new Error("Unable to reach the weather service. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new Error(`Weather service returned an error (status ${response.status}).`);
  }

  const payload = (await response.json()) as OpenMeteoForecastResponse;

  const hourly = payload.hourly.time.map((time, index) => ({
    time,
    temperature: payload.hourly.temperature_2m[index],
    weatherCode: payload.hourly.weather_code[index],
    precipitationProbability: payload.hourly.precipitation_probability[index],
  }));

  const daily = payload.daily.time.map((date, index) => ({
    date,
    weatherCode: payload.daily.weather_code[index],
    temperatureMax: payload.daily.temperature_2m_max[index],
    temperatureMin: payload.daily.temperature_2m_min[index],
    precipitationSum: payload.daily.precipitation_sum[index],
    precipitationProbabilityMax: payload.daily.precipitation_probability_max[index],
    windSpeedMax: payload.daily.wind_speed_10m_max[index],
    sunrise: payload.daily.sunrise[index],
    sunset: payload.daily.sunset[index],
  }));

  return {
    location,
    // Raw values are always fetched in Celsius; the display unit is applied
    // separately via weather-utils formatting helpers.
    unit: "celsius",
    current: {
      temperature: payload.current.temperature_2m,
      apparentTemperature: payload.current.apparent_temperature,
      relativeHumidity: payload.current.relative_humidity_2m,
      windSpeed: payload.current.wind_speed_10m,
      windDirection: payload.current.wind_direction_10m,
      weatherCode: payload.current.weather_code,
      isDay: payload.current.is_day === 1,
      precipitation: payload.current.precipitation,
      time: payload.current.time,
    },
    hourly,
    daily,
    timezone: payload.timezone,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Searches for locations by free-text query using the Open-Meteo geocoding
 * API. No API key is required.
 */
export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const url = new URL(OPEN_METEO_GEOCODING_BASE_URL);
  url.searchParams.set("name", trimmed);
  url.searchParams.set("count", String(GEOCODING_RESULT_LIMIT));
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch {
    throw new Error("Unable to reach the location search service. Check your connection.");
  }

  if (!response.ok) {
    throw new Error(`Location search returned an error (status ${response.status}).`);
  }

  const payload = (await response.json()) as OpenMeteoGeocodingResponse;

  return (payload.results ?? []).map((result) => ({
    id: result.id,
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    admin1: result.admin1,
    timezone: result.timezone,
  }));
}

/**
 * Resolves the browser's geolocation API into plain coordinates, wrapped in
 * a Promise for easier async/await usage.
 */
export function getBrowserCoordinates(options?: PositionOptions): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      options,
    );
  });
}

/**
 * Converts a geocoding search result into a WeatherLocation with a
 * "manual" source, for use after the user selects a search result.
 */
export function geocodingResultToLocation(result: GeocodingResult): WeatherLocation {
  return {
    latitude: result.latitude,
    longitude: result.longitude,
    name: result.name,
    region: result.admin1,
    country: result.country,
    source: "manual",
  };
}