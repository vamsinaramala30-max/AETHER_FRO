/**
 * Weather.tsx
 * Weather Details screen (current conditions + hourly/daily forecast +
 * details + air quality, one scrollable page) and the City Management
 * screen. Real device location + real Open-Meteo data only — no mock values.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Eye,
  Gauge,
  HelpCircle,
  MapPin,
  Moon,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  SunMedium,
  Sun,
  Trash2,
  Wind,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  fetchWeatherBundle,
  getCurrentPosition,
  reverseGeocode,
  searchLocations,
} from "./weather-api";
import { STORAGE_KEYS, TIMINGS } from "./weather-constants";
import type {
  AirQuality,
  CurrentWeather,
  DailyWeatherPoint,
  GeocodingResult,
  HourlyWeatherPoint,
  LocationPermissionState,
  SavedLocation,
  TemperatureUnit,
  WeatherData,
  WeatherLocation,
  WeatherState,
  WeatherView,
} from "./weather-types";
import {
  buildSmoothPath,
  formatHumidity,
  formatPressure,
  formatShortDate,
  formatTemperature,
  formatVisibility,
  getAqiCategory,
  getBeaufortForce,
  getHourlySlotLabel,
  getRelativeDayLabel,
  getTodayInTimezone,
  getWeatherAriaLabel,
  getWeatherCondition,
  getWeatherIconKey,
  getWindDirectionLabel,
  groupHourlyByDate,
  isCurrentHour,
  mapValuesToPoints,
  safeGetStorage,
  safeSetStorage,
  type WeatherIconKey,
} from "./weather-utils";

import "./weather.css";

/* ============================================================================
 * Weather icon
 * ========================================================================== */

const WEATHER_ICON_COMPONENTS: Record<WeatherIconKey, LucideIcon> = {
  sun: Sun,
  moon: Moon,
  "cloud-sun": CloudSun,
  "cloud-moon": CloudMoon,
  cloud: Cloud,
  "cloud-fog": CloudFog,
  "cloud-drizzle": CloudDrizzle,
  "cloud-rain": CloudRain,
  "cloud-snow": CloudSnow,
  "cloud-lightning": CloudLightning,
  "help-circle": HelpCircle,
};

function WeatherIcon({
  code,
  isDay,
  size = 26,
}: {
  code: number;
  isDay: boolean;
  size?: number;
}) {
  const Icon = WEATHER_ICON_COMPONENTS[getWeatherIconKey(code, isDay)];
  return (
    <span role="img" aria-label={getWeatherAriaLabel(code, isDay)} style={{ color: "var(--accent-cyan)" }}>
      <Icon size={size} />
    </span>
  );
}

/* ============================================================================
 * Small building blocks
 * ========================================================================== */

function Skeleton({ width, height, radius = 8 }: { width: string; height: string; radius?: number }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

function IconButton({
  label,
  onClick,
  children,
  variant,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  variant?: "text";
}) {
  return (
    <button
      type="button"
      className={variant === "text" ? "icon-btn icon-btn--text" : "icon-btn"}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ============================================================================
 * Hooks
 * ========================================================================== */

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

function useSavedLocations() {
  const [locations, setLocations] = useState<SavedLocation[]>(() =>
    safeGetStorage<SavedLocation[]>(STORAGE_KEYS.SAVED_LOCATIONS, [])
  );

  const addLocation = useCallback((location: WeatherLocation) => {
    setLocations((prev) => {
      const isDuplicate = prev.some(
        (item) =>
          Math.abs(item.latitude - location.latitude) < 0.05 &&
          Math.abs(item.longitude - location.longitude) < 0.05
      );
      if (isDuplicate) return prev;
      const next: SavedLocation[] = [
        ...prev,
        {
          ...location,
          id: `${location.latitude.toFixed(3)}-${location.longitude.toFixed(3)}-${Date.now()}`,
          isCurrentLocation: false,
          savedAt: Date.now(),
        },
      ];
      safeSetStorage(STORAGE_KEYS.SAVED_LOCATIONS, next);
      return next;
    });
  }, []);

  const removeLocation = useCallback((id: string) => {
    setLocations((prev) => {
      const next = prev.filter((item) => item.id !== id);
      safeSetStorage(STORAGE_KEYS.SAVED_LOCATIONS, next);
      return next;
    });
  }, []);

  return { locations, addLocation, removeLocation };
}

/** Lightweight per-card weather summary, used by City Management list items. */
function useLocationSummary(location: WeatherLocation) {
  const [summary, setSummary] = useState<{
    current: CurrentWeather;
    daily: DailyWeatherPoint | null;
  } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetchWeatherBundle(location, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      if (result.ok) {
        setSummary({ current: result.data.current, daily: result.data.daily[0] ?? null });
        setStatus("ready");
      } else if (!result.aborted) {
        setStatus("error");
      }
    });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.latitude, location.longitude]);

  return { summary, status };
}

/* ============================================================================
 * Weather Details subsections
 * ========================================================================== */

function CurrentWeatherHero({
  location,
  current,
  unit,
  weatherState,
}: {
  location: WeatherLocation | null;
  current: CurrentWeather | null;
  unit: TemperatureUnit;
  weatherState: WeatherState;
}) {
  const isLoading = weatherState === "locating" || weatherState === "loading-weather";
  const condition = current ? getWeatherCondition(current.weatherCode) : null;

  return (
    <div className="weather-hero">
      {isLoading || !current ? (
        <>
          <div className="weather-hero__temp-row">
            <Skeleton width="200px" height="100px" radius={20} />
          </div>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Skeleton width="120px" height="20px" />
            <Skeleton width="160px" height="16px" />
          </div>
        </>
      ) : (
        <>
          <div className="weather-hero__temp-row">
            <span className="weather-hero__temp">{formatTemperature(current.temperature, unit)}</span>
            <span className="weather-hero__unit">°{unit === "fahrenheit" ? "F" : "C"}</span>
          </div>
          <div className="weather-hero__condition">
            {condition?.label ?? "Unavailable"}
          </div>
          <div className="weather-hero__range">
            {location ? (
              <>
                Feels like {formatTemperature(current.apparentTemperature, unit, { withUnit: true })}
              </>
            ) : (
              "Unavailable"
            )}
          </div>
        </>
      )}
    </div>
  );
}

function HourlyForecastSection({
  hourly,
  timezone,
  unit,
  isLoading,
  dayLabel,
}: {
  hourly: HourlyWeatherPoint[];
  timezone: string;
  unit: TemperatureUnit;
  isLoading: boolean;
  /** e.g. "Today" / "Tomorrow" / "Friday" — which day this hourly strip belongs to. */
  dayLabel: string;
}) {
  return (
    <section className="weather-section" aria-label={`Hourly forecast for ${dayLabel}`}>
      <h2 className="weather-section__heading">Hourly Forecast · {dayLabel}</h2>
      <div className="hourly-scroll">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
            <div className="hourly-item" key={i}>
              <Skeleton width="34px" height="12px" />
              <Skeleton width="26px" height="26px" radius={13} />
              <Skeleton width="30px" height="14px" />
            </div>
          ))
          : hourly.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Hourly data unavailable for this day.
            </p>
          ) : (
            hourly.map((hour) => {
              const isNow = isCurrentHour(hour.time, timezone);
              return (
                <div className="hourly-item" key={hour.time}>
                  <span className={`hourly-item__label${isNow ? " hourly-item__label--now" : ""}`}>
                    {getHourlySlotLabel(hour.time, timezone, isNow)}
                  </span>
                  <WeatherIcon code={hour.weatherCode} isDay={hour.isDay} size={24} />
                  <span className="hourly-item__temp">
                    {formatTemperature(hour.temperature, unit, { withUnit: true })}
                  </span>
                </div>
              );
            })
          )}
      </div>
    </section>
  );
}

function TemperatureChart({
  hourly,
  unit,
}: {
  hourly: HourlyWeatherPoint[];
  unit: TemperatureUnit;
}) {
  const width = 600;
  const height = 120;

  const { path, firstPoint, maxY } = useMemo(() => {
    const temps = hourly.map((h) => h.temperature);
    const points = mapValuesToPoints(temps, width, height, 24);
    return {
      path: buildSmoothPath(points),
      firstPoint: points[0] ?? null,
      maxY: points.length ? Math.min(...points.map((p) => p.y)) : 24,
    };
  }, [hourly]);

  if (hourly.length < 2) return null;

  const currentLabel = formatTemperature(hourly[0].temperature, unit, { withUnit: true });

  return (
    <div className="chart-wrap" aria-hidden="true">
      <svg viewBox={`0 0 ${width} ${height + 40}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="tempLineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffb454" />
            <stop offset="55%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#6ee7a8" />
          </linearGradient>
        </defs>

        {/* Reference dashed line at the peak level */}
        <line
          x1={0}
          y1={maxY}
          x2={width}
          y2={maxY}
          stroke="rgba(255,255,255,0.18)"
          strokeDasharray="4 6"
          strokeWidth={1}
        />

        {path && <path d={path} fill="none" stroke="url(#tempLineGradient)" strokeWidth={3} strokeLinecap="round" />}

        {firstPoint && (
          <>
            <line
              x1={firstPoint.x}
              y1={firstPoint.y}
              x2={firstPoint.x}
              y2={height + 30}
              stroke="rgba(255,255,255,0.18)"
              strokeDasharray="2 5"
              strokeWidth={1}
            />
            <circle cx={firstPoint.x} cy={firstPoint.y} r={7} fill="#0b1226" stroke="#ffb454" strokeWidth={3} />
            <text
              x={Math.min(Math.max(firstPoint.x, 26), width - 26)}
              y={firstPoint.y - 16}
              fill="#ffffff"
              fontSize="18"
              fontWeight={700}
              textAnchor="middle"
            >
              {currentLabel}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

function DailyForecastSection({
  daily,
  timezone,
  unit,
  isLoading,
  selectedDate,
  onSelectDay,
}: {
  daily: DailyWeatherPoint[];
  timezone: string;
  unit: TemperatureUnit;
  isLoading: boolean;
  selectedDate: string | null;
  onSelectDay: (date: string) => void;
}) {
  return (
    <section className="weather-section" aria-label="Daily forecast">
      <h2 className="weather-section__heading">7-Day Forecast</h2>
      <p className="weather-section__hint">Tap a day to see its hourly forecast above.</p>
      <div className="daily-list" role="tablist" aria-label="Select a day">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
            <div className="daily-row" key={i}>
              <Skeleton width="40px" height="12px" />
              <Skeleton width="70px" height="14px" />
              <Skeleton width="24px" height="24px" radius={12} />
              <Skeleton width="24px" height="14px" />
              <Skeleton width="28px" height="14px" />
            </div>
          ))
          : daily.map((day) => {
            const isSelected = day.date === selectedDate;
            return (
              <button
                type="button"
                key={day.date}
                role="tab"
                aria-selected={isSelected}
                className={`daily-row${isSelected ? " daily-row--selected" : ""}`}
                onClick={() => onSelectDay(day.date)}
              >
                <span className="daily-row__date">{formatShortDate(day.date, timezone)}</span>
                <span className="daily-row__label">{getRelativeDayLabel(day.date, timezone)}</span>
                <WeatherIcon code={day.weatherCode} isDay size={22} />
                <span className="daily-row__min">{formatTemperature(day.temperatureMin, unit)}°</span>
                <span className="daily-row__max">{formatTemperature(day.temperatureMax, unit)}°</span>
              </button>
            );
          })}
      </div>
    </section>
  );
}

function WeatherDetailsCard({
  current,
  unit,
  isLoading,
}: {
  current: CurrentWeather | null;
  unit: TemperatureUnit;
  isLoading: boolean;
}) {
  const items: Array<{ label: string; value: string; icon: LucideIcon }> = current
    ? [
      {
        label: "Feels like",
        value: formatTemperature(current.apparentTemperature, unit, { withUnit: true }),
        icon: SunMedium,
      },
      {
        label: getWindDirectionLabel(current.windDirectionDeg),
        value: current.windSpeedKmh !== null ? getBeaufortForce(current.windSpeedKmh) : "Unavailable",
        icon: Wind,
      },
      { label: "Humidity", value: formatHumidity(current.humidity), icon: Droplets },
      { label: "UV", value: formatUvLabel(current.uvIndex), icon: SunMedium },
      { label: "Visibility", value: formatVisibility(current.visibilityMeters), icon: Eye },
      { label: "Pressure", value: formatPressure(current.pressureHpa), icon: Gauge },
    ]
    : [];

  return (
    <section className="weather-section" aria-label="Weather details">
      <div className="card">
        <div className="details-grid">
          {isLoading || !current
            ? Array.from({ length: 6 }).map((_, i) => (
              <div className="details-grid__item" key={i}>
                <Skeleton width="22px" height="22px" radius={11} />
                <Skeleton width="50px" height="10px" />
                <Skeleton width="40px" height="14px" />
              </div>
            ))
            : items.map((item) => {
              const Icon = item.icon;
              return (
                <div className="details-grid__item" key={item.label}>
                  <Icon size={22} />
                  <span className="details-grid__label">{item.label}</span>
                  <span className="details-grid__value">{item.value}</span>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

function formatUvLabel(uv: number | null): string {
  if (uv === null || Number.isNaN(uv)) return "Unavailable";
  const descriptor =
    uv < 3 ? "Weaker" : uv < 6 ? "Moderate" : uv < 8 ? "High" : uv < 11 ? "Very High" : "Extreme";
  return descriptor;
}

function AirQualitySection({
  airQuality,
  isLoading,
}: {
  airQuality: AirQuality | null;
  isLoading: boolean;
}) {
  const category = airQuality ? getAqiCategory(airQuality.europeanAqi) : null;
  const aqiValue = airQuality?.europeanAqi ?? null;
  const barPosition = aqiValue !== null ? Math.min(100, (aqiValue / 100) * 100) : null;

  const pollutants: Array<{ label: string; value: number | null; unit: string; max: number }> = airQuality
    ? [
      { label: "PM2.5", value: airQuality.pm2_5, unit: "", max: 75 },
      { label: "PM10", value: airQuality.pm10, unit: "", max: 150 },
      { label: "CO", value: airQuality.carbonMonoxide, unit: "", max: 100 },
      { label: "SO2", value: airQuality.sulphurDioxide, unit: "", max: 100 },
    ]
    : [];

  return (
    <section className="weather-section" aria-label="Air quality">
      <h2 className="weather-section__heading">Air Quality</h2>
      <div className="card">
        {isLoading ? (
          <>
            <Skeleton width="100px" height="34px" />
            <div style={{ marginTop: 16 }}>
              <Skeleton width="100%" height="8px" radius={999} />
            </div>
          </>
        ) : !airQuality || aqiValue === null || !category ? (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>Air quality unavailable</p>
        ) : (
          <>
            <div className="aqi-headline">
              <span className="aqi-value">{Math.round(aqiValue)}</span>
              <span className="aqi-label">{category.label}</span>
            </div>
            <div className="aqi-bar-track" role="img" aria-label={`Air quality index ${Math.round(aqiValue)}, ${category.label}`}>
              {barPosition !== null && (
                <span className="aqi-bar-thumb" style={{ left: `${barPosition}%` }} />
              )}
            </div>
            <div className="aqi-bar-endpoints">
              <span>I</span>
              <span>VI</span>
            </div>
            <div className="aqi-pollutants">
              {pollutants.map((pollutant) => (
                <div className="aqi-pollutant" key={pollutant.label}>
                  <div className="aqi-pollutant__label">{pollutant.label}</div>
                  <div className="aqi-pollutant__value">
                    {pollutant.value === null ? "--" : Math.round(pollutant.value)}
                  </div>
                  <div className="aqi-pollutant__bar">
                    <div
                      className="aqi-pollutant__bar-fill"
                      style={{
                        width:
                          pollutant.value === null
                            ? "0%"
                            : `${Math.min(100, (pollutant.value / pollutant.max) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ============================================================================
 * Permission / error states
 * ========================================================================== */

function LocationStateCard({
  weatherState,
  permissionState,
  errorMessage,
  onRetryLocation,
  onSearchCity,
}: {
  weatherState: WeatherState;
  permissionState: LocationPermissionState;
  errorMessage: string | null;
  onRetryLocation: () => void;
  onSearchCity: () => void;
}) {
  const copy: Record<string, { title: string; body: string }> = {
    denied: {
      title: "Location permission needed",
      body: "Allow location access to see automatic weather for where you are, or search for a city instead.",
    },
    unavailable: {
      title: "Unable to access your location",
      body: "We couldn't determine your position. You can try again or search for a city.",
    },
    unsupported: {
      title: "Location isn't supported here",
      body: "Your browser doesn't support location services. Search for a city to see its weather.",
    },
    error: {
      title: "Something went wrong",
      body: errorMessage || "Weather data is currently unavailable. Please try again.",
    },
  };

  let key: keyof typeof copy | null = null;
  if (weatherState === "location-denied") key = "denied";
  else if (weatherState === "location-unavailable") key = "unavailable";
  else if (weatherState === "geolocation-unsupported") key = "unsupported";
  else if (weatherState === "weather-error") key = "error";

  if (!key) return null;
  const content = copy[key];
  const canRetryLocation = permissionState !== "unsupported";

  return (
    <div className="state-card">
      <MapPin size={28} />
      <p className="state-card__title">{content.title}</p>
      <p className="state-card__body">{content.body}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        {canRetryLocation && (
          <button type="button" className="btn-primary" onClick={onRetryLocation}>
            Try again
          </button>
        )}
        <button type="button" className="btn-secondary" onClick={onSearchCity}>
          Search for a city
        </button>
      </div>
    </div>
  );
}

/**
 * First-run screen. Geolocation must be requested from a real click/tap in
 * most mobile browsers and embedded webviews — requesting it automatically
 * on page load is frequently blocked silently. This screen puts an explicit
 * button in front of the person instead.
 */
function UseLocationPrompt({
  onUseLocation,
  onSearchCity,
}: {
  onUseLocation: () => void;
  onSearchCity: () => void;
}) {
  return (
    <div className="state-card">
      <MapPin size={28} />
      <p className="state-card__title">See weather for where you are</p>
      <p className="state-card__body">
        Tap below to allow location access, or search for any city or village worldwide instead.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <button type="button" className="btn-primary" onClick={onUseLocation}>
          Use my location
        </button>
        <button type="button" className="btn-secondary" onClick={onSearchCity}>
          Search for a city
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * City Management screen
 * ========================================================================== */

function CityCard({
  location,
  unit,
  editMode,
  onSelect,
  onDelete,
}: {
  location: SavedLocation;
  unit: TemperatureUnit;
  editMode: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { summary, status } = useLocationSummary(location);
  const condition = summary ? getWeatherCondition(summary.current.weatherCode) : null;

  return (
    <div className="city-card">
      <button type="button" className="city-card__button" onClick={onSelect} disabled={editMode}>
        <div style={{ minWidth: 0 }}>
          <div className="city-card__name">{location.name}</div>
          <div className="city-card__meta">
            {status === "loading" && "Loading…"}
            {status === "error" && "Weather unavailable"}
            {status === "ready" && summary && (
              <>
                {condition?.label ?? "Unavailable"}
                {"  "}
                {formatTemperature(summary.daily?.temperatureMin ?? null, unit)}
                {" ~ "}
                {formatTemperature(summary.daily?.temperatureMax ?? null, unit, { withUnit: true })}
              </>
            )}
          </div>
        </div>
        <div className="city-card__temp">
          {status === "ready" && summary ? (
            <>
              {formatTemperature(summary.current.temperature, unit)}
              <span className="city-card__temp-unit">°{unit === "fahrenheit" ? "F" : "C"}</span>
            </>
          ) : (
            <Skeleton width="46px" height="34px" />
          )}
        </div>
      </button>
      {editMode && (
        <button type="button" className="city-card__delete" aria-label={`Remove ${location.name}`} onClick={onDelete}>
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}

function CityManagementScreen({
  savedLocations,
  unit,
  onBack,
  onSelectLocation,
  onDeleteLocation,
  onAddLocation,
}: {
  savedLocations: SavedLocation[];
  unit: TemperatureUnit;
  onBack: () => void;
  onSelectLocation: (location: WeatherLocation) => void;
  onDeleteLocation: (id: string) => void;
  onAddLocation: (location: WeatherLocation) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, TIMINGS.SEARCH_DEBOUNCE_MS);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "empty">("idle");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();

    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("loading");

    searchLocations(trimmed, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      if (result.ok) {
        setResults(result.data);
        setStatus(result.data.length === 0 ? "empty" : "idle");
      } else if (!result.aborted) {
        setResults([]);
        setStatus("error");
      }
    });

    return () => controller.abort();
  }, [debouncedQuery]);

  const handleSelectResult = useCallback(
    (result: GeocodingResult) => {
      onAddLocation(result);
      onSelectLocation(result);
      setQuery("");
      setResults([]);
      setStatus("idle");
    },
    [onAddLocation, onSelectLocation]
  );

  return (
    <div className="weather-root city-mgmt">
      <div className="weather-screen">
        <div className="weather-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <IconButton label="Back" onClick={onBack}>
              <ArrowLeft size={22} />
            </IconButton>
            <span className="weather-topbar__title" style={{ fontSize: "1.3rem" }}>
              City management
            </span>
          </div>
          <div className="weather-topbar__actions">
            <IconButton label={editMode ? "Done editing" : "Edit locations"} onClick={() => setEditMode((v) => !v)}>
              <Pencil size={20} />
            </IconButton>
            <IconButton label="Add city" onClick={() => document.getElementById("city-search-input")?.focus()}>
              <Plus size={22} />
            </IconButton>
          </div>
        </div>

        <div className="city-mgmt__searchbar">
          <Search size={18} color="rgba(20,23,43,0.45)" />
          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for city weather"
            aria-label="Search for city weather"
            autoComplete="off"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={18} color="rgba(20,23,43,0.45)" />
            </button>
          )}
        </div>

        {query.trim().length >= 2 && (
          <div className="city-mgmt__results" role="listbox" aria-label="City search results">
            {status === "loading" && (
              <div style={{ padding: 16 }}>
                <Skeleton width="60%" height="16px" />
              </div>
            )}
            {status === "error" && (
              <div style={{ padding: 16, color: "rgba(20,23,43,0.6)" }}>Unable to find this city.</div>
            )}
            {status === "empty" && (
              <div style={{ padding: 16, color: "rgba(20,23,43,0.6)" }}>No matching cities found.</div>
            )}
            {results.map((result) => (
              <button
                type="button"
                key={result.id}
                className="city-mgmt__result"
                role="option"
                aria-selected={false}
                onClick={() => handleSelectResult(result)}
              >
                <span className="city-mgmt__result-name">{result.name}</span>
                <span className="city-mgmt__result-sub">
                  {[result.admin1, result.country].filter(Boolean).join(", ") || "Unknown region"}
                </span>
              </button>
            ))}
          </div>
        )}

        {savedLocations.length === 0 ? (
          <p className="city-mgmt__empty">
            No saved cities yet. Search above to add one, or allow location access to add your current city.
          </p>
        ) : (
          <div className="city-mgmt__list">
            {savedLocations.map((location) => (
              <CityCard
                key={location.id}
                location={location}
                unit={unit}
                editMode={editMode}
                onSelect={() => onSelectLocation(location)}
                onDelete={() => onDeleteLocation(location.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
 * Main Weather component
 * ========================================================================== */

export default function Weather() {
  const [view, setView] = useState<WeatherView>("details");
  const [unit] = useState<TemperatureUnit>("celsius");
  const [permissionState, setPermissionState] = useState<LocationPermissionState>("prompt");
  const [weatherState, setWeatherState] = useState<WeatherState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState<WeatherLocation | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  /** Which day's hourly strip + chart is on screen (YYYY-MM-DD, in the
   *  active location's timezone). Defaults to the first daily entry (today)
   *  whenever a new location's weather loads. */
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { locations: savedLocations, addLocation, removeLocation } = useSavedLocations();
  const weatherAbortRef = useRef<AbortController | null>(null);

  const loadWeatherFor = useCallback(async (location: WeatherLocation, skipCache = false) => {
    weatherAbortRef.current?.abort();
    const controller = new AbortController();
    weatherAbortRef.current = controller;

    setActiveLocation(location);
    setWeatherState("loading-weather");
    setErrorMessage(null);

    const result = await fetchWeatherBundle(location, controller.signal, { skipCache });
    if (controller.signal.aborted) return;

    if (result.ok) {
      setWeatherData(result.data);
      setActiveLocation(result.data.location);
      // Jump back to "today" whenever a different location's data loads.
      setSelectedDate(result.data.daily[0]?.date ?? getTodayInTimezone(result.data.location.timezone));
      setWeatherState("weather-loaded");
      // Remember this as the last-viewed location so a page reload can show
      // weather immediately without needing another location-permission
      // prompt (which browsers require a fresh tap/click to trigger).
      safeSetStorage(STORAGE_KEYS.LAST_LOCATION, result.data.location);
    } else if (!result.aborted) {
      setWeatherState("weather-error");
      setErrorMessage(result.error);
    }
  }, []);

  const requestDeviceLocation = useCallback(async () => {
    setPermissionState("locating");
    setWeatherState("locating");
    setErrorMessage(null);

    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setPermissionState("unavailable");
      setWeatherState("location-unavailable");
      setErrorMessage(
        "Location access requires a secure (https) connection. Search for a city instead."
      );
      return;
    }

    const position = await getCurrentPosition();
    if (!position.ok) {
      const stateMap: Record<string, { permission: LocationPermissionState; weather: WeatherState }> = {
        denied: { permission: "denied", weather: "location-denied" },
        unavailable: { permission: "unavailable", weather: "location-unavailable" },
        unsupported: { permission: "unsupported", weather: "geolocation-unsupported" },
        timeout: { permission: "unavailable", weather: "location-unavailable" },
      };
      const mapped = stateMap[position.error.kind] ?? stateMap.unavailable;
      setPermissionState(mapped.permission);
      setWeatherState(mapped.weather);
      setErrorMessage(position.error.message);
      return;
    }

    setPermissionState("granted");
    const geo = await reverseGeocode(position.coords.latitude, position.coords.longitude);
    if (!geo.ok) {
      // reverseGeocode is designed to always resolve ok=true with a fallback name,
      // but guard defensively regardless.
      setWeatherState("weather-error");
      setErrorMessage("Weather data is currently unavailable.");
      return;
    }
    await loadWeatherFor(geo.data);
  }, [loadWeatherFor]);

  // On mount: if we already have a remembered location (from a previous
  // visit / previous successful geolocation or search), load it straight
  // away. Otherwise, DO NOT call geolocation automatically — many mobile
  // browsers and embedded webviews silently refuse geolocation prompts
  // that aren't triggered by a direct user tap, which is why "auto"
  // requests can look like they "don't work". Instead we show an explicit
  // "Use my location" button (see the idle state below).
  useEffect(() => {
    const lastLocation = safeGetStorage<WeatherLocation | null>(STORAGE_KEYS.LAST_LOCATION, null);
    if (lastLocation) {
      loadWeatherFor(lastLocation);
    }
    return () => {
      weatherAbortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectSavedLocation = useCallback(
    (location: WeatherLocation) => {
      setView("details");
      loadWeatherFor(location);
    },
    [loadWeatherFor]
  );

  const handleAddLocation = useCallback(
    (location: WeatherLocation) => {
      addLocation(location);
    },
    [addLocation]
  );

  const hourlyByDate = useMemo(
    () =>
      weatherData
        ? groupHourlyByDate(weatherData.hourly, weatherData.location.timezone)
        : new Map<string, HourlyWeatherPoint[]>(),
    [weatherData]
  );

  const effectiveSelectedDate = selectedDate ?? weatherData?.daily[0]?.date ?? null;
  const selectedDayHourly = effectiveSelectedDate ? hourlyByDate.get(effectiveSelectedDate) ?? [] : [];
  const selectedDayLabel = effectiveSelectedDate && activeLocation
    ? getRelativeDayLabel(effectiveSelectedDate, activeLocation.timezone)
    : "Today";

  const isLoading = weatherState === "locating" || weatherState === "loading-weather";
  const isIdle = weatherState === "idle";
  const showStateCard =
    weatherState === "location-denied" ||
    weatherState === "location-unavailable" ||
    weatherState === "geolocation-unsupported" ||
    weatherState === "weather-error";

  if (view === "city-management") {
    return (
      <CityManagementScreen
        savedLocations={savedLocations}
        unit={unit}
        onBack={() => setView("details")}
        onSelectLocation={handleSelectSavedLocation}
        onDeleteLocation={removeLocation}
        onAddLocation={handleAddLocation}
      />
    );
  }

  const locationName = activeLocation?.name ?? (isLoading ? "Locating…" : "Weather");

  return (
    <div className="weather-root">
      <div className="weather-screen">
        <div className="weather-topbar">
          <span className="weather-topbar__title">{locationName}</span>
          <div className="weather-topbar__actions">
            {!isIdle && (
              <IconButton
                label="Refresh weather"
                onClick={() => activeLocation && loadWeatherFor(activeLocation, true)}
              >
                <RefreshCw size={19} />
              </IconButton>
            )}
            <IconButton label="Manage cities" onClick={() => setView("city-management")}>
              <MapPin size={20} />
            </IconButton>
          </div>
        </div>

        {isIdle ? (
          <UseLocationPrompt onUseLocation={requestDeviceLocation} onSearchCity={() => setView("city-management")} />
        ) : showStateCard ? (
          <LocationStateCard
            weatherState={weatherState}
            permissionState={permissionState}
            errorMessage={errorMessage}
            onRetryLocation={requestDeviceLocation}
            onSearchCity={() => setView("city-management")}
          />
        ) : (
          <>
            <CurrentWeatherHero
              location={activeLocation}
              current={weatherData?.current ?? null}
              unit={unit}
              weatherState={weatherState}
            />

            {weatherData && !isLoading && (
              <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: -8 }}>
                {formatTemperature(weatherData.daily[0]?.temperatureMin ?? null, unit)}
                {" ~ "}
                {formatTemperature(weatherData.daily[0]?.temperatureMax ?? null, unit, { withUnit: true })}
              </p>
            )}

            <HourlyForecastSection
              hourly={isLoading ? [] : selectedDayHourly}
              timezone={activeLocation?.timezone ?? "UTC"}
              unit={unit}
              isLoading={isLoading}
              dayLabel={selectedDayLabel}
            />

            {!isLoading && selectedDayHourly.length > 1 && (
              <section className="weather-section" aria-label={`Temperature trend for ${selectedDayLabel}`}>
                <TemperatureChart hourly={selectedDayHourly} unit={unit} />
              </section>
            )}

            <DailyForecastSection
              daily={weatherData?.daily ?? []}
              timezone={activeLocation?.timezone ?? "UTC"}
              unit={unit}
              isLoading={isLoading}
              selectedDate={effectiveSelectedDate}
              onSelectDay={setSelectedDate}
            />

            <WeatherDetailsCard current={weatherData?.current ?? null} unit={unit} isLoading={isLoading} />

            <AirQualitySection airQuality={weatherData?.airQuality ?? null} isLoading={isLoading} />
          </>
        )}
      </div>
    </div>
  );
}
