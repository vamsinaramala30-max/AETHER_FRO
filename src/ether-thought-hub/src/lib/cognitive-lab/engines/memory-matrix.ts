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
  showDurationMs: number;
}

const DIFF_CONFIG: Record<DifficultyLevel, DiffConfig> = {
  1: { gridSize: 3, activeCellCount: 3, showDurationMs: 2000 },
  2: { gridSize: 4, activeCellCount: 4, showDurationMs: 2000 },
  3: { gridSize: 4, activeCellCount: 6, showDurationMs: 1800 },
  4: { gridSize: 5, activeCellCount: 7, showDurationMs: 1600 },
  5: { gridSize: 5, activeCellCount: 9, showDurationMs: 1400 },
};

export function generateMemoryMatrixChallenge(
  difficulty: DifficultyLevel,
): MemoryMatrixChallenge {
  const config = DIFF_CONFIG[difficulty];
  const { gridSize, activeCellCount, showDurationMs } = config;
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
