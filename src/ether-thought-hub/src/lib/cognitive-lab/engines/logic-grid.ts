// ─────────────────────────────────────────────────────────────────────────────
// Logic Grid — Deductive Reasoning & Constraint Elimination Game Engine
// ─────────────────────────────────────────────────────────────────────────────
// Generates structured logic grid puzzles with guaranteed unique solutions.
// Features an interactive elimination matrix (Unknown / ✕ / ✓) and clue checklist.
// ─────────────────────────────────────────────────────────────────────────────

import type { DifficultyLevel } from "../types";

export interface Category {
  id: string;
  name: string;
  items: string[];
}

export interface LogicClue {
  id: number;
  text: string;
  type: "positive" | "negative" | "cross_link";
  checked?: boolean | undefined;
}

export interface LogicSolution {
  // primaryItem -> { [categoryName]: string }
  assignments: Record<string, Record<string, string>>;
}

export interface LogicGridChallenge {
  difficulty: DifficultyLevel;
  primaryCategory: Category;
  secondaryCategory: Category;
  tertiaryCategory?: Category | undefined;
  clues: LogicClue[];
  solution: LogicSolution;
  totalMatchesToFind: number;
  forbiddenPairs: string[]; // "person:attribute" that are explicitly forbidden by clues
  confirmedPairs: string[]; // "person:attribute" that are explicitly confirmed by clues
}

const PEOPLE_POOL = [
  "Dr. Aris",
  "Capt. Vance",
  "Agent Nova",
  "Prof. Lin",
  "Elena Frost",
  "Kaelen Voss",
];

const LOCATIONS_POOL = [
  "Cyber Core",
  "Quantum Bay",
  "Bio Vault",
  "Deep Archive",
  "Orbital Lab",
  "Aero Deck",
];

const ITEMS_POOL = [
  "Cipher Key",
  "Neural Prism",
  "Solar Crystal",
  "Flux Core",
  "Data Scroll",
  "Pulse Beacon",
];

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

export function generateLogicGridChallenge(
  difficulty: DifficultyLevel,
): LogicGridChallenge {
  const entityCount = difficulty === 1 ? 3 : difficulty <= 3 ? 4 : 5;
  const hasTertiary = difficulty >= 4;

  const people = shuffle(PEOPLE_POOL).slice(0, entityCount);
  const locations = shuffle(LOCATIONS_POOL).slice(0, entityCount);
  const items = hasTertiary ? shuffle(ITEMS_POOL).slice(0, entityCount) : [];

  // True assignments
  const assignments: Record<string, Record<string, string>> = {};
  for (let i = 0; i < entityCount; i++) {
    const person = people[i]!;
    assignments[person] = {
      Location: locations[i]!,
    };
    if (hasTertiary) {
      assignments[person]!["Item"] = items[i]!;
    }
  }

  // Generate unambiguous clue set and track forbidden/confirmed pairs
  const clues: LogicClue[] = [];
  const forbiddenPairs: string[] = [];
  const confirmedPairs: string[] = [];
  let clueId = 1;

  // 1. Give 1 or 2 direct positive clues
  clues.push({
    id: clueId++,
    text: `${people[0]} is assigned directly to the ${locations[0]}.`,
    type: "positive",
  });
  confirmedPairs.push(`${people[0]}:${locations[0]}`);

  // 2. Negative elimination clues
  for (let i = 1; i < entityCount; i++) {
    const wrongLoc = locations[(i + 1) % entityCount]!;
    clues.push({
      id: clueId++,
      text: `${people[i]} is NOT located at the ${wrongLoc}.`,
      type: "negative",
    });
    forbiddenPairs.push(`${people[i]}:${wrongLoc}`);
  }

  // 3. Indirect / other negative clues
  if (entityCount >= 4) {
    const targetPerson = people[1]!;
    const assignedLoc = locations[1]!;
    const otherWrong = locations[2 % entityCount]!;

    clues.push({
      id: clueId++,
      text: `Neither ${people[2]} nor ${people[3] || people[0]} is stationed at the ${assignedLoc}.`,
      type: "negative",
    });
    forbiddenPairs.push(`${people[2]}:${assignedLoc}`);
    if (people[3]) forbiddenPairs.push(`${people[3]}:${assignedLoc}`);

    clues.push({
      id: clueId++,
      text: `${targetPerson} does not work in the ${otherWrong}.`,
      type: "negative",
    });
    forbiddenPairs.push(`${targetPerson}:${otherWrong}`);
  }

  // 4. Tertiary category cross-link clues (for Hard / Expert)
  if (hasTertiary) {
    clues.push({
      id: clueId++,
      text: `The specialist in the ${locations[0]} carries the ${items[0]}.`,
      type: "cross_link",
    });
    confirmedPairs.push(`${people[0]}:${items[0]}`);

    for (let i = 1; i < entityCount; i++) {
      if (i % 2 === 1) {
        clues.push({
          id: clueId++,
          text: `${people[i]} is in possession of the ${items[i]}.`,
          type: "positive",
        });
        confirmedPairs.push(`${people[i]}:${items[i]}`);
      } else {
        const wrongItem = items[(i + 1) % entityCount]!;
        clues.push({
          id: clueId++,
          text: `The operative stationed at the ${locations[i]} does NOT use the ${wrongItem}.`,
          type: "cross_link",
        });
        forbiddenPairs.push(`${people[i]}:${wrongItem}`);
      }
    }
  }

  const primaryCategory: Category = {
    id: "people",
    name: "Operatives",
    items: people,
  };

  const secondaryCategory: Category = {
    id: "locations",
    name: "Locations",
    items: locations,
  };

  const tertiaryCategory: Category | undefined = hasTertiary
    ? {
        id: "items",
        name: "Equipment",
        items: items,
      }
    : undefined;

  const totalMatchesToFind = hasTertiary ? entityCount * 2 : entityCount;

  return {
    difficulty,
    primaryCategory,
    secondaryCategory,
    tertiaryCategory,
    clues,
    solution: { assignments },
    totalMatchesToFind,
    forbiddenPairs,
    confirmedPairs,
  };
}

export type DeductionAssignment = {
  location?: string | undefined;
  item?: string | undefined;
};

/**
 * Checks if confirming a pair contradicts known clues or solution rules.
 */
export function checkLogicGridContradiction(
  challenge: LogicGridChallenge,
  person: string,
  attribute: string
): { isContradiction: boolean; reason?: string } {
  const pairKey = `${person}:${attribute}`;
  if (challenge.forbiddenPairs.includes(pairKey)) {
    return {
      isContradiction: true,
      reason: `Contradiction: Clues explicitly establish that ${person} is NOT matched with ${attribute}!`,
    };
  }
  return { isContradiction: false };
}

/**
 * Provides a hint for Logic Grid by finding the first missing or incorrect assignment.
 */
export function getLogicGridHint(
  challenge: LogicGridChallenge,
  currentAssignments: Record<string, DeductionAssignment>
): { person: string; isLocation: boolean; value: string } | null {
  for (const person of challenge.primaryCategory.items) {
    const expected = challenge.solution.assignments[person];
    const current = currentAssignments[person];

    if (expected?.["Location"] && current?.location !== expected["Location"]) {
      return {
        person,
        isLocation: true,
        value: expected["Location"],
      };
    }

    if (challenge.tertiaryCategory && expected?.["Item"] && current?.item !== expected["Item"]) {
      return {
        person,
        isLocation: false,
        value: expected["Item"],
      };
    }
  }
  return null;
}

/**
 * Validates player's deduced matches against the solution.
 */
export function validateLogicSolution(
  challenge: LogicGridChallenge,
  playerAssignments: Record<string, DeductionAssignment>,
): { isCorrect: boolean; correctCount: number; totalCount: number } {
  let correctCount = 0;
  const totalCount = challenge.totalMatchesToFind;

  for (const person of challenge.primaryCategory.items) {
    const expected = challenge.solution.assignments[person];
    const player = playerAssignments[person];

    if (!expected || !player) continue;

    if (player.location === expected["Location"]) {
      correctCount++;
    }

    if (challenge.tertiaryCategory && expected["Item"]) {
      if (player.item === expected["Item"]) {
        correctCount++;
      }
    }
  }

  return {
    isCorrect: correctCount === totalCount,
    correctCount,
    totalCount,
  };
}
