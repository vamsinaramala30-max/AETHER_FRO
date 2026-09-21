// ─────────────────────────────────────────────────────────────────────────────
// Code Breaker — Mastermind-style Deduction Game Engine
// ─────────────────────────────────────────────────────────────────────────────
// A secret code (4 colors, with repeats allowed at higher difficulty) is hidden.
// The player guesses the code; each guess gets feedback:
//   ● (black peg) = correct color in correct position
//   ○ (white peg) = correct color, wrong position
// ─────────────────────────────────────────────────────────────────────────────

import type { DifficultyLevel } from "../types";

export type CodeColor =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "orange"
  | "pink"
  | "cyan";

export type Code = CodeColor[];

export interface CodeBreakerFeedback {
  blacks: number; // correct color + position
  whites: number; // correct color, wrong position
}

export interface CodeBreakerChallenge {
  secretCode: Code;
  codeLength: number;
  colorPool: CodeColor[];
  allowRepeats: boolean;
  maxGuesses: number;
}

const ALL_COLORS: CodeColor[] = [
  "red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan",
];

interface DiffConfig {
  codeLength: number;
  colorCount: number; // how many distinct colors in pool
  allowRepeats: boolean;
  maxGuesses: number;
}

const DIFF_CONFIG: Record<DifficultyLevel, DiffConfig> = {
  1: { codeLength: 3, colorCount: 4, allowRepeats: false, maxGuesses: 8 },
  2: { codeLength: 4, colorCount: 5, allowRepeats: false, maxGuesses: 8 },
  3: { codeLength: 4, colorCount: 6, allowRepeats: false, maxGuesses: 7 },
  4: { codeLength: 4, colorCount: 6, allowRepeats: true, maxGuesses: 7 },
  5: { codeLength: 5, colorCount: 7, allowRepeats: true, maxGuesses: 8 },
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

export function generateCodeBreakerChallenge(difficulty: DifficultyLevel): CodeBreakerChallenge {
  const config = DIFF_CONFIG[difficulty];
  const { codeLength, colorCount, allowRepeats, maxGuesses } = config;

  const colorPool = shuffle([...ALL_COLORS]).slice(0, colorCount) as CodeColor[];

  let secretCode: Code;
  if (allowRepeats) {
    secretCode = Array.from(
      { length: codeLength },
      () => colorPool[Math.floor(Math.random() * colorPool.length)] as CodeColor,
    );
  } else {
    secretCode = shuffle([...colorPool]).slice(0, codeLength) as CodeColor[];
  }

  return { secretCode, codeLength, colorPool, allowRepeats, maxGuesses };
}

/**
 * Score a guess against the secret code.
 * Returns blacks (exact match) and whites (color present, wrong position).
 *
 * Algorithm ensures each code peg and each guess peg is counted at most once.
 */
export function scoreGuess(secret: Code, guess: Code): CodeBreakerFeedback {
  const len = secret.length;
  let blacks = 0;
  const secretUsed = new Array<boolean>(len).fill(false);
  const guessUsed = new Array<boolean>(len).fill(false);

  // First pass: blacks
  for (let i = 0; i < len; i++) {
    if (guess[i] === secret[i]) {
      blacks++;
      secretUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Second pass: whites
  let whites = 0;
  for (let i = 0; i < len; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < len; j++) {
      if (secretUsed[j]) continue;
      if (guess[i] === secret[j]) {
        whites++;
        secretUsed[j] = true;
        break;
      }
    }
  }

  return { blacks, whites };
}

export function isCodeSolved(feedback: CodeBreakerFeedback, codeLength: number): boolean {
  return feedback.blacks === codeLength;
}

export function validateCodeBreakerGuess(
  challenge: CodeBreakerChallenge,
  guess: any[],
): { exact: number; partial: number } {
  const fb = scoreGuess(challenge.secretCode, guess as CodeColor[]);
  return { exact: fb.blacks, partial: fb.whites };
}
