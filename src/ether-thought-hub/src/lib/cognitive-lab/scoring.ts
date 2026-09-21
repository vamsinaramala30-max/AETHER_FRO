// ─────────────────────────────────────────────────────────────────────────────
// Aether Cognitive Lab — Scoring Engine
// ─────────────────────────────────────────────────────────────────────────────

import { SCORE_CONFIG } from "./constants";
import type { DifficultyLevel, RoundResult } from "./types";

/**
 * Calculate the score for a single round.
 *
 * Score = base × difficulty_multiplier × streak_multiplier + time_bonus
 *
 * Time bonus is proportional to how fast the response was, capped at maxMs.
 * A wrong answer yields 0 points.
 */
export function calcRoundScore(opts: {
  correct: boolean;
  responseTimeMs: number;
  difficulty: DifficultyLevel;
  streak: number; // current streak at time of answer
}): number {
  if (!opts.correct) return 0;

  const { basePointsPerRound, timeBonus, streakMultipliers, difficultyMultipliers } = SCORE_CONFIG;

  const base = basePointsPerRound;
  const diffMult = difficultyMultipliers[opts.difficulty];

  // Streak multiplier — clamp to max table entry
  const streakIndex = Math.min(opts.streak, streakMultipliers.length - 1);
  const streakMult = streakMultipliers[streakIndex] ?? 1;

  // Time bonus: 0...(base * weight), higher when faster
  const clampedTime = Math.max(0, Math.min(opts.responseTimeMs, timeBonus.maxMs));
  const timeFraction = 1 - clampedTime / timeBonus.maxMs; // 1 = instant, 0 = slowest
  const bonus = Math.round(base * timeBonus.weight * timeFraction);

  return Math.round(base * diffMult * streakMult) + bonus;
}

/**
 * Calculate accuracy as a percentage (0–100), rounded to 1 decimal.
 */
export function calcAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 1000) / 10;
}

/**
 * Calculate average response time from a list of round results.
 * Only includes correct rounds to avoid penalizing hesitation on wrong answers.
 */
export function calcAvgResponseTime(rounds: RoundResult[]): number {
  const correctRounds = rounds.filter((r) => r.correct);
  if (correctRounds.length === 0) return 0;
  const total = correctRounds.reduce((sum, r) => sum + r.responseTimeMs, 0);
  return Math.round(total / correctRounds.length);
}

/**
 * Calculate a performance rating from score, accuracy, difficulty.
 * Returns 1–5 stars.
 */
export function calcStarRating(opts: {
  accuracy: number;       // 0–100
  difficulty: DifficultyLevel;
  avgResponseTimeMs: number;
}): 1 | 2 | 3 | 4 | 5 {
  const { accuracy, difficulty } = opts;

  // Thresholds depend on difficulty
  const thresholds: Record<DifficultyLevel, [number, number, number, number]> = {
    1: [50, 65, 80, 93],
    2: [45, 60, 75, 90],
    3: [40, 55, 70, 85],
    4: [35, 50, 65, 80],
    5: [30, 45, 60, 75],
  };

  const t = thresholds[difficulty];
  if (accuracy >= t[3]) return 5;
  if (accuracy >= t[2]) return 4;
  if (accuracy >= t[1]) return 3;
  if (accuracy >= t[0]) return 2;
  return 1;
}

/**
 * Helper function for total game session scoring.
 */
export function calculateGameScore(opts: {
  basePoints: number;
  accuracy: number;
  timeBonus: number;
  streak: number;
  difficulty: DifficultyLevel;
}): number {
  const diffMult = SCORE_CONFIG.difficultyMultipliers[opts.difficulty] || 1;
  const streakMult = Math.min(1 + opts.streak * 0.1, 2.0);
  return Math.round((opts.basePoints + opts.timeBonus) * diffMult * streakMult * Math.max(0.5, opts.accuracy));
}
