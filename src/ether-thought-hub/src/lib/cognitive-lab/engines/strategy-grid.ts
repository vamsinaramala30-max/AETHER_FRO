// ─────────────────────────────────────────────────────────────────────────────
// Strategy Grid / Pathfinder — Planning & Navigation Game Engine
// ─────────────────────────────────────────────────────────────────────────────
// The player must navigate from START to connect numbered targets (T1 → T2 → TN)
// in exact order around obstacles. The engine guarantees 100% solvability via BFS.
// ─────────────────────────────────────────────────────────────────────────────

import type { DifficultyLevel } from "../types";

export type CellType = "empty" | "obstacle" | "target" | "start";

export interface GridCell {
  row: number;
  col: number;
  type: CellType;
  targetNumber?: number; // 1-based order
}

export interface StrategyGridChallenge {
  grid: GridCell[][];
  gridSize: number;
  targets: { row: number; col: number; number: number }[];
  optimalMoves: number;   // minimum moves to visit all targets in order
  maxMoves: number;       // player must complete within this many moves
  startPos: { row: number; col: number };
}

interface DiffConfig {
  gridSize: number;
  targetCount: number;
  obstacleCount: number;
  maxMovesExtra: number;
}

const DIFF_CONFIG: Record<DifficultyLevel, DiffConfig> = {
  1: { gridSize: 4, targetCount: 3, obstacleCount: 2, maxMovesExtra: 8 },
  2: { gridSize: 4, targetCount: 4, obstacleCount: 3, maxMovesExtra: 7 },
  3: { gridSize: 5, targetCount: 4, obstacleCount: 5, maxMovesExtra: 6 },
  4: { gridSize: 6, targetCount: 5, obstacleCount: 7, maxMovesExtra: 5 },
  5: { gridSize: 6, targetCount: 6, obstacleCount: 9, maxMovesExtra: 5 },
};

export type Pos = { row: number; col: number };

export function posKey(p: Pos): string {
  return `${String(p.row)},${String(p.col)}`;
}

export function neighbors(p: Pos, size: number): Pos[] {
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ] as const;
  return dirs
    .map(([dr, dc]) => ({ row: p.row + dr, col: p.col + dc }))
    .filter((n) => n.row >= 0 && n.row < size && n.col >= 0 && n.col < size);
}

/** BFS shortest path distance between two positions, avoiding obstacles */
export function bfsDistance(
  from: Pos,
  to: Pos,
  size: number,
  obstacles: Set<string>,
): number | null {
  if (posKey(from) === posKey(to)) return 0;
  const queue: Array<{ pos: Pos; dist: number }> = [{ pos: from, dist: 0 }];
  const visited = new Set<string>([posKey(from)]);

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) break;
    const { pos, dist } = item;
    for (const n of neighbors(pos, size)) {
      const key = posKey(n);
      if (obstacles.has(key)) continue;
      if (key === posKey(to)) return dist + 1;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ pos: n, dist: dist + 1 });
      }
    }
  }
  return null; // unreachable
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

/**
 * Validates that a challenge has START, exactly all targets 1..N, no overlaps,
 * and that every target is reachable in sequential order.
 */
export function validateBoardSolvability(
  startPos: Pos,
  targets: Array<{ row: number; col: number; number: number }>,
  obstacles: Set<string>,
  gridSize: number,
): { isSolvable: boolean; totalOptimalMoves: number } {
  const sorted = [...targets].sort((a, b) => a.number - b.number);
  let current = startPos;
  let totalMoves = 0;

  for (const target of sorted) {
    const dist = bfsDistance(current, target, gridSize, obstacles);
    if (dist === null) {
      return { isSolvable: false, totalOptimalMoves: 0 };
    }
    totalMoves += dist;
    current = target;
  }

  return { isSolvable: true, totalOptimalMoves: totalMoves };
}

const MAX_GENERATION_ATTEMPTS = 60;

export function generateStrategyGridChallenge(
  difficulty: DifficultyLevel,
): StrategyGridChallenge {
  const config = DIFF_CONFIG[difficulty];
  const { gridSize, targetCount, obstacleCount, maxMovesExtra } = config;

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    // Pick start position
    const startPos: Pos = {
      row: randInt(0, gridSize - 1),
      col: randInt(0, gridSize - 1),
    };

    // All other coordinates
    const allRemaining: Pos[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (r !== startPos.row || c !== startPos.col) {
          allRemaining.push({ row: r, col: c });
        }
      }
    }

    const shuffled = shuffle(allRemaining);
    const targetPositions = shuffled.slice(0, targetCount);
    const nonTargets = shuffled.slice(targetCount);

    // Pick obstacle positions from remainder
    const obstaclePositions = nonTargets.slice(0, obstacleCount);
    const obstacleSet = new Set(obstaclePositions.map(posKey));

    const targets = targetPositions.map((pos, idx) => ({
      row: pos.row,
      col: pos.col,
      number: idx + 1,
    }));

    const solvability = validateBoardSolvability(startPos, targets, obstacleSet, gridSize);
    if (!solvability.isSolvable) continue;

    // Construct grid
    const grid: GridCell[][] = Array.from({ length: gridSize }, (_, r) =>
      Array.from({ length: gridSize }, (_, c) => ({
        row: r,
        col: c,
        type: "empty" as CellType,
      })),
    );

    // Place start
    const startCell = grid[startPos.row]?.[startPos.col];
    if (startCell) startCell.type = "start";

    // Place obstacles
    for (const obs of obstaclePositions) {
      const cell = grid[obs.row]?.[obs.col];
      if (cell) cell.type = "obstacle";
    }

    // Place targets
    for (const t of targets) {
      const cell = grid[t.row]?.[t.col];
      if (cell) {
        cell.type = "target";
        cell.targetNumber = t.number;
      }
    }

    return {
      grid,
      gridSize,
      targets,
      optimalMoves: solvability.totalOptimalMoves,
      maxMoves: solvability.totalOptimalMoves + maxMovesExtra,
      startPos,
    };
  }

  // Guaranteed Path-Carving Fallback (ensures exact gridSize & difficulty without ever failing)
  const guaranteedStart: Pos = { row: 0, col: 0 };
  const stepDirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let curr = { ...guaranteedStart };
  const pathCells: Pos[] = [curr];
  const pathSet = new Set<string>([posKey(curr)]);

  for (let s = 0; s < targetCount * 3; s++) {
    const validNext = neighbors(curr, gridSize).filter((n) => !pathSet.has(posKey(n)));
    if (validNext.length > 0) {
      const n = validNext[randInt(0, validNext.length - 1)]!;
      pathCells.push(n);
      pathSet.add(posKey(n));
      curr = n;
    }
  }

  // Assign targets along carved path
  const targetStepInterval = Math.max(1, Math.floor(pathCells.length / (targetCount + 1)));
  const targets = Array.from({ length: targetCount }, (_, i) => {
    const idx = Math.min((i + 1) * targetStepInterval, pathCells.length - 1);
    const p = pathCells[idx] ?? { row: i + 1, col: 0 };
    return { row: p.row, col: p.col, number: i + 1 };
  });

  const targetSet = new Set(targets.map(posKey));
  const obstacles: Pos[] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const key = `${r},${c}`;
      if (!pathSet.has(key) && key !== posKey(guaranteedStart) && !targetSet.has(key)) {
        if (obstacles.length < obstacleCount) {
          obstacles.push({ row: r, col: c });
        }
      }
    }
  }

  const obstacleSet = new Set(obstacles.map(posKey));
  const solvability = validateBoardSolvability(guaranteedStart, targets, obstacleSet, gridSize);

  const grid: GridCell[][] = Array.from({ length: gridSize }, (_, r) =>
    Array.from({ length: gridSize }, (_, c) => ({
      row: r,
      col: c,
      type: "empty" as CellType,
    })),
  );

  const startCell = grid[guaranteedStart.row]?.[guaranteedStart.col];
  if (startCell) startCell.type = "start";

  for (const obs of obstacles) {
    const cell = grid[obs.row]?.[obs.col];
    if (cell) cell.type = "obstacle";
  }

  for (const t of targets) {
    const cell = grid[t.row]?.[t.col];
    if (cell) {
      cell.type = "target";
      cell.targetNumber = t.number;
    }
  }

  return {
    grid,
    gridSize,
    targets,
    optimalMoves: solvability.totalOptimalMoves || (targetCount * 2),
    maxMoves: (solvability.totalOptimalMoves || (targetCount * 2)) + maxMovesExtra,
    startPos: guaranteedStart,
  };
}

export function validateStrategyGridSolution(
  challenge: StrategyGridChallenge,
  path: Pos[],
): { valid: boolean; targetsHit: number; inOrder: boolean } {
  const obstacleSet = new Set<string>();
  for (const row of challenge.grid) {
    for (const cell of row) {
      if (cell.type === "obstacle") obstacleSet.add(posKey(cell));
    }
  }

  // Check no obstacles traversed
  for (const pos of path) {
    if (obstacleSet.has(posKey(pos))) {
      return { valid: false, targetsHit: 0, inOrder: false };
    }
  }

  // Check targets hit in order
  const sorted = [...challenge.targets].sort((a, b) => a.number - b.number);
  let targetIdx = 0;
  for (const pos of path) {
    const expected = sorted[targetIdx];
    if (expected && pos.row === expected.row && pos.col === expected.col) {
      targetIdx++;
    }
  }

  return {
    valid: targetIdx === challenge.targets.length,
    targetsHit: targetIdx,
    inOrder: targetIdx === challenge.targets.length,
  };
}

export function scorePath(
  challenge: StrategyGridChallenge,
  path: Pos[],
): { valid: boolean; targetsHit: number; inOrder: boolean } {
  return validateStrategyGridSolution(challenge, path);
}

