import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  fetchWeatherData,
  geocodingResultToLocation,
  getBrowserCoordinates,
  searchLocations,
} from "./weather-api";
import { GEOLOCATION_OPTIONS, TEMPERATURE_TREND_CHART } from "./weather-constants";
import type {
  GeocodingResult,
  GeolocationPermissionState,
  TemperatureTrendPoint,
  TemperatureUnit,
  WeatherData,
  WeatherErrorInfo,
  WeatherLocation,
  WeatherRequestStatus,
} from "./weather-types";
import {
  buildDailyTemperatureTrend,
  buildLineChartGeometry,
  buildWeatherReportSummary,
  formatClockTime,
  formatDayLabel,
  formatHourLabel,
  formatLocationName,
  formatTemperature,
  formatWindSpeed,
  getWeatherDescription,
  loadStoredPreferences,
  plotTrendCoordinates,
  saveLocationPreference,
  saveUnitPreference,
} from "./weather-utils";

/**
 * Renders a dependency-free inline SVG line graph comparing daily high and
 * low temperatures across the forecast window.
 */
function TemperatureTrendGraph({
  high,
  low,
  minValue,
  maxValue,
  unit,
}: {
  high: TemperatureTrendPoint[];
  low: TemperatureTrendPoint[];
  minValue: number;
  maxValue: number;
  unit: TemperatureUnit;
}): React.ReactElement | null {
  if (high.length === 0) {
    return null;
  }

  const highCoordinates = plotTrendCoordinates(high, minValue, maxValue);
  const lowCoordinates = plotTrendCoordinates(low, minValue, maxValue);
  const highGeometry = buildLineChartGeometry(highCoordinates);
  const lowGeometry = buildLineChartGeometry(lowCoordinates);
  const { viewBoxWidth, viewBoxHeight, pointRadius } = TEMPERATURE_TREND_CHART;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        role="img"
        aria-label="Temperature trend graph showing daily highs and lows"
        className="h-auto w-full"
      >
        {highGeometry.areaPath && (
          <path d={highGeometry.areaPath} className="fill-orange-100 dark:fill-orange-950/40" />
        )}
        {highGeometry.linePath && (
          <path
            d={highGeometry.linePath}
            fill="none"
            className="stroke-orange-500"
            strokeWidth={TEMPERATURE_TREND_CHART.highStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {lowGeometry.linePath && (
          <path
            d={lowGeometry.linePath}
            fill="none"
            className="stroke-sky-400"
            strokeWidth={TEMPERATURE_TREND_CHART.lowStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 3"
          />
        )}
        {highGeometry.coordinates.map((coord, index) => (
          <circle
            // eslint-disable-next-line react/no-array-index-key
            key={`high-${high[index]?.isoTime ?? index}`}
            cx={coord.x}
            cy={coord.y}
            r={pointRadius}
            className="fill-orange-500"
          />
        ))}
        {lowGeometry.coordinates.map((coord, index) => (
          <circle
            // eslint-disable-next-line react/no-array-index-key
            key={`low-${low[index]?.isoTime ?? index}`}
            cx={coord.x}
            cy={coord.y}
            r={pointRadius}
            className="fill-sky-400"
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-slate-400 dark:text-slate-500">
        {high.map((point) => (
          <span key={point.isoTime}>{point.label}</span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-orange-500" aria-hidden="true" />
          High ({unit === "fahrenheit" ? "°F" : "°C"})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
          Low ({unit === "fahrenheit" ? "°F" : "°C"})
        </span>
      </div>
    </div>
  );
}

function reverseGeocodeName(latitude: number, longitude: number): string {
  return `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
}

export default function Weather(): React.ReactElement {
  const stored = useMemo(() => loadStoredPreferences(), []);

  const [unit, setUnit] = useState<TemperatureUnit>(stored.unit);
  const [location, setLocation] = useState<WeatherLocation | null>(stored.location);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<WeatherRequestStatus>("idle");
  const [error, setError] = useState<WeatherErrorInfo | null>(null);
  const [permission, setPermission] = useState<GeolocationPermissionState>("unknown");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showManualSearch, setShowManualSearch] = useState<boolean>(false);

  const hasRequestedInitialLocation = useRef(false);

  const loadWeatherFor = useCallback(async (nextLocation: WeatherLocation) => {
    setStatus("loading");
    setError(null);
    try {
      const data = await fetchWeatherData(nextLocation);
      setWeather(data);
      setStatus("success");
    } catch {
      setStatus("error");
      setError({
        message: "We couldn't load the weather right now. Please try again in a moment.",
        kind: "network",
      });
    }
  }, []);

  const requestBrowserLocation = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setPermission("unsupported");
      setShowManualSearch(true);
      setError({
        message: "Your browser doesn't support automatic location detection.",
        kind: "geolocation-unsupported",
      });
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const coords = await getBrowserCoordinates(GEOLOCATION_OPTIONS);
      setPermission("granted");
      const detectedLocation: WeatherLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        name: reverseGeocodeName(coords.latitude, coords.longitude),
        source: "geolocation",
      };
      setLocation(detectedLocation);
      saveLocationPreference(detectedLocation);
      await loadWeatherFor(detectedLocation);
    } catch (err) {
      const geoError = err as GeolocationPositionError;
      if (geoError && geoError.code === 1) {
        setPermission("denied");
        setShowManualSearch(true);
        setError({
          message: "Location access was denied. Search for a city instead.",
          kind: "permission-denied",
        });
      } else {
        setShowManualSearch(true);
        setError({
          message: "We couldn't determine your location. Search for a city instead.",
          kind: "unknown",
        });
      }
      setStatus("error");
    }
  }, [loadWeatherFor]);

  useEffect(() => {
    if (hasRequestedInitialLocation.current) return;
    hasRequestedInitialLocation.current = true;

    if (stored.location) {
      setPermission("granted");
      void loadWeatherFor(stored.location);
      return;
    }

    void requestBrowserLocation();
  }, [loadWeatherFor, requestBrowserLocation, stored.location]);

  const handleUnitToggle = useCallback((nextUnit: TemperatureUnit) => {
    setUnit(nextUnit);
    saveUnitPreference(nextUnit);
  }, []);

  const handleSearchSubmit = useCallback(async () => {
    const trimmed = searchQuery.trim();
    if (trimmed.length === 0) return;

    setIsSearching(true);
    setError(null);
    try {
      const results = await searchLocations(trimmed);
      setSearchResults(results);
      if (results.length === 0) {
        setError({
          message: `No locations found for "${trimmed}".`,
          kind: "not-found",
        });
      }
    } catch {
      setError({
        message: "Location search failed. Please try again.",
        kind: "network",
      });
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSelectResult = useCallback(
    async (result: GeocodingResult) => {
      const nextLocation = geocodingResultToLocation(result);
      setLocation(nextLocation);
      saveLocationPreference(nextLocation);
      setSearchResults([]);
      setSearchQuery("");
      setShowManualSearch(false);
      await loadWeatherFor(nextLocation);
    },
    [loadWeatherFor],
  );

  const isLoading = status === "loading";
  const currentDescription = weather ? getWeatherDescription(weather.current.weatherCode) : null;
  const todayForecast = weather?.daily[0];
  const reportSummary =
    weather && currentDescription
      ? buildWeatherReportSummary(location ?? weather.location, weather.current, todayForecast, unit, currentDescription)
      : null;
  const dailyTrend = weather ? buildDailyTemperatureTrend(weather.daily, unit) : null;

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Weather report
          </p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            {reportSummary ? reportSummary.placeName : location ? formatLocationName(location) : "Weather"}
          </h2>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => handleUnitToggle("fahrenheit")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              unit === "fahrenheit"
                ? "bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
            aria-pressed={unit === "fahrenheit"}
          >
            °F
          </button>
          <button
            type="button"
            onClick={() => handleUnitToggle("celsius")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              unit === "celsius"
                ? "bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
            aria-pressed={unit === "celsius"}
          >
            °C
          </button>
        </div>
      </div>

      {reportSummary && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">
          <span className="text-slate-700 dark:text-slate-200">{reportSummary.headline}</span>
          <span className="text-slate-500 dark:text-slate-400">
            H: {reportSummary.highLabel} · L: {reportSummary.lowLabel} · as of{" "}
            {reportSummary.reportedAt}
          </span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12 text-slate-500 dark:text-slate-400">
          <span>Loading weather…</span>
        </div>
      )}

      {!isLoading && error && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          <p className="mb-2">{error.message}</p>
          {error.kind === "permission-denied" || error.kind === "geolocation-unsupported" ? (
            <button
              type="button"
              onClick={() => setShowManualSearch(true)}
              className="font-medium underline"
            >
              Search for a location
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void requestBrowserLocation()}
              className="font-medium underline"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {!isLoading && weather && currentDescription && (
        <div className="mb-6">
          <div className="flex items-end gap-4">
            <span className="text-5xl font-bold text-slate-900 dark:text-slate-50">
              {formatTemperature(weather.current.temperature, unit)}
            </span>
            <div className="pb-1">
              <p className="font-medium text-slate-800 dark:text-slate-100">
                {currentDescription.label}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Feels like {formatTemperature(weather.current.apparentTemperature, unit)}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Humidity</p>
              <p className="font-medium text-slate-900 dark:text-slate-50">
                {weather.current.relativeHumidity}%
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Wind</p>
              <p className="font-medium text-slate-900 dark:text-slate-50">
                {formatWindSpeed(weather.current.windSpeed, unit)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Precipitation</p>
              <p className="font-medium text-slate-900 dark:text-slate-50">
                {weather.current.precipitation} mm
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Updated</p>
              <p className="font-medium text-slate-900 dark:text-slate-50">
                {formatClockTime(weather.current.time)}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && weather && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Next 24 hours
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {weather.hourly.slice(0, 12).map((hour) => {
              const description = getWeatherDescription(hour.weatherCode);
              return (
                <div
                  key={hour.time}
                  className="flex min-w-[64px] flex-col items-center gap-1 rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800"
                >
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatHourLabel(hour.time)}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {formatTemperature(hour.temperature, unit)}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {description.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!isLoading && weather && dailyTrend && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            7-day temperature trend
          </h3>
          <TemperatureTrendGraph
            high={dailyTrend.high}
            low={dailyTrend.low}
            minValue={dailyTrend.minValue}
            maxValue={dailyTrend.maxValue}
            unit={unit}
          />
        </div>
      )}

      {!isLoading && weather && (
        <div className="mb-2">
          <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            7-day forecast
          </h3>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {weather.daily.map((day) => {
              const description = getWeatherDescription(day.weatherCode);
              return (
                <li key={day.date} className="flex items-center justify-between py-2 text-sm">
                  <span className="w-12 font-medium text-slate-700 dark:text-slate-200">
                    {formatDayLabel(day.date)}
                  </span>
                  <span className="flex-1 text-slate-500 dark:text-slate-400">
                    {description.label}
                  </span>
                  <span className="text-slate-900 dark:text-slate-50">
                    {formatTemperature(day.temperatureMax, unit)} /{" "}
                    <span className="text-slate-400 dark:text-slate-500">
                      {formatTemperature(day.temperatureMin, unit)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {(showManualSearch || permission === "denied" || permission === "unsupported") && (
        <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
          <label
            htmlFor="weather-location-search"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Search for a location
          </label>
          <div className="flex gap-2">
            <input
              id="weather-location-search"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleSearchSubmit();
                }
              }}
              placeholder="City name, e.g. Austin"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
            />
            <button
              type="button"
              onClick={() => void handleSearchSubmit()}
              disabled={isSearching}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
            >
              {isSearching ? "Searching…" : "Search"}
            </button>
          </div>

          {searchResults.length > 0 && (
            <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-100 dark:divide-slate-800 dark:border-slate-800">
              {searchResults.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    onClick={() => void handleSelectResult(result)}
                    className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="font-medium text-slate-900 dark:text-slate-50">
                      {result.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {[result.admin1, result.country].filter(Boolean).join(", ")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}