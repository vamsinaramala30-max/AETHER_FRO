// ─────────────────────────────────────────────────────────────────────────────
// Sudoku — Constraint Satisfaction & Deductive Reasoning Game Engine
// ─────────────────────────────────────────────────────────────────────────────
// Real 9×9 board with 3×3 subgrids.
// Procedural backtracking generation guarantees 100% solvable valid puzzles.
// Provides real-time row, column, and box conflict detection.
// ─────────────────────────────────────────────────────────────────────────────

import type { DifficultyLevel } from "../types";

export type SudokuCell = {
  row: number;
  col: number;
  value: number | null; // 1–9 or null
  given: boolean;       // true if part of original puzzle clues
  notes?: number[];     // optional candidate pencil notes (1–9)
};

export type SudokuGrid = SudokuCell[][];

export interface SudokuChallenge {
  initialGrid: SudokuGrid;
  solution: number[][];
  cluesCount: number;
  difficulty: DifficultyLevel;
}

const CLUES_BY_DIFFICULTY: Record<DifficultyLevel, number> = {
  1: 42, // Easy
  2: 38, // Novice
  3: 33, // Medium
  4: 28, // Hard
  5: 24, // Expert
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = a[i];
    const y = a[j];
    if (x !== undefined && y !== undefined) {
      a[i] = y;
      a[j] = x;
    }
  }
  return a;
}

/** Check if num can be placed at (r, c) in raw number grid without conflict */
function isValidPlacement(board: number[][], r: number, c: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[r]?.[i] === num) return false;
    if (board[i]?.[c] === num) return false;
  }
  const startRow = Math.floor(r / 3) * 3;
  const startCol = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i]?.[startCol + j] === num) return false;
    }
  }
  return true;
}

/** Recursively generate a solved 9x9 board */
function fillBoard(board: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r]?.[c] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValidPlacement(board, r, c, num)) {
            board[r]![c] = num;
            if (fillBoard(board)) return true;
            board[r]![c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/** Backtracking solver to count solutions (up to limit) */
function countSolutions(board: number[][], limit = 2): number {
  let count = 0;

  function solve(r: number, c: number): boolean {
    if (r === 9) {
      count++;
      return count >= limit;
    }

    const nextR = c === 8 ? r + 1 : r;
    const nextC = c === 8 ? 0 : c + 1;

    if (board[r]?.[c] !== 0) {
      return solve(nextR, nextC);
    }

    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(board, r, c, num)) {
        board[r]![c] = num;
        if (solve(nextR, nextC)) return true;
        board[r]![c] = 0;
      }
    }
    return false;
  }

  solve(0, 0);
  return count;
}

/**
 * Procedurally generates a guaranteed solvable Sudoku puzzle.
 */
export function generateSudokuChallenge(difficulty: DifficultyLevel): SudokuChallenge {
  // Step 1: Create a completely filled valid solution board
  const solution: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(solution);

  // Step 2: Clone solution to create puzzle board
  const puzzle: number[][] = solution.map((row) => [...row]);

  // Step 3: Remove cells to target clues count
  const targetClues = CLUES_BY_DIFFICULTY[difficulty];
  const allPositions: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      allPositions.push({ r, c });
    }
  }

  const shuffledPositions = shuffle(allPositions);
  let currentClues = 81;

  for (const { r, c } of shuffledPositions) {
    if (currentClues <= targetClues) break;

    const backup = puzzle[r]![c]!;
    puzzle[r]![c] = 0;

    // Verify board remains uniquely or easily solvable
    const testBoard = puzzle.map((row) => [...row]);
    const solutions = countSolutions(testBoard, 2);

    if (solutions !== 1) {
      // Revert if removal causes ambiguity
      puzzle[r]![c] = backup;
    } else {
      currentClues--;
    }
  }

  // Construct UI grid
  const initialGrid: SudokuGrid = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => {
      const val = puzzle[r]?.[c] || 0;
      return {
        row: r,
        col: c,
        value: val === 0 ? null : val,
        given: val !== 0,
        notes: [],
      };
    })
  );

  return {
    initialGrid,
    solution,
    cluesCount: currentClues,
    difficulty,
  };
}

/**
 * Finds all cell coordinates that are currently violating Sudoku rules
 * (duplicates in same row, same column, or same 3x3 block).
 */
export function getSudokuConflicts(grid: SudokuGrid): Set<string> {
  const conflicts = new Set<string>();

  // Check rows
  for (let r = 0; r < 9; r++) {
    const seen = new Map<number, number[]>();
    for (let c = 0; c < 9; c++) {
      const val = grid[r]?.[c]?.value;
      if (val) {
        const list = seen.get(val) || [];
        list.push(c);
        seen.set(val, list);
      }
    }
    for (const [, cols] of seen) {
      if (cols.length > 1) {
        for (const c of cols) {
          conflicts.add(`${r},${c}`);
          conflicts.add(`${r}-${c}`);
        }
      }
    }
  }

  // Check columns
  for (let c = 0; c < 9; c++) {
    const seen = new Map<number, number[]>();
    for (let r = 0; r < 9; r++) {
      const val = grid[r]?.[c]?.value;
      if (val) {
        const list = seen.get(val) || [];
        list.push(r);
        seen.set(val, list);
      }
    }
    for (const [, rows] of seen) {
      if (rows.length > 1) {
        for (const r of rows) {
          conflicts.add(`${r},${c}`);
          conflicts.add(`${r}-${c}`);
        }
      }
    }
  }

  // Check 3x3 subgrids
  for (let boxR = 0; boxR < 3; boxR++) {
    for (let boxC = 0; boxC < 3; boxC++) {
      const seen = new Map<number, Array<{ r: number; c: number }>>();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const r = boxR * 3 + i;
          const c = boxC * 3 + j;
          const val = grid[r]?.[c]?.value;
          if (val) {
            const list = seen.get(val) || [];
            list.push({ r, c });
            seen.set(val, list);
          }
        }
      }
      for (const [, cells] of seen) {
        if (cells.length > 1) {
          for (const cell of cells) {
            conflicts.add(`${cell.r},${cell.c}`);
            conflicts.add(`${cell.r}-${cell.c}`);
          }
        }
      }
    }
  }

  return conflicts;
}

/**
 * Checks whether the entire board is filled correctly according to the solution.
 */
export function isSudokuComplete(grid: SudokuGrid, solution: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cellVal = grid[r]?.[c]?.value;
      const expected = solution[r]?.[c];
      if (!cellVal || cellVal !== expected) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Provides a hint by finding an empty or incorrect cell and giving the solution value.
 */
export function getSudokuHint(
  grid: SudokuGrid,
  solution: number[][],
): { row: number; col: number; value: number } | null {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = grid[r]?.[c];
      if (!cell?.given && cell?.value !== solution[r]?.[c]) {
        return {
          row: r,
          col: c,
          value: solution[r]![c]!,
        };
      }
    }
  }
  return null;
}

/**
 * Resets grid back to the initial given clues, clearing user-entered values and notes.
 */
export function resetSudokuGrid(initialGrid: SudokuGrid): SudokuGrid {
  return initialGrid.map((row) =>
    row.map((cell) => ({
      ...cell,
      value: cell.given ? cell.value : null,
      notes: [],
    }))
  );
}
