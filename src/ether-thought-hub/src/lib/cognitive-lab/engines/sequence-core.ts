// ─────────────────────────────────────────────────────────────────────────────
// Sequence Core — Sequential Memory Game Engine
// ─────────────────────────────────────────────────────────────────────────────
// A sequence of colored/labeled tiles appears one by one. The player must tap
// them back in the exact order they were shown, then explicitly press SUBMIT.
// ─────────────────────────────────────────────────────────────────────────────

import type { DifficultyLevel } from "../types";

export type SequenceTile = {
  id: number;
  label: string; // digit, letter, or symbol
  color: string; // tailwind color class
  isDistractor?: boolean;
};

export interface SequenceCoreChallenge {
  sequence: SequenceTile[];    // tiles in display order
  tiles: SequenceTile[];       // shuffled tiles shown for input (includes distractors if any)
  showIntervalMs: number;      // delay between tiles during display
  showDurationMs: number;      // each tile visible for
  patternDescription: string;
}

const COLORS = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-orange-600",
  "bg-cyan-600",
  "bg-pink-600",
  "bg-indigo-600",
  "bg-teal-600",
];

interface DiffConfig {
  sequenceLength: number;
  showDurationMs: number;
  showIntervalMs: number;
  distractorCount: number;
  patternType: "digits" | "mixed" | "alternating" | "expert";
}

const DIFF_CONFIG: Record<DifficultyLevel, DiffConfig> = {
  1: { sequenceLength: 3, showDurationMs: 950, showIntervalMs: 450, distractorCount: 0, patternType: "digits" },
  2: { sequenceLength: 4, showDurationMs: 850, showIntervalMs: 400, distractorCount: 0, patternType: "digits" },
  3: { sequenceLength: 5, showDurationMs: 750, showIntervalMs: 350, distractorCount: 1, patternType: "mixed" },
  4: { sequenceLength: 6, showDurationMs: 650, showIntervalMs: 300, distractorCount: 2, patternType: "alternating" },
  5: { sequenceLength: 7, showDurationMs: 500, showIntervalMs: 250, distractorCount: 3, patternType: "expert" },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = a[i];
    const y = a[j];
    if (x !== undefined && y !== undefined) { a[i] = y; a[j] = x; }
  }
  return a;
}

export function generateSequenceCoreChallenge(
  difficulty: DifficultyLevel,
): SequenceCoreChallenge {
  const config = DIFF_CONFIG[difficulty];
  const { sequenceLength, showDurationMs, showIntervalMs, distractorCount, patternType } = config;

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];
  const greek = ["α", "β", "γ", "δ", "λ", "Ω", "Σ", "Ψ"];

  let sequenceLabels: string[] = [];
  let patternDescription = "Simple Digits";

  if (patternType === "digits") {
    sequenceLabels = shuffle(digits).slice(0, sequenceLength);
    patternDescription = "Numerical Sequence";
  } else if (patternType === "mixed") {
    const pool = shuffle([...digits, ...letters]);
    sequenceLabels = pool.slice(0, sequenceLength);
    patternDescription = "Alphanumeric Sequence";
  } else if (patternType === "alternating") {
    const shuffDigits = shuffle(digits);
    const shuffLetters = shuffle(letters);
    sequenceLabels = [];
    for (let i = 0; i < sequenceLength; i++) {
      if (i % 2 === 0) {
        sequenceLabels.push(shuffLetters[Math.floor(i / 2)] ?? "A");
      } else {
        sequenceLabels.push(shuffDigits[Math.floor(i / 2)] ?? "1");
      }
    }
    patternDescription = "Alternating Letter-Digit Pattern";
  } else {
    // Expert: multi-step symbols with greek & alphanumeric
    const pool = shuffle([...digits, ...letters, ...greek]);
    sequenceLabels = pool.slice(0, sequenceLength);
    patternDescription = "Mixed Multi-Rule Matrix";
  }

  const shuffledColors = shuffle(COLORS);

  // Generate sequence items
  const sequence: SequenceTile[] = sequenceLabels.map((label, i) => ({
    id: i + 1,
    label,
    color: shuffledColors[i % shuffledColors.length] ?? "bg-blue-600",
  }));

  // Generate distractor tiles if needed
  const distractors: SequenceTile[] = [];
  if (distractorCount > 0) {
    const usedLabels = new Set(sequenceLabels);
    const unusedLabels = [...digits, ...letters, ...greek].filter((l) => !usedLabels.has(l));
    const distractorLabels = shuffle(unusedLabels).slice(0, distractorCount);

    distractorLabels.forEach((label, idx) => {
      distractors.push({
        id: 100 + idx,
        label,
        color: shuffledColors[(sequence.length + idx) % shuffledColors.length] ?? "bg-slate-600",
        isDistractor: true,
      });
    });
  }

  // Palette contains sequence items + distractors, fully shuffled
  const tiles = shuffle([...sequence, ...distractors]);

  return {
    sequence,
    tiles,
    showIntervalMs,
    showDurationMs,
    patternDescription,
  };
}

/**
 * Validates whether the submitted sequence IDs (or tile objects) exactly match the expected sequence.
 */
export function validateSequenceCoreAnswer(
  challenge: SequenceCoreChallenge,
  submitted: (number | { id: number })[],
): boolean {
  const expected = challenge.sequence.map((t) => t.id);
  if (submitted.length !== expected.length) return false;
  return submitted.every((item, i) => {
    const id = typeof item === 'number' ? item : item.id;
    return id === expected[i];
  });
}
