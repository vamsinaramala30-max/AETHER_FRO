// ─────────────────────────────────────────────────────────────────────────────
// Focus Lock — Selective Attention Game Engine
// ─────────────────────────────────────────────────────────────────────────────
// The player sees a grid of symbols. A subset are "targets" (highlighted by a
// specific shape/color). The player must click ALL targets and NO distractors
// within the time limit. Round ends when all targets are selected, or time runs out.
// ─────────────────────────────────────────────────────────────────────────────

import type { DifficultyLevel } from "../types";

export type FocusLockSymbol = {
  id: number;
  shape: "circle" | "square" | "triangle" | "diamond" | "star";
  color: "blue" | "red" | "green" | "yellow" | "purple";
  isTarget: boolean;
};

export interface FocusLockChallenge {
  grid: FocusLockSymbol[];
  targetShape: FocusLockSymbol["shape"];
  targetColor: FocusLockSymbol["color"];
  targetCount: number;
  timeLimitMs: number;
  gridSize: number; // sqrt of total cells
}

const SHAPES: FocusLockSymbol["shape"][] = ["circle", "square", "triangle", "diamond", "star"];
const COLORS: FocusLockSymbol["color"][] = ["blue", "red", "green", "yellow", "purple"];

function pick<T>(arr: T[], exclude?: T): T {
  const pool = exclude !== undefined ? arr.filter((x) => x !== exclude) : arr;
  return pool[Math.floor(Math.random() * pool.length)] as T;
}

interface DiffConfig {
  gridSize: number;       // NxN grid
  targetCount: number;   // number of target symbols
  timeLimitMs: number;
}

const DIFF_CONFIG: Record<DifficultyLevel, DiffConfig> = {
  1: { gridSize: 4, targetCount: 3, timeLimitMs: 12000 },
  2: { gridSize: 4, targetCount: 3, timeLimitMs: 9000 },
  3: { gridSize: 5, targetCount: 4, timeLimitMs: 9000 },
  4: { gridSize: 5, targetCount: 5, timeLimitMs: 7000 },
  5: { gridSize: 6, targetCount: 5, timeLimitMs: 6000 },
};

export function generateFocusLockChallenge(difficulty: DifficultyLevel): FocusLockChallenge {
  const config = DIFF_CONFIG[difficulty];
  const { gridSize, targetCount, timeLimitMs } = config;
  const total = gridSize * gridSize;

  // Pick target shape and color
  const targetShape = pick(SHAPES);
  const targetColor = pick(COLORS);

  // Build grid
  const grid: FocusLockSymbol[] = [];

  // Randomly choose indices for targets
  const allIndices = Array.from({ length: total }, (_, i) => i);
  const shuffled = allIndices.sort(() => Math.random() - 0.5);
  const targetIndices = new Set(shuffled.slice(0, targetCount));

  for (let i = 0; i < total; i++) {
    const isTarget = targetIndices.has(i);
    if (isTarget) {
      grid.push({
        id: i,
        shape: targetShape,
        color: targetColor,
        isTarget: true,
      });
    } else {
      // Generate a distractor that is NOT both the target shape AND target color
      let shape: FocusLockSymbol["shape"];
      let color: FocusLockSymbol["color"];
      do {
        shape = pick(SHAPES);
        color = pick(COLORS);
      } while (shape === targetShape && color === targetColor);
      grid.push({ id: i, shape, color, isTarget: false });
    }
  }

  return { grid, targetShape, targetColor, targetCount, timeLimitMs, gridSize };
}

/** Validate a set of selected IDs against the challenge */
export function validateFocusLockAnswer(
  challenge: FocusLockChallenge,
  selectedIds: Set<number>,
): boolean {
  const targetIds = new Set(
    challenge.grid.filter((s) => s.isTarget).map((s) => s.id),
  );
  if (selectedIds.size !== targetIds.size) return false;
  for (const id of selectedIds) {
    if (!targetIds.has(id)) return false;
  }
  return true;
}
