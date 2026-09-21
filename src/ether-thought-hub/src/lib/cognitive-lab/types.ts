// ─────────────────────────────────────────────────────────────────────────────
// Aether Cognitive Lab — Shared TypeScript types
// ─────────────────────────────────────────────────────────────────────────────

export type GameId =
  | "focus-lock"
  | "memory-matrix"
  | "logic-forge"
  | "pattern-shift"
  | "sequence-core"
  | "reaction-control"
  | "strategy-grid"
  | "code-breaker"
  | "sudoku"
  | "logic-grid";

export type CognitiveCategory =
  | "attention"
  | "memory"
  | "reasoning"
  | "pattern"
  | "processing"
  | "inhibition"
  | "planning"
  | "deduction";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface GameMeta {
  id: GameId;
  name: string;
  tagline: string;
  description: string;
  category: CognitiveCategory;
  categoryLabel: string;
  icon: string; // emoji or icon name
  accentColor: string; // CSS color (oklch or hsl)
  accentColorClass: string; // Tailwind class for text/bg
  keySkills: string[];
  minRounds: number;
  maxRounds: number;
}

// ─── Session & Results ───────────────────────────────────────────────────────

export interface RoundResult {
  roundIndex: number;
  correct: boolean;
  responseTimeMs: number;
  score: number;
}

export interface GameResult {
  id: string; // uuid
  gameId: GameId;
  playedAt: number; // unix ms
  difficulty: DifficultyLevel;
  totalRounds: number;
  correctRounds: number;
  score: number;
  scorePercentage: number; // 0–100 normalized score
  isSuccess: boolean; // scorePercentage >= 60
  coinsEarned: number; // coins rewarded for this attempt
  hintsUsed?: number;
  mistakes?: number;
  accuracy: number; // 0–100
  avgResponseTimeMs: number;
  maxStreak: number;
  durationMs: number; // total session duration
  rounds: RoundResult[];
}

export interface PlayerStats {
  gameId: GameId;
  totalSessions: number;
  totalScore: number;
  bestScore: number;
  avgAccuracy: number;
  avgResponseTimeMs: number;
  bestStreak: number;
  lastPlayedAt: number | null;
  highestDifficulty: DifficultyLevel;
}

// ─── Daily Training ──────────────────────────────────────────────────────────

export interface DailyTrainingGame {
  gameId: GameId;
  completed: boolean;
  result: GameResult | null;
}

export interface DailyTraining {
  date: string; // "YYYY-MM-DD"
  games: DailyTrainingGame[];
  completedAt: number | null;
  totalScore: number;
}

// ─── Storage Schema ───────────────────────────────────────────────────────────

export interface CognitivelabStorageV1 {
  version: 1;
  results: GameResult[];
  dailyTraining: DailyTraining | null;
  settings: CognitivelabSettings;
  coins?: number;
  completedGamesCount?: number;
  rewardedAttemptIds?: string[];
}

export interface CognitivelabSettings {
  reducedMotion: boolean;
  showInstructions: boolean;
  preferDark: boolean;
}

// ─── Game Phase ──────────────────────────────────────────────────────────────

export type GamePhase =
  | "idle"      // not started
  | "intro"     // instructions screen
  | "playing"   // active gameplay
  | "feedback"  // showing round feedback
  | "complete"  // game over, showing results
  | "paused";   // paused mid-game

// ─── Generic game state shared by all games ───────────────────────────────────

export interface BaseGameState {
  phase: GamePhase;
  difficulty: DifficultyLevel;
  round: number;
  totalRounds: number;
  score: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  rounds: RoundResult[];
  sessionStartTime: number | null;
  roundStartTime: number | null;
  lastFeedback: "correct" | "incorrect" | null;
}
