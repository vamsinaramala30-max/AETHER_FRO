// ─────────────────────────────────────────────────────────────────────────────
// Memory Matrix — Working Memory Game Engine
// ─────────────────────────────────────────────────────────────────────────────
// A pattern of cells lights up briefly. The player must recreate it by clicking
// the correct cells. Grid size and density increase with difficulty.
// ─────────────────────────────────────────────────────────────────────────────

import type { DifficultyLevel } from "../types";

export interface MemoryMatrixChallenge {
  gridSize: number;       // NxN
  activeCells: number[];  // flat indices of lit cells
  showDurationMs: number; // how long to display the pattern
}

interface DiffConfig {
  gridSize: number;
  activeCellCount: number;
  // Note: showDurationMs is intentionally absent — timing is round-driven, not difficulty-driven.
}

/** Grid size and active-cell density scale with difficulty (unchanged). */
const DIFF_CONFIG: Record<DifficultyLevel, DiffConfig> = {
  1: { gridSize: 3, activeCellCount: 3 },
  2: { gridSize: 4, activeCellCount: 4 },
  3: { gridSize: 4, activeCellCount: 6 },
  4: { gridSize: 5, activeCellCount: 7 },
  5: { gridSize: 5, activeCellCount: 9 },
};

/**
 * Progressive pattern-display durations indexed by round (1-based).
 * Index 0 is unused; index 1 = Round 1, …, index 9+ collapses to the last entry.
 * Once a session reaches MIN_SHOW_DURATION_MS it is locked there for the
 * remainder of that game — timing only ever decreases.
 */
const ROUND_DURATIONS: readonly number[] = [
  0,    // [0] unused
  3000, // Round 1  → 3.0 s
  2500, // Round 2  → 2.5 s
  2200, // Round 3  → 2.2 s
  1800, // Round 4  → 1.8 s
  1500, // Round 5  → 1.5 s
  1300, // Round 6  → 1.3 s
  1100, // Round 7  → 1.1 s
  1000, // Round 8  → 1.0 s
   900, // Round 9+ → 0.9 s
];

/** Hard floor — once reached, timing locks here for the rest of the session. */
export const MIN_SHOW_DURATION_MS = 500;

/**
 * Returns the pattern-display duration (ms) for the given 1-based round number.
 * Never returns a value below MIN_SHOW_DURATION_MS.
 */
export function getShowDurationForRound(round: number): number {
  const maxIndex = ROUND_DURATIONS.length - 1; // 8
  const index = Math.min(Math.max(round, 1), maxIndex);
  const scheduled = ROUND_DURATIONS[index] ?? MIN_SHOW_DURATION_MS;
  return Math.max(scheduled, MIN_SHOW_DURATION_MS);
}

export function generateMemoryMatrixChallenge(
  difficulty: DifficultyLevel,
  /** 1-based round counter for the current game session (drives display timing). */
  round: number = 1,
): MemoryMatrixChallenge {
  const config = DIFF_CONFIG[difficulty];
  const { gridSize, activeCellCount } = config;
  const showDurationMs = getShowDurationForRound(round);
  const total = gridSize * gridSize;

  // Shuffle all cell indices and pick activeCellCount
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = indices[i];
    const b = indices[j];
    if (a !== undefined && b !== undefined) {
      indices[i] = b;
      indices[j] = a;
    }
  }

  const activeCells = indices.slice(0, activeCellCount).sort((a, b) => a - b);

  return { gridSize, activeCells, showDurationMs };
}

/** Check if the player's selection exactly matches the challenge */
export function validateMemoryMatrixAnswer(
  challenge: MemoryMatrixChallenge,
  selected: number[],
): boolean {
  const sorted = [...selected].sort((a, b) => a - b);
  if (sorted.length !== challenge.activeCells.length) return false;
  return sorted.every((v, i) => v === challenge.activeCells[i]);
}
