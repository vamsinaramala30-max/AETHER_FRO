// ─────────────────────────────────────────────────────────────────────────────
// Reaction Control — Go/No-Go Response Inhibition Game Engine
// ─────────────────────────────────────────────────────────────────────────────
// Each trial shows a stimulus after an unpredictable delay.
// If it's a GO stimulus, tap as fast as possible.
// If it's a NO-GO or Distractor stimulus, do NOT tap.
// Measures reaction time, false starts, misses, and response inhibition.
// ─────────────────────────────────────────────────────────────────────────────

import type { DifficultyLevel } from "../types";

export type TrialType = "go" | "nogo";

export interface ReactionStimulus {
  kind: "go" | "nogo";
  color: string;      // tailwind color class
  bgColor: string;    // tailwind bg color class
  symbol: string;     // icon or shape
  label: string;      // label displayed
  ruleDescription?: string;
}

export interface ReactionTrial {
  index: number;
  type: TrialType;
  stimulus: ReactionStimulus;
  delayBeforeMs: number;    // jitter delay (1200ms–3500ms)
  showDurationMs: number;   // response window
  targetReactionMs: number; // reference for score scaling
}

interface DiffConfig {
  totalTrials: number;
  noGoRatio: number;
  minDelayMs: number;
  maxDelayMs: number;
  showDurationMs: number;
  targetReactionMs: number;
  ruleTitle: string;
}

const DIFF_CONFIG: Record<DifficultyLevel, DiffConfig> = {
  1: {
    totalTrials: 10,
    noGoRatio: 0.2,
    minDelayMs: 1400,
    maxDelayMs: 2800,
    showDurationMs: 1100,
    targetReactionMs: 650,
    ruleTitle: "Tap when GREEN 'GO' appears. Do NOT tap on RED 'STOP'.",
  },
  2: {
    totalTrials: 12,
    noGoRatio: 0.25,
    minDelayMs: 1300,
    maxDelayMs: 2700,
    showDurationMs: 950,
    targetReactionMs: 550,
    ruleTitle: "Tap when GREEN 'GO' appears. Do NOT tap on RED 'STOP'.",
  },
  3: {
    totalTrials: 14,
    noGoRatio: 0.3,
    minDelayMs: 1200,
    maxDelayMs: 3000,
    showDurationMs: 800,
    targetReactionMs: 450,
    ruleTitle: "Tap on GREEN 'GO'. Inhibit response on RED 'STOP'.",
  },
  4: {
    totalTrials: 16,
    noGoRatio: 0.35,
    minDelayMs: 1100,
    maxDelayMs: 3200,
    showDurationMs: 680,
    targetReactionMs: 400,
    ruleTitle: "Distractor Filter: Tap ONLY on GREEN CIRCLE. Ignore GREEN TRIANGLE or RED CIRCLE.",
  },
  5: {
    totalTrials: 18,
    noGoRatio: 0.4,
    minDelayMs: 1000,
    maxDelayMs: 3400,
    showDurationMs: 560,
    targetReactionMs: 340,
    ruleTitle: "High-Load Inhibition: Tap ONLY when shape is STAR (★) OR color is CYAN.",
  },
};

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

export interface ReactionControlChallenge {
  trials: ReactionTrial[];
  ruleTitle: string;
  showDurationMs: number;
}

export function generateReactionControlChallenge(
  difficulty: DifficultyLevel,
): ReactionControlChallenge {
  const config = DIFF_CONFIG[difficulty];
  const { totalTrials, noGoRatio, minDelayMs, maxDelayMs, showDurationMs, targetReactionMs, ruleTitle } = config;

  const noGoCount = Math.round(totalTrials * noGoRatio);
  const goCount = totalTrials - noGoCount;

  const types: TrialType[] = [
    ...Array<TrialType>(goCount).fill("go"),
    ...Array<TrialType>(noGoCount).fill("nogo"),
  ];

  // Prevent 3 consecutive no-go trials
  let shuffled = shuffle(types);
  for (let attempts = 0; attempts < 30; attempts++) {
    let valid = true;
    for (let i = 2; i < shuffled.length; i++) {
      if (shuffled[i] === "nogo" && shuffled[i - 1] === "nogo" && shuffled[i - 2] === "nogo") {
        valid = false;
        break;
      }
    }
    if (valid) break;
    shuffled = shuffle(types);
  }

  const trials: ReactionTrial[] = shuffled.map((type, index) => {
    let stimulus: ReactionStimulus;

    if (difficulty <= 3) {
      if (type === "go") {
        stimulus = {
          kind: "go",
          color: "text-emerald-500",
          bgColor: "bg-emerald-500",
          symbol: "●",
          label: "GO!",
        };
      } else {
        stimulus = {
          kind: "nogo",
          color: "text-rose-500",
          bgColor: "bg-rose-500",
          symbol: "✕",
          label: "STOP!",
        };
      }
    } else if (difficulty === 4) {
      // Level 4: Shape/Color Distractors
      // Go is Green Circle
      if (type === "go") {
        stimulus = {
          kind: "go",
          color: "text-emerald-500",
          bgColor: "bg-emerald-500",
          symbol: "●",
          label: "TAP",
        };
      } else {
        // Distractor No-Go options
        const distractors: ReactionStimulus[] = [
          { kind: "nogo", color: "text-emerald-500", bgColor: "bg-emerald-500", symbol: "▲", label: "IGNORE" },
          { kind: "nogo", color: "text-rose-500", bgColor: "bg-rose-500", symbol: "●", label: "IGNORE" },
          { kind: "nogo", color: "text-amber-500", bgColor: "bg-amber-500", symbol: "■", label: "STOP" },
        ];
        stimulus = distractors[randInt(0, distractors.length - 1)]!;
      }
    } else {
      // Level 5 Expert: Feature conjunction
      // Go condition: STAR or CYAN
      if (type === "go") {
        const goPool: ReactionStimulus[] = [
          { kind: "go", color: "text-amber-400", bgColor: "bg-amber-400", symbol: "★", label: "MATCH" },
          { kind: "go", color: "text-cyan-400", bgColor: "bg-cyan-400", symbol: "▲", label: "MATCH" },
          { kind: "go", color: "text-cyan-400", bgColor: "bg-cyan-400", symbol: "★", label: "MATCH" },
        ];
        stimulus = goPool[randInt(0, goPool.length - 1)]!;
      } else {
        const nogoPool: ReactionStimulus[] = [
          { kind: "nogo", color: "text-rose-500", bgColor: "bg-rose-500", symbol: "■", label: "NO" },
          { kind: "nogo", color: "text-violet-500", bgColor: "bg-violet-500", symbol: "●", label: "NO" },
          { kind: "nogo", color: "text-emerald-500", bgColor: "bg-emerald-500", symbol: "▲", label: "NO" },
        ];
        stimulus = nogoPool[randInt(0, nogoPool.length - 1)]!;
      }
    }

    return {
      index,
      type,
      stimulus,
      delayBeforeMs: randInt(minDelayMs, maxDelayMs),
      showDurationMs,
      targetReactionMs,
    };
  });

  return { trials, ruleTitle, showDurationMs };
}

export interface TrialOutcome {
  trial: ReactionTrial;
  responded: boolean;
  reactionTimeMs: number | null;
  correct: boolean;
  score: number;
}

export function scoreReactionTrial(
  trial: ReactionTrial,
  responded: boolean,
  reactionTimeMs: number | null,
): TrialOutcome {
  let correct = false;
  let score = 0;

  if (trial.type === "go") {
    if (responded && reactionTimeMs !== null && reactionTimeMs <= trial.showDurationMs) {
      correct = true;
      const ratio = Math.max(0, 1 - reactionTimeMs / trial.targetReactionMs);
      score = Math.round(50 + 100 * ratio);
    }
  } else {
    // No-go trial
    if (!responded) {
      correct = true;
      score = 75; // Correct response inhibition
    }
  }

  return { trial, responded, reactionTimeMs, correct, score };
}

export function validateReactionControlAnswer(
  stimulus: any,
  reacted: boolean,
): boolean {
  if (!stimulus) return false;
  const isGo = stimulus.kind === "go";
  return reacted ? isGo : !isGo;
}

