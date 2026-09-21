// ─────────────────────────────────────────────────────────────────────────────
// Aether Cognitive Lab — Versioned localStorage Persistence Layer
// ─────────────────────────────────────────────────────────────────────────────

import type {
  CognitivelabStorageV1,
  GameResult,
  DailyTraining,
  CognitivelabSettings,
} from "./types";

const STORAGE_KEY = "aether_cognitive_lab_v1";
const CURRENT_VERSION = 1;

const DEFAULT_SETTINGS: CognitivelabSettings = {
  reducedMotion: false,
  showInstructions: true,
  preferDark: true,
};

const DEFAULT_STORAGE: CognitivelabStorageV1 = {
  version: 1,
  results: [],
  dailyTraining: null,
  settings: DEFAULT_SETTINGS,
  coins: 100,
  completedGamesCount: 0,
  rewardedAttemptIds: [],
};

// ─── Read ─────────────────────────────────────────────────────────────────────

function readRaw(): unknown {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function isV1(data: unknown): data is CognitivelabStorageV1 {
  return (
    typeof data === "object" &&
    data !== null &&
    "version" in data &&
    (data as Record<string, unknown>)["version"] === 1
  );
}

export function loadStorage(): CognitivelabStorageV1 {
  const raw = readRaw();
  if (raw === null) return { ...DEFAULT_STORAGE };

  // Future: handle migration from older versions here
  if (isV1(raw)) {
    // Merge with defaults to handle added fields in newer patch versions
    return {
      ...DEFAULT_STORAGE,
      ...raw,
      coins: typeof raw.coins === "number" ? Math.max(0, raw.coins) : DEFAULT_STORAGE.coins,
      completedGamesCount: typeof raw.completedGamesCount === "number" ? Math.max(0, raw.completedGamesCount) : DEFAULT_STORAGE.completedGamesCount,
      rewardedAttemptIds: Array.isArray(raw.rewardedAttemptIds) ? raw.rewardedAttemptIds : DEFAULT_STORAGE.rewardedAttemptIds,
      settings: {
        ...DEFAULT_SETTINGS,
        ...raw.settings,
      },
    };
  }

  // Unknown/corrupt format — return clean defaults, don't crash
  console.warn("[CognitiveLab] Storage format unrecognized, resetting.");
  return { ...DEFAULT_STORAGE };
}

// ─── Write ────────────────────────────────────────────────────────────────────

function writeStorage(data: CognitivelabStorageV1): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Quota exceeded or private browsing — fail silently
    console.warn("[CognitiveLab] Failed to persist storage:", e);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function saveResult(result: GameResult): void {
  const store = loadStorage();
  // Keep last 500 results to avoid bloating storage
  const trimmed = [result, ...store.results].slice(0, 500);
  writeStorage({ ...store, results: trimmed });
}

export function loadResults(): GameResult[] {
  return loadStorage().results;
}

export function saveCoins(coins: number): void {
  const store = loadStorage();
  writeStorage({ ...store, coins: Math.max(0, coins) });
}

export function loadCoins(): number {
  return loadStorage().coins ?? 100;
}

export function saveCompletedGamesCount(count: number): void {
  const store = loadStorage();
  writeStorage({ ...store, completedGamesCount: Math.max(0, count) });
}

export function loadCompletedGamesCount(): number {
  return loadStorage().completedGamesCount ?? 0;
}

export function saveRewardedAttemptIds(ids: string[]): void {
  const store = loadStorage();
  writeStorage({ ...store, rewardedAttemptIds: ids });
}

export function loadRewardedAttemptIds(): string[] {
  return loadStorage().rewardedAttemptIds ?? [];
}

export function saveDailyTraining(daily: DailyTraining): void {
  const store = loadStorage();
  writeStorage({ ...store, dailyTraining: daily });
}

export function loadDailyTraining(): DailyTraining | null {
  return loadStorage().dailyTraining;
}

export function saveSettings(settings: CognitivelabSettings): void {
  const store = loadStorage();
  writeStorage({ ...store, settings });
}

export function loadSettings(): CognitivelabSettings {
  return loadStorage().settings;
}

export function resetAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function exportData(): string {
  return JSON.stringify(loadStorage(), null, 2);
}

/** Version exposed for diagnostics */
export const STORAGE_VERSION = CURRENT_VERSION;
