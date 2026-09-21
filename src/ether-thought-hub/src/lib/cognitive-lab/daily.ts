// ─────────────────────────────────────────────────────────────────────────────
// Aether Cognitive Lab — Daily Training Selector
// ─────────────────────────────────────────────────────────────────────────────

import { ALL_GAME_IDS, DAILY_GAME_COUNT } from "./constants";
import { loadDailyTraining, saveDailyTraining } from "./storage";
import type { GameId, DailyTraining, GameResult } from "./types";

// ─── Date utilities ───────────────────────────────────────────────────────────

export function todayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${String(y)}-${m}-${d}`;
}

/**
 * Deterministic seeded random (mulberry32).
 * Given the same seed, always produces the same sequence.
 */
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle an array using Fisher-Yates with the given RNG.
 */
function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = result[i];
    const next = result[j];
    if (tmp !== undefined && next !== undefined) {
      result[i] = next;
      result[j] = tmp;
    }
  }
  return result;
}

/**
 * Derive a numeric seed from a date string "YYYY-MM-DD".
 */
function dateSeed(date: string): number {
  return date
    .split("")
    .reduce((acc, char) => acc * 31 + char.charCodeAt(0), 0);
}

/**
 * Get today's game selection deterministically from the date.
 * Same date always yields the same 4 games.
 */
export function getDailyGameIds(date: string = todayDateString()): GameId[] {
  const seed = dateSeed(date);
  const rng = seededRng(seed);
  const shuffled = seededShuffle([...ALL_GAME_IDS], rng);
  return shuffled.slice(0, DAILY_GAME_COUNT);
}

// ─── Load / init daily training ───────────────────────────────────────────────

/**
 * Load today's daily training, initializing it if it doesn't exist or is stale.
 */
export function loadOrInitDailyTraining(): DailyTraining {
  const today = todayDateString();
  const stored = loadDailyTraining();

  if (stored && stored.date === today) {
    return stored;
  }

  // Stale or missing — create fresh daily training for today
  const games = getDailyGameIds(today).map((gameId) => ({
    gameId,
    completed: false,
    result: null,
  }));

  const fresh: DailyTraining = {
    date: today,
    games,
    completedAt: null,
    totalScore: 0,
  };

  saveDailyTraining(fresh);
  return fresh;
}

/**
 * Mark a daily training game as complete with its result.
 * Returns the updated DailyTraining.
 */
export function completeDailyGame(
  daily: DailyTraining,
  gameId: GameId,
  result: GameResult,
): DailyTraining {
  const games = daily.games.map((g) =>
    g.gameId === gameId ? { ...g, completed: true, result } : g,
  );

  const allDone = games.every((g) => g.completed);
  const totalScore = games.reduce((sum, g) => sum + (g.result?.score ?? 0), 0);

  const updated: DailyTraining = {
    ...daily,
    games,
    completedAt: allDone ? Date.now() : null,
    totalScore,
  };

  saveDailyTraining(updated);
  return updated;
}

/**
 * True if the user has completed all daily training games today.
 */
export function isDailyComplete(daily: DailyTraining): boolean {
  return daily.games.every((g) => g.completed);
}

/**
 * Get formatted today daily training stats for UI consumption.
 */
export function getTodayDailyTraining(dailyRecord?: any): {
  date: string;
  recommendedGames: GameId[];
  gamesCompleted: GameId[];
  completed: boolean;
} {
  const dt = loadOrInitDailyTraining();
  const date = dt.date;
  const recommendedGames = dt.games.map((g) => g.gameId);
  const gamesCompleted = dt.games.filter((g) => g.completed).map((g) => g.gameId);
  const completed = isDailyComplete(dt);

  return {
    date,
    recommendedGames,
    gamesCompleted,
    completed,
  };
}
