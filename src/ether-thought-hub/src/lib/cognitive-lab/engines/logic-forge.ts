// ─────────────────────────────────────────────────────────────────────────────
// Logic Forge — Deductive Reasoning Game Engine
// ─────────────────────────────────────────────────────────────────────────────
// Players are given 2 premises and must pick the ONE valid logical conclusion
// from 4 options. Questions are generated from a curated template bank, ensuring
// no ambiguity and exactly one correct answer.
// ─────────────────────────────────────────────────────────────────────────────

import type { DifficultyLevel } from "../types";

export interface LogicForgeChallenge {
  premises: string[];          // 2 statements
  options: string[];           // 4 choices
  correctIndex: number;        // index of the correct option
  explanation: string;         // why the correct answer is right
}

// ─── Template bank ────────────────────────────────────────────────────────────
// Each entry has a premise-pair and a set of conclusions. Only index 0 is valid.
// We shuffle options before presenting.

interface LogicTemplate {
  premises: [string, string];
  correct: string;
  distractors: [string, string, string]; // always exactly 3 wrong options
  explanation: string;
}

const TEMPLATES: LogicTemplate[] = [
  {
    premises: ["All mammals are warm-blooded.", "A whale is a mammal."],
    correct: "A whale is warm-blooded.",
    distractors: [
      "All warm-blooded animals are mammals.",
      "Whales live in cold water.",
      "Not all warm-blooded animals are whales.",
    ],
    explanation:
      "All mammals are warm-blooded (premise 1), and a whale is a mammal (premise 2), so a whale must be warm-blooded.",
  },
  {
    premises: ["No reptiles are warm-blooded.", "A snake is a reptile."],
    correct: "A snake is not warm-blooded.",
    distractors: [
      "All warm-blooded animals are reptiles.",
      "A snake is a mammal.",
      "Some reptiles are warm-blooded.",
    ],
    explanation:
      "Since no reptiles are warm-blooded and a snake is a reptile, a snake cannot be warm-blooded.",
  },
  {
    premises: ["All engineers understand mathematics.", "Sofia is an engineer."],
    correct: "Sofia understands mathematics.",
    distractors: [
      "All people who understand mathematics are engineers.",
      "Sofia does not understand mathematics.",
      "Some engineers do not understand mathematics.",
    ],
    explanation:
      "All engineers understand mathematics (premise 1), and Sofia is an engineer (premise 2), therefore Sofia understands mathematics.",
  },
  {
    premises: ["No students passed the exam.", "Raj is a student."],
    correct: "Raj did not pass the exam.",
    distractors: [
      "Raj passed all his exams.",
      "Some students passed the exam.",
      "Raj is not a student.",
    ],
    explanation:
      "Since no students passed the exam and Raj is a student, Raj could not have passed.",
  },
  {
    premises: ["All birds have wings.", "A penguin is a bird."],
    correct: "A penguin has wings.",
    distractors: [
      "All animals with wings are birds.",
      "A penguin can fly.",
      "Some birds do not have wings.",
    ],
    explanation:
      "All birds have wings (premise 1), and a penguin is a bird (premise 2), therefore a penguin has wings.",
  },
  {
    premises: ["If it rains, the ground is wet.", "The ground is wet."],
    correct: "We cannot conclude it rained.",
    distractors: [
      "It is currently raining.",
      "It never rains.",
      "The ground is always wet.",
    ],
    explanation:
      "Wet ground could have other causes (sprinklers, flooding). 'If P then Q' does not mean 'If Q then P'.",
  },
  {
    premises: ["All fruits contain seeds.", "An apple is a fruit."],
    correct: "An apple contains seeds.",
    distractors: [
      "Only apples contain seeds.",
      "All seeded plants are fruits.",
      "An apple is not a fruit.",
    ],
    explanation:
      "All fruits contain seeds and an apple is a fruit, so the apple must contain seeds.",
  },
  {
    premises: ["No prime numbers are even, except 2.", "7 is a prime number."],
    correct: "7 is not even.",
    distractors: [
      "7 equals 2.",
      "All prime numbers are odd.",
      "7 is even.",
    ],
    explanation:
      "7 is prime and not equal to 2, so by the first premise it cannot be even.",
  },
  {
    premises: ["Every city in France is in Europe.", "Paris is a city in France."],
    correct: "Paris is in Europe.",
    distractors: [
      "Every city in Europe is in France.",
      "Paris is in Asia.",
      "Some cities in France are not in Europe.",
    ],
    explanation:
      "Every French city is in Europe, Paris is a French city, therefore Paris is in Europe.",
  },
  {
    premises: ["All doctors have a medical degree.", "Nina does not have a medical degree."],
    correct: "Nina is not a doctor.",
    distractors: [
      "Nina is a doctor.",
      "All people without medical degrees are nurses.",
      "Some doctors do not have a medical degree.",
    ],
    explanation:
      "Since all doctors have a medical degree and Nina does not, she cannot be a doctor.",
  },
  {
    premises: ["Some cats are black.", "My pet is a cat."],
    correct: "We cannot conclude whether my pet is black.",
    distractors: [
      "My pet is definitely black.",
      "My pet is not a cat.",
      "All cats are black.",
    ],
    explanation:
      "'Some' does not guarantee a specific cat is black — only that at least one cat is.",
  },
  {
    premises: ["All squares are rectangles.", "Shape X is a square."],
    correct: "Shape X is a rectangle.",
    distractors: [
      "All rectangles are squares.",
      "Shape X has 5 sides.",
      "Shape X is not a rectangle.",
    ],
    explanation:
      "All squares are rectangles by definition; X is a square, so X is a rectangle.",
  },
];

// ─── Difficulty-based selection ───────────────────────────────────────────────

// Higher difficulty: more abstract / nuanced templates (later indices)
const DIFFICULTY_POOLS: Record<DifficultyLevel, [number, number]> = {
  1: [0, 5],   // templates 0–4
  2: [0, 7],
  3: [2, 9],
  4: [5, 11],
  5: [0, 12],  // all templates at random
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
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

export function generateLogicForgeChallenge(
  difficulty: DifficultyLevel,
  exclude?: string[], // excluded premise combos (to avoid repeats in a session)
): LogicForgeChallenge {
  const [minIdx, maxIdx] = DIFFICULTY_POOLS[difficulty];
  const pool = TEMPLATES.slice(minIdx, maxIdx);

  // Try to exclude already-used templates (best-effort)
  const available = pool.filter(
    (t) => !exclude?.includes(t.premises[0]),
  );
  const candidates = available.length > 0 ? available : pool;

  const template = candidates[randomInt(0, candidates.length)] ?? (TEMPLATES[0] as LogicTemplate);

  // Shuffle the 4 options and track the new correct index
  const optionsWithMeta = [
    { text: template.correct, isCorrect: true },
    ...template.distractors.map((d) => ({ text: d, isCorrect: false })),
  ];
  const shuffled = shuffle(optionsWithMeta);
  const correctIndex = shuffled.findIndex((o) => o.isCorrect);

  return {
    premises: [template.premises[0], template.premises[1]],
    options: shuffled.map((o) => o.text),
    correctIndex,
    explanation: template.explanation,
  };
}

export function validateLogicForgeAnswer(
  challenge: LogicForgeChallenge,
  selectedIndex: number,
): boolean {
  return selectedIndex === challenge.correctIndex;
}
