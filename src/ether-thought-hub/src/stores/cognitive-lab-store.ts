// ─────────────────────────────────────────────────────────────────────────────
// Aether Cognitive Lab — Zustand Store
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import {
  loadResults,
  saveResult,
  loadSettings,
  saveSettings,
  resetAllData,
  loadCoins,
  saveCoins,
  loadCompletedGamesCount,
  saveCompletedGamesCount,
  loadRewardedAttemptIds,
  saveRewardedAttemptIds,
} from "../lib/cognitive-lab/storage";
import { loadOrInitDailyTraining, completeDailyGame } from "../lib/cognitive-lab/daily";
import { calcAccuracy } from "../lib/cognitive-lab/scoring";
import type {
  GameResult,
  GameId,
  PlayerStats,
  DailyTraining,
  CognitivelabSettings,
  DifficultyLevel,
} from "../lib/cognitive-lab/types";

// ─── Store shape ──────────────────────────────────────────────────────────────

interface CognitiveLabState {
  // Raw results history (loaded from storage)
  results: GameResult[];

  // Daily training state
  dailyTraining: DailyTraining | null;

  // Settings
  settings: CognitivelabSettings;

  // Reward / Coins and completed games
  coins: number;
  completedGamesCount: number;
  rewardedAttemptIds: string[];

  // Whether the store has been hydrated from storage
  hydrated: boolean;

  // Actions
  hydrate: () => void;
  recordResult: (result: GameResult) => void;
  completeDailyGame: (gameId: GameId, result: GameResult) => void;
  updateSettings: (patch: Partial<CognitivelabSettings>) => void;
  resetProgress: () => void;
  initDailyTraining: () => void;

  // Reward & Hint Actions
  claimReward: (attemptId: string, scorePercentage: number, difficulty: DifficultyLevel) => number;
  getHintCost: () => number;
  requestHint: () => { success: boolean; cost: number; error?: string };

  // Derived selectors (computed inline)
  getPlayerStats: (gameId: GameId) => PlayerStats;
  getRecentResults: (gameId: GameId, limit?: number) => GameResult[];
  getBestScore: (gameId: GameId) => number | null;
  getLastPlayed: (gameId: GameId) => number | null;
  getOverallStats: () => {
    totalSessions: number;
    totalScore: number;
    avgAccuracy: number;
    gamesPlayed: number;
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCognitiveLabStore = create<CognitiveLabState>()((set, get) => ({
  results: [],
  dailyTraining: null,
  settings: {
    reducedMotion: false,
    showInstructions: true,
    preferDark: true,
  },
  coins: 100,
  completedGamesCount: 0,
  rewardedAttemptIds: [],
  hydrated: false,

  hydrate() {
    if (get().hydrated) return;
    const results = loadResults();
    const settings = loadSettings();
    const dailyTraining = loadOrInitDailyTraining();
    const coins = loadCoins();
    const completedGamesCount = loadCompletedGamesCount();
    const rewardedAttemptIds = loadRewardedAttemptIds();

    set({
      results,
      settings,
      dailyTraining,
      coins,
      completedGamesCount,
      rewardedAttemptIds,
      hydrated: true,
    });
  },

  recordResult(result) {
    saveResult(result);
    // If successful, increment completed games count if not already counted for this attempt
    let nextCount = get().completedGamesCount;
    if (result.isSuccess) {
      nextCount += 1;
      saveCompletedGamesCount(nextCount);
    }
    set((s) => ({
      results: [result, ...s.results].slice(0, 500),
      completedGamesCount: nextCount,
    }));
  },

  claimReward(attemptId, scorePercentage, difficulty) {
    const { rewardedAttemptIds, coins } = get();

    // Prevent duplicate reward for same attempt
    if (rewardedAttemptIds.includes(attemptId)) {
      return 0;
    }

    const nextAttemptIds = [...rewardedAttemptIds, attemptId];
    saveRewardedAttemptIds(nextAttemptIds);

    // Only reward if score >= 60%
    if (scorePercentage < 60) {
      set({ rewardedAttemptIds: nextAttemptIds });
      return 0;
    }

    // Award calculation: Base 50 + (difficulty * 10) + (scorePercentage >= 90 ? 25 : 0)
    const baseReward = 50;
    const difficultyBonus = difficulty * 10;
    const masteryBonus = scorePercentage >= 90 ? 25 : 0;
    const totalAward = baseReward + difficultyBonus + masteryBonus;

    const nextCoins = coins + totalAward;
    saveCoins(nextCoins);

    set({
      coins: nextCoins,
      rewardedAttemptIds: nextAttemptIds,
    });

    return totalAward;
  },

  getHintCost() {
    // First 5 completed games receive FREE hints
    // Starting from completed game 6, hints require coins
    return get().completedGamesCount < 5 ? 0 : 25;
  },

  requestHint() {
    const cost = get().getHintCost();
    const currentCoins = get().coins;

    if (cost > 0 && currentCoins < cost) {
      return {
        success: false,
        cost,
        error: "Not enough coins for this hint.",
      };
    }

    if (cost > 0) {
      const nextCoins = Math.max(0, currentCoins - cost);
      saveCoins(nextCoins);
      set({ coins: nextCoins });
    }

    return {
      success: true,
      cost,
    };
  },

  completeDailyGame(gameId, result) {
    const current = get().dailyTraining;
    if (!current) return;
    const updated = completeDailyGame(current, gameId, result);
    set({ dailyTraining: updated });
  },

  updateSettings(patch) {
    const next = { ...get().settings, ...patch };
    saveSettings(next);
    set({ settings: next });
  },

  resetProgress() {
    resetAllData();
    set({
      results: [],
      dailyTraining: loadOrInitDailyTraining(),
      coins: 100,
      completedGamesCount: 0,
      rewardedAttemptIds: [],
    });
  },

  initDailyTraining() {
    const daily = loadOrInitDailyTraining();
    set({ dailyTraining: daily });
  },

  getPlayerStats(gameId) {
    const results = get().results.filter((r) => r.gameId === gameId);
    if (results.length === 0) {
      return {
        gameId,
        totalSessions: 0,
        totalScore: 0,
        bestScore: 0,
        avgAccuracy: 0,
        avgResponseTimeMs: 0,
        bestStreak: 0,
        lastPlayedAt: null,
        highestDifficulty: 1 as DifficultyLevel,
      };
    }

    const totalScore = results.reduce((s, r) => s + r.score, 0);
    const bestScore = Math.max(...results.map((r) => r.score));
    const avgAccuracy =
      Math.round(
        (results.reduce((s, r) => s + r.accuracy, 0) / results.length) * 10,
      ) / 10;
    const avgResponseTimeMs = Math.round(
      results.reduce((s, r) => s + r.avgResponseTimeMs, 0) / results.length,
    );
    const bestStreak = Math.max(...results.map((r) => r.maxStreak));
    const lastPlayedAt = Math.max(...results.map((r) => r.playedAt));
    const highestDifficulty = Math.max(
      ...results.map((r) => r.difficulty),
    ) as DifficultyLevel;

    return {
      gameId,
      totalSessions: results.length,
      totalScore,
      bestScore,
      avgAccuracy,
      avgResponseTimeMs,
      bestStreak,
      lastPlayedAt,
      highestDifficulty,
    };
  },

  getRecentResults(gameId, limit = 10) {
    return get()
      .results.filter((r) => r.gameId === gameId)
      .slice(0, limit);
  },

  getBestScore(gameId) {
    const results = get().results.filter((r) => r.gameId === gameId);
    if (results.length === 0) return null;
    return Math.max(...results.map((r) => r.score));
  },

  getLastPlayed(gameId) {
    const results = get().results.filter((r) => r.gameId === gameId);
    if (results.length === 0) return null;
    return Math.max(...results.map((r) => r.playedAt));
  },

  getOverallStats() {
    const results = get().results;
    if (results.length === 0) {
      return { totalSessions: 0, totalScore: 0, avgAccuracy: 0, gamesPlayed: 0 };
    }
    const totalScore = results.reduce((s, r) => s + r.score, 0);
    const avgAccuracy = calcAccuracy(
      results.reduce((s, r) => s + r.correctRounds, 0),
      results.reduce((s, r) => s + r.totalRounds, 0),
    );
    const gamesPlayed = new Set(results.map((r) => r.gameId)).size;
    return { totalSessions: results.length, totalScore, avgAccuracy, gamesPlayed };
  },
}));
