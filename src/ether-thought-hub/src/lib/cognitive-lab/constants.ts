// ─────────────────────────────────────────────────────────────────────────────
// Aether Cognitive Lab — Constants & Game Metadata
// ─────────────────────────────────────────────────────────────────────────────

import type { GameId, GameMeta, DifficultyLevel } from "./types";

export const GAME_META: Record<GameId, GameMeta> = {
  "focus-lock": {
    id: "focus-lock",
    name: "Focus Lock",
    tagline: "Find the signal in the noise.",
    description:
      "A grid of symbols appears briefly. Lock onto the targets and ignore the distractors. Speed and precision determine your score.",
    category: "attention",
    categoryLabel: "Selective Attention",
    icon: "🎯",
    accentColor: "oklch(0.72 0.18 195)",
    accentColorClass: "text-cyan-400",
    keySkills: ["Focus", "Visual Search", "Speed"],
    minRounds: 8,
    maxRounds: 12,
  },
  "memory-matrix": {
    id: "memory-matrix",
    name: "Memory Matrix",
    tagline: "See it. Hold it. Reproduce it.",
    description:
      "A pattern lights up on the grid. Study it, then recreate it from memory. Patterns grow more complex as you progress.",
    category: "memory",
    categoryLabel: "Working Memory",
    icon: "🧩",
    accentColor: "oklch(0.72 0.18 280)",
    accentColorClass: "text-violet-400",
    keySkills: ["Visual Memory", "Spatial Recall", "Precision"],
    minRounds: 6,
    maxRounds: 10,
  },
  "logic-forge": {
    id: "logic-forge",
    name: "Logic Forge",
    tagline: "Reason your way to the answer.",
    description:
      "Given a set of logical premises, identify the only valid conclusion. No guessing — pure deductive reasoning.",
    category: "reasoning",
    categoryLabel: "Deductive Reasoning",
    icon: "⚗️",
    accentColor: "oklch(0.72 0.18 140)",
    accentColorClass: "text-emerald-400",
    keySkills: ["Logic", "Deduction", "Critical Thinking"],
    minRounds: 6,
    maxRounds: 10,
  },
  "pattern-shift": {
    id: "pattern-shift",
    name: "Pattern Shift",
    tagline: "Find the rule. Predict what comes next.",
    description:
      "A sequence of elements follows a hidden rule. Identify the pattern and select the correct next element.",
    category: "pattern",
    categoryLabel: "Pattern Recognition",
    icon: "🔷",
    accentColor: "oklch(0.72 0.22 30)",
    accentColorClass: "text-orange-400",
    keySkills: ["Abstraction", "Induction", "Rule Extraction"],
    minRounds: 8,
    maxRounds: 12,
  },
  "sequence-core": {
    id: "sequence-core",
    name: "Sequence Core",
    tagline: "Remember the order. Recall it exactly.",
    description:
      "Watch a sequence of items appear one by one. Then reproduce the sequence in the exact same order.",
    category: "memory",
    categoryLabel: "Sequential Memory",
    icon: "🔢",
    accentColor: "oklch(0.72 0.2 50)",
    accentColorClass: "text-amber-400",
    keySkills: ["Sequential Memory", "Attention", "Recall"],
    minRounds: 6,
    maxRounds: 10,
  },
  "reaction-control": {
    id: "reaction-control",
    name: "Reaction Control",
    tagline: "React fast. But only when you should.",
    description:
      "Respond immediately to target stimuli. Suppress your response to non-targets. Both speed and control matter.",
    category: "inhibition",
    categoryLabel: "Response Inhibition",
    icon: "⚡",
    accentColor: "oklch(0.72 0.22 60)",
    accentColorClass: "text-yellow-400",
    keySkills: ["Reaction Time", "Inhibitory Control", "Precision"],
    minRounds: 12,
    maxRounds: 20,
  },
  "strategy-grid": {
    id: "strategy-grid",
    name: "Pathfinder",
    tagline: "Navigate from Start to targets in numerical sequence.",
    description:
      "Plan and execute the optimal path from START to connect numbered targets (T1 → T2 → TN) in exact order while avoiding obstacles.",
    category: "planning",
    categoryLabel: "Planning & Strategy",
    icon: "♟️",
    accentColor: "oklch(0.72 0.18 170)",
    accentColorClass: "text-teal-400",
    keySkills: ["Planning", "Spatial Reasoning", "Optimization"],
    minRounds: 5,
    maxRounds: 8,
  },
  "code-breaker": {
    id: "code-breaker",
    name: "Code Breaker",
    tagline: "Deduce the hidden code.",
    description:
      "A secret color code is hidden from you. Use logical deduction and the clues from each guess to crack it.",
    category: "deduction",
    categoryLabel: "Logical Deduction",
    icon: "🔐",
    accentColor: "oklch(0.72 0.2 340)",
    accentColorClass: "text-rose-400",
    keySkills: ["Deduction", "Information Processing", "Elimination"],
    minRounds: 5,
    maxRounds: 8,
  },
  sudoku: {
    id: "sudoku",
    name: "Sudoku",
    tagline: "Real constraint solving on a 9×9 grid.",
    description:
      "Fill every row, column, and 3×3 subgrid with numbers 1–9 without repetition. Practice pure deductive constraint reasoning.",
    category: "reasoning",
    categoryLabel: "Deductive Reasoning",
    icon: "🔢",
    accentColor: "oklch(0.72 0.18 240)",
    accentColorClass: "text-blue-500",
    keySkills: ["Logic", "Constraint Reasoning", "Working Memory"],
    minRounds: 1,
    maxRounds: 1,
  },
  "logic-grid": {
    id: "logic-grid",
    name: "Logic Grid",
    tagline: "Deduce relationships from clues and constraints.",
    description:
      "Use interactive matrix deduction and structured clues to eliminate impossibilities and uncover the exact solution.",
    category: "deduction",
    categoryLabel: "Logical Deduction",
    icon: "🔍",
    accentColor: "oklch(0.72 0.2 160)",
    accentColorClass: "text-emerald-500",
    keySkills: ["Logical Deduction", "Elimination", "Planning"],
    minRounds: 1,
    maxRounds: 3,
  },
};

export const ALL_GAME_IDS: GameId[] = [
  "focus-lock",
  "memory-matrix",
  "logic-forge",
  "pattern-shift",
  "sequence-core",
  "reaction-control",
  "strategy-grid",
  "code-breaker",
  "sudoku",
  "logic-grid",
];

// ─── Difficulty Labels ────────────────────────────────────────────────────────

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  1: "Beginner",
  2: "Novice",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  1: "text-emerald-400",
  2: "text-cyan-400",
  3: "text-amber-400",
  4: "text-orange-400",
  5: "text-rose-400",
};

// ─── Scoring constants ────────────────────────────────────────────────────────

export const SCORE_CONFIG = {
  basePointsPerRound: 100,
  timeBonus: {
    maxMs: 5000,   // fastest possible response time that grants full bonus
    weight: 0.5,   // proportion of base points added as time bonus
  },
  streakMultipliers: [1, 1.1, 1.2, 1.35, 1.5, 1.75, 2.0],
  difficultyMultipliers: { 1: 1.0, 2: 1.3, 3: 1.6, 4: 2.0, 5: 2.5 },
} as const;

// ─── Daily Training ───────────────────────────────────────────────────────────

/** How many games are in a daily training session */
export const DAILY_GAME_COUNT = 4;

export const GAME_METADATA = GAME_META;

export const COGNITIVE_CATEGORIES = {
  attention: { id: "attention", name: "Attention" },
  memory: { id: "memory", name: "Memory" },
  reasoning: { id: "reasoning", name: "Reasoning" },
  pattern: { id: "pattern", name: "Pattern Recognition" },
  processing: { id: "processing", name: "Processing Speed" },
  inhibition: { id: "inhibition", name: "Inhibition" },
  planning: { id: "planning", name: "Planning" },
  deduction: { id: "deduction", name: "Deduction" },
} as const;
