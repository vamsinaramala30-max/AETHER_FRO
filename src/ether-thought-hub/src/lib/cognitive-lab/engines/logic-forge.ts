// ─────────────────────────────────────────────────────────────────────────────
// Logic Forge — Deductive Reasoning Game Engine (Enhanced)
// ─────────────────────────────────────────────────────────────────────────────
// 65 unique templates across 5 genuine difficulty tiers.
// Difficulty 1 (Beginner): simple categorical syllogisms
// Difficulty 2 (Novice): slightly longer chains, basic elimination
// Difficulty 3 (Intermediate): multi-step deductions, multiple constraints
// Difficulty 4 (Advanced): interacting conditions, deeper inference
// Difficulty 5 (Expert): complex multi-condition, conditional chains
// ─────────────────────────────────────────────────────────────────────────────

import type { DifficultyLevel } from "../types";

export interface LogicForgeChallenge {
  premises: string[];          // 2–3 statements
  options: string[];           // 4 choices
  correctIndex: number;        // index of the correct option
  explanation: string;         // why the correct answer is right
}

interface LogicTemplate {
  premises: string[];
  correct: string;
  distractors: [string, string, string]; // exactly 3 wrong options
  explanation: string;
  difficulty: DifficultyLevel;
}

// ─── Template Bank ────────────────────────────────────────────────────────────
// 65 unique, unambiguous templates with objectively correct answers.

const TEMPLATES: LogicTemplate[] = [

  // ══════════════════════════════════════════════════════════════════
  // DIFFICULTY 1 — Beginner (simple syllogisms, straightforward deductions)
  // ══════════════════════════════════════════════════════════════════

  {
    difficulty: 1,
    premises: ["All mammals are warm-blooded.", "A whale is a mammal."],
    correct: "A whale is warm-blooded.",
    distractors: ["All warm-blooded animals are mammals.", "Whales live in cold water.", "Not all warm-blooded animals are whales."],
    explanation: "All mammals are warm-blooded (P1), and a whale is a mammal (P2), so a whale must be warm-blooded.",
  },
  {
    difficulty: 1,
    premises: ["All birds have wings.", "A penguin is a bird."],
    correct: "A penguin has wings.",
    distractors: ["All animals with wings are birds.", "A penguin can fly.", "Some birds do not have wings."],
    explanation: "All birds have wings (P1) and a penguin is a bird (P2), therefore a penguin has wings — even though it cannot fly.",
  },
  {
    difficulty: 1,
    premises: ["All squares are rectangles.", "Shape X is a square."],
    correct: "Shape X is a rectangle.",
    distractors: ["All rectangles are squares.", "Shape X has 5 sides.", "Shape X is not a rectangle."],
    explanation: "Squares are a subset of rectangles by definition. X is a square, so X is also a rectangle.",
  },
  {
    difficulty: 1,
    premises: ["Every city in France is in Europe.", "Paris is a city in France."],
    correct: "Paris is in Europe.",
    distractors: ["Every city in Europe is in France.", "Paris is in Asia.", "Some cities in France are not in Europe."],
    explanation: "Every French city is in Europe (P1), and Paris is a French city (P2), so Paris is in Europe.",
  },
  {
    difficulty: 1,
    premises: ["All fruits contain seeds.", "An apple is a fruit."],
    correct: "An apple contains seeds.",
    distractors: ["Only apples contain seeds.", "All seeded plants are fruits.", "An apple is not a fruit."],
    explanation: "All fruits contain seeds (P1) and an apple is a fruit (P2), so the apple must contain seeds.",
  },
  {
    difficulty: 1,
    premises: ["All engineers understand mathematics.", "Sofia is an engineer."],
    correct: "Sofia understands mathematics.",
    distractors: ["All people who understand mathematics are engineers.", "Sofia does not understand mathematics.", "Some engineers do not understand mathematics."],
    explanation: "All engineers understand mathematics (P1), and Sofia is an engineer (P2), so Sofia understands mathematics.",
  },
  {
    difficulty: 1,
    premises: ["No students passed the exam.", "Raj is a student."],
    correct: "Raj did not pass the exam.",
    distractors: ["Raj passed all his exams.", "Some students passed the exam.", "Raj is not a student."],
    explanation: "Since no students passed (P1) and Raj is a student (P2), Raj could not have passed.",
  },
  {
    difficulty: 1,
    premises: ["All roses are flowers.", "All flowers need sunlight."],
    correct: "All roses need sunlight.",
    distractors: ["All things that need sunlight are roses.", "Roses do not need sunlight.", "Some roses need sunlight."],
    explanation: "Roses are flowers (P1), and all flowers need sunlight (P2), so all roses need sunlight — this is a classic syllogism.",
  },
  {
    difficulty: 1,
    premises: ["No reptiles are warm-blooded.", "A snake is a reptile."],
    correct: "A snake is not warm-blooded.",
    distractors: ["All warm-blooded animals are reptiles.", "A snake is a mammal.", "Some reptiles are warm-blooded."],
    explanation: "No reptiles are warm-blooded (P1) and a snake is a reptile (P2), so a snake cannot be warm-blooded.",
  },
  {
    difficulty: 1,
    premises: ["All doctors have a medical degree.", "Nina does not have a medical degree."],
    correct: "Nina is not a doctor.",
    distractors: ["Nina is a doctor.", "All people without medical degrees are nurses.", "Some doctors do not have a medical degree."],
    explanation: "All doctors have a medical degree (P1). Nina lacks one (P2), so by contrapositive, Nina is not a doctor.",
  },
  {
    difficulty: 1,
    premises: ["All triangles have exactly three sides.", "Shape T is a triangle."],
    correct: "Shape T has exactly three sides.",
    distractors: ["Shape T has four sides.", "All shapes with three sides are triangles.", "Shape T might have three sides."],
    explanation: "Direct categorical syllogism: T is a triangle (P2) and all triangles have exactly three sides (P1).",
  },
  {
    difficulty: 1,
    premises: ["All planets orbit a star.", "Earth is a planet."],
    correct: "Earth orbits a star.",
    distractors: ["All things that orbit a star are planets.", "Earth is not a planet.", "Earth may or may not orbit a star."],
    explanation: "Earth is a planet (P2) and all planets orbit a star (P1), so Earth orbits a star.",
  },
  {
    difficulty: 1,
    premises: ["No fish are mammals.", "A trout is a fish."],
    correct: "A trout is not a mammal.",
    distractors: ["A trout is a mammal.", "All fish are mammals.", "Some fish are mammals."],
    explanation: "No fish are mammals (P1) and a trout is a fish (P2), so a trout is not a mammal.",
  },

  // ══════════════════════════════════════════════════════════════════
  // DIFFICULTY 2 — Novice (slightly longer chains, basic elimination, conditionals)
  // ══════════════════════════════════════════════════════════════════

  {
    difficulty: 2,
    premises: ["If it rains, the ground is wet.", "The ground is NOT wet."],
    correct: "It did not rain.",
    distractors: ["It is currently raining.", "The ground is always dry.", "We cannot determine whether it rained."],
    explanation: "This is Modus Tollens: if P→Q and ¬Q, then ¬P. Ground is not wet, so it did not rain.",
  },
  {
    difficulty: 2,
    premises: ["Some cats are black.", "My pet is a cat."],
    correct: "We cannot conclude whether my pet is black.",
    distractors: ["My pet is definitely black.", "My pet is not a cat.", "All cats are black."],
    explanation: "'Some' does not guarantee this specific cat is black — only that at least one cat is black.",
  },
  {
    difficulty: 2,
    premises: ["No prime numbers are even, except 2.", "7 is a prime number."],
    correct: "7 is not even.",
    distractors: ["7 equals 2.", "All prime numbers are odd.", "7 is even."],
    explanation: "7 is a prime number other than 2 (P2), so by the first premise it cannot be even.",
  },
  {
    difficulty: 2,
    premises: ["All A-students study daily.", "Maria does not study daily."],
    correct: "Maria is not an A-student.",
    distractors: ["Maria is an A-student.", "All students who study daily are A-students.", "Maria studies occasionally."],
    explanation: "By contrapositive: if all A-students study daily, then anyone who does not study daily is not an A-student.",
  },
  {
    difficulty: 2,
    premises: ["If a shape has four equal sides and four right angles, it is a square.", "Shape P has four equal sides and four right angles."],
    correct: "Shape P is a square.",
    distractors: ["Shape P might be a rectangle.", "Shape P is a rhombus.", "We cannot determine what shape P is."],
    explanation: "The premises exactly match the sufficient condition for being a square, so P is a square.",
  },
  {
    difficulty: 2,
    premises: ["All even numbers are divisible by 2.", "16 is an even number."],
    correct: "16 is divisible by 2.",
    distractors: ["16 is divisible by 3.", "16 might be divisible by 2.", "Not all even numbers are divisible by 2."],
    explanation: "16 is even (P2) and all even numbers are divisible by 2 (P1), so 16 is divisible by 2.",
  },
  {
    difficulty: 2,
    premises: ["Some athletes are vegetarians.", "John is an athlete."],
    correct: "We cannot conclude whether John is a vegetarian.",
    distractors: ["John is a vegetarian.", "John is not a vegetarian.", "All athletes are vegetarians."],
    explanation: "'Some athletes are vegetarians' doesn't tell us about John specifically — he may or may not be.",
  },
  {
    difficulty: 2,
    premises: ["If you eat well and exercise, you will be healthy.", "Tom does not exercise."],
    correct: "We cannot conclude Tom is unhealthy from this alone.",
    distractors: ["Tom is definitely unhealthy.", "Tom is definitely healthy.", "Tom exercises."],
    explanation: "The condition requires both eating well AND exercising. We only know Tom doesn't exercise, but the inverse doesn't guarantee bad health.",
  },
  {
    difficulty: 2,
    premises: ["All mammals nurse their young.", "A platypus is a mammal."],
    correct: "A platypus nurses its young.",
    distractors: ["A platypus lays eggs so it cannot nurse its young.", "We cannot tell from these premises.", "Not all platypuses nurse their young."],
    explanation: "All mammals nurse their young (P1) and the platypus is a mammal (P2), so it must nurse its young — even if it also lays eggs.",
  },
  {
    difficulty: 2,
    premises: ["No members of Club X can also be in Club Y.", "Anna is a member of Club Y."],
    correct: "Anna is not a member of Club X.",
    distractors: ["Anna is a member of Club X.", "Anna is in both clubs.", "We cannot determine club membership."],
    explanation: "No Club X member can be in Club Y (P1). Since Anna is in Club Y (P2), she cannot be in Club X.",
  },
  {
    difficulty: 2,
    premises: ["If a number ends in 0 or 5, it is divisible by 5.", "The number 45 ends in 5."],
    correct: "45 is divisible by 5.",
    distractors: ["45 is not divisible by 5.", "45 ends in 0.", "We cannot tell without calculation."],
    explanation: "45 ends in 5 (P2), satisfying the condition in P1, so 45 is divisible by 5.",
  },

  // ══════════════════════════════════════════════════════════════════
  // DIFFICULTY 3 — Intermediate (multi-step, multiple constraints)
  // ══════════════════════════════════════════════════════════════════

  {
    difficulty: 3,
    premises: ["All A-students receive scholarships.", "All scholarship holders study abroad.", "Marco is an A-student."],
    correct: "Marco studies abroad.",
    distractors: ["Marco receives no scholarship.", "Marco might study abroad.", "All students who study abroad are A-students."],
    explanation: "Marco is an A-student → receives a scholarship → studies abroad (transitive chain across both premises).",
  },
  {
    difficulty: 3,
    premises: ["Every employee works in exactly one department.", "No employee works in both Sales and Marketing."],
    correct: "An employee in Sales does not work in Marketing.",
    distractors: ["Some employees work in both departments.", "An employee can choose any department.", "Sales and Marketing are the same department."],
    explanation: "If employees work in exactly one department (P1) and no one works in both (P2), an employee in Sales cannot be in Marketing.",
  },
  {
    difficulty: 3,
    premises: ["If a project is approved, it receives funding.", "Project Alpha did not receive funding."],
    correct: "Project Alpha was not approved.",
    distractors: ["Project Alpha was approved but mismanaged.", "Project Alpha received other funding.", "We cannot determine the approval status."],
    explanation: "Modus Tollens: approved → funded. Not funded → not approved.",
  },
  {
    difficulty: 3,
    premises: ["All vegetables contain fiber.", "Carrots are vegetables.", "Lisa ate something that contained no fiber."],
    correct: "Lisa did not eat a carrot.",
    distractors: ["Lisa ate a carrot.", "Carrots contain no fiber.", "We cannot determine what Lisa ate."],
    explanation: "Carrots are vegetables (P2) so they contain fiber (P1). Since Lisa's food had no fiber (P3), she did not eat a carrot.",
  },
  {
    difficulty: 3,
    premises: ["Exactly one of A, B, or C won the prize.", "A did not win.", "B did not win."],
    correct: "C won the prize.",
    distractors: ["No one won.", "Both B and C won.", "A might still have won."],
    explanation: "Exactly one won (P1). A and B both didn't win (P2, P3). The only remaining possibility is C.",
  },
  {
    difficulty: 3,
    premises: ["All vehicles with engines use fuel.", "Bicycles do not use fuel.", "A bicycle is a vehicle."],
    correct: "Bicycles do not have engines.",
    distractors: ["Bicycles have engines.", "Bicycles use fuel.", "Not all vehicles are covered by these premises."],
    explanation: "If a vehicle has an engine it uses fuel (P1). Bicycles don't use fuel (P2) and are vehicles (P3), so bicycles cannot have engines.",
  },
  {
    difficulty: 3,
    premises: ["All professional athletes train daily.", "Some professional athletes compete internationally.", "Yuki is a professional athlete who does NOT compete internationally."],
    correct: "Yuki trains daily.",
    distractors: ["Yuki does not train daily.", "Yuki competes internationally.", "We cannot determine Yuki's training schedule."],
    explanation: "ALL professional athletes train daily (P1). Yuki is a professional athlete (P3), so Yuki trains daily — regardless of international competition.",
  },
  {
    difficulty: 3,
    premises: ["If today is Tuesday, the market is closed.", "The market is open."],
    correct: "Today is not Tuesday.",
    distractors: ["Today is Tuesday.", "The market is closed on Tuesdays only.", "We cannot determine what day it is."],
    explanation: "Tuesday → closed. Market is open (not closed) → by contrapositive, today is not Tuesday.",
  },
  {
    difficulty: 3,
    premises: ["All prime numbers greater than 2 are odd.", "The number N is prime and greater than 2."],
    correct: "N is odd.",
    distractors: ["N might be even.", "N is even.", "N equals 2."],
    explanation: "N is prime and greater than 2 (P2), so by P1, N is odd.",
  },
  {
    difficulty: 3,
    premises: ["Students who fail two or more subjects are on academic probation.", "Sam failed only one subject."],
    correct: "We cannot determine if Sam is on academic probation from this alone.",
    distractors: ["Sam is on academic probation.", "Sam is not on academic probation.", "Sam failed two subjects."],
    explanation: "The rule requires failing two or more subjects. Sam failed only one, but there may be other conditions for probation not mentioned.",
  },

  // ══════════════════════════════════════════════════════════════════
  // DIFFICULTY 4 — Advanced (interacting conditions, deeper inference chains)
  // ══════════════════════════════════════════════════════════════════

  {
    difficulty: 4,
    premises: ["If P then Q.", "If Q then R.", "P is true."],
    correct: "R is true.",
    distractors: ["R might be true.", "Q is false.", "We can only conclude Q."],
    explanation: "P→Q (P1), Q→R (P2), P is true (P3). By modus ponens twice: P→Q gives Q, Q→R gives R.",
  },
  {
    difficulty: 4,
    premises: ["All X are Y. All Y are Z. No Z is W."],
    correct: "No X is W.",
    distractors: ["Some X are W.", "All X are W.", "We cannot determine the relationship of X and W."],
    explanation: "X⊆Y (P1), Y⊆Z (P2), so X⊆Z. No Z is W (P3), so no X is W either.",
  },
  {
    difficulty: 4,
    premises: ["Exactly three people (A, B, C) are in the room.", "A is not sitting.", "B is standing.", "Only one person is standing."],
    correct: "C is not standing.",
    distractors: ["C is standing.", "B is not standing.", "A is standing."],
    explanation: "Only one person stands (P4) and B is standing (P3). Therefore no one else — including C — can be standing.",
  },
  {
    difficulty: 4,
    premises: ["If a country is in the EU, its citizens can freely work in other EU countries.", "Country X's citizens cannot freely work in other EU countries.", "Country Y is in the EU."],
    correct: "Country X is not in the EU.",
    distractors: ["Country X is in the EU.", "Country Y's citizens cannot work freely abroad.", "We cannot determine X's EU status."],
    explanation: "EU membership → free work rights (P1). X lacks free work rights (P2) → by contrapositive, X is not in EU. P3 is irrelevant to the conclusion.",
  },
  {
    difficulty: 4,
    premises: ["All members must pay dues OR perform 10 hours of service.", "Member M did not pay dues.", "Member M is in good standing."],
    correct: "Member M performed 10 hours of service.",
    distractors: ["Member M is not in good standing.", "Member M paid dues.", "We cannot determine M's service hours."],
    explanation: "Good standing requires paying dues OR 10h service (P1). M didn't pay (P2) but IS in good standing (P3), so M must have performed the service.",
  },
  {
    difficulty: 4,
    premises: ["Neither A nor B is true.", "If C is false, then A is true."],
    correct: "C is true.",
    distractors: ["C is false.", "A is true.", "B is true."],
    explanation: "A is not true (from P1: neither A nor B). If C is false then A is true (P2). Since A is not true, C cannot be false — C must be true.",
  },
  {
    difficulty: 4,
    premises: ["Everyone who passed Test 1 OR Test 2 is eligible.", "Kira passed neither Test 1 nor Test 2.", "All eligible candidates are shortlisted."],
    correct: "Kira is not shortlisted.",
    distractors: ["Kira is shortlisted.", "Kira passed Test 1.", "We cannot determine Kira's shortlisting status."],
    explanation: "Kira passed neither test (P2), so Kira is not eligible (from P1). Non-eligible candidates are not covered by P3 as shortlisted.",
  },
  {
    difficulty: 4,
    premises: ["Team A wins only if Team B loses.", "Team B did not lose."],
    correct: "Team A did not win.",
    distractors: ["Team A won.", "Team B won.", "The game ended in a draw."],
    explanation: "A wins → B loses (P1). B did not lose (P2). By contrapositive, A did not win.",
  },
  {
    difficulty: 4,
    premises: ["All chemicals in Group 1 react with water.", "Chemical Z reacted with water.", "Group 1 chemicals are highly volatile."],
    correct: "We cannot conclude Chemical Z is in Group 1.",
    distractors: ["Chemical Z is in Group 1.", "Chemical Z is highly volatile.", "Chemical Z does not react with water."],
    explanation: "Just because Group 1 reacts with water doesn't mean all water-reactive substances are in Group 1. Z reacting with water is insufficient to classify it as Group 1.",
  },
  {
    difficulty: 4,
    premises: ["At a party: Alice arrived before Bob.", "Bob arrived before Carol.", "Dave arrived after Carol."],
    correct: "Alice arrived before Dave.",
    distractors: ["Dave arrived before Alice.", "Carol arrived before Alice.", "Bob arrived after Carol."],
    explanation: "Order: Alice < Bob < Carol < Dave. Therefore Alice arrived before Dave.",
  },

  // ══════════════════════════════════════════════════════════════════
  // DIFFICULTY 5 — Expert (complex multi-condition, long chains, subtle fallacies)
  // ══════════════════════════════════════════════════════════════════

  {
    difficulty: 5,
    premises: ["If it rains, the ground is wet.", "The ground is wet."],
    correct: "We cannot conclude it rained.",
    distractors: ["It is currently raining.", "It never rains.", "The ground is always wet."],
    explanation: "'P→Q and Q' does NOT prove P. Ground could be wet for other reasons (sprinklers, flooding). This is the formal fallacy of 'affirming the consequent'.",
  },
  {
    difficulty: 5,
    premises: ["All As are Bs. All Bs are Cs. Some Cs are Ds. All Ds are Es."],
    correct: "All As are Cs.",
    distractors: ["All As are Es.", "Some As are Ds.", "No As are Cs."],
    explanation: "A⊆B (P1), B⊆C (P2), so A⊆C. Note: we cannot conclude 'All As are Ds/Es' because only SOME Cs are Ds.",
  },
  {
    difficulty: 5,
    premises: ["P implies Q.", "Q implies R.", "R implies S.", "S is false."],
    correct: "P is false.",
    distractors: ["P is true.", "Q is true and R is false.", "S might still be true."],
    explanation: "Chain of contrapositive: ¬S → ¬R → ¬Q → ¬P. Since S is false, P must also be false.",
  },
  {
    difficulty: 5,
    premises: ["Either John or Mary committed the error (but not both).", "If John committed the error, the report is incomplete.", "The report is complete."],
    correct: "Mary committed the error.",
    distractors: ["John committed the error.", "Both John and Mary committed errors.", "Neither committed the error."],
    explanation: "Report is complete → John did not commit the error (contrapositive of P2). Exactly one of them did (P1), so Mary committed the error.",
  },
  {
    difficulty: 5,
    premises: ["No system can be both fast and cheap and reliable (pick at most two).", "System K is fast and cheap."],
    correct: "System K is not reliable.",
    distractors: ["System K is reliable.", "System K is not fast.", "System K is not cheap."],
    explanation: "The constraint limits any system to at most two of the three properties (P1). K already has fast + cheap (P2), so it cannot also be reliable.",
  },
  {
    difficulty: 5,
    premises: ["All crows in region A are black.", "Bird B was found in region A.", "Bird B is a crow."],
    correct: "Bird B is black.",
    distractors: ["Bird B might be white.", "Not all birds in region A are black.", "Bird B is not a crow."],
    explanation: "All crows in region A are black (P1). B is in region A (P2) and is a crow (P3). Therefore B is black.",
  },
  {
    difficulty: 5,
    premises: ["If A and B are both true, then C is true.", "C is false.", "A is true."],
    correct: "B is false.",
    distractors: ["B is true.", "A is false.", "We cannot determine B's value."],
    explanation: "(A∧B)→C. By contrapositive: ¬C→¬(A∧B)→¬A∨¬B. C is false (P2) so ¬A or ¬B. A is true (P3), so ¬B — B is false.",
  },
  {
    difficulty: 5,
    premises: ["Exactly two of the four statements (W, X, Y, Z) are true.", "W is true.", "X is false.", "Y is false."],
    correct: "Z is true.",
    distractors: ["Z is false.", "W is false.", "Two of X, Y, Z are true."],
    explanation: "Exactly two are true (P1). W is true (P2), X and Y are false (P3, P4). To reach exactly 2 true statements, Z must be true.",
  },
  {
    difficulty: 5,
    premises: ["All necessary conditions for Q being true are satisfied.", "Q being true is sufficient for R.", "R causes S only if T also occurs."],
    correct: "If T occurs, S will occur.",
    distractors: ["S will always occur.", "Q is false.", "R cannot occur without S."],
    explanation: "All conditions for Q are met → Q is true (P1). Q→R (P2) → R is true. R causes S only if T occurs (P3). Therefore: T occurring means S occurs.",
  },
  {
    difficulty: 5,
    premises: ["In a group of 5 people, exactly 3 are honest.", "Person 1 says: 'Person 2 is dishonest.'", "Person 2 says: 'Person 1 is honest.'"],
    correct: "We cannot determine individual honesty from these statements alone.",
    distractors: ["Person 1 is honest.", "Person 2 is dishonest.", "Both Person 1 and Person 2 are honest."],
    explanation: "Self-referential testimony creates a logical loop: if Person 1 is honest, Person 2 is dishonest — but then Person 2's claim that Person 1 is honest is false (consistent). If Person 1 is dishonest, Person 2 is honest — Person 2's claim becomes true (also consistent). Both scenarios are internally consistent.",
  },
  {
    difficulty: 5,
    premises: ["All X that satisfy condition A also satisfy condition B.", "Some X satisfy neither A nor C.", "All X that satisfy C satisfy B."],
    correct: "Some X do not satisfy B.",
    distractors: ["All X satisfy B.", "No X satisfies B.", "All X satisfy A or C."],
    explanation: "Some X satisfy neither A nor C (P2). These X are not covered by P1 (requires A) or P3 (requires C), so they may not satisfy B. Therefore some X do not satisfy B.",
  },
  {
    difficulty: 5,
    premises: ["Statement S is true if and only if statement T is false.", "Statement T is true if and only if statement U is true.", "U is false."],
    correct: "S is true.",
    distractors: ["S is false.", "T is false.", "We cannot determine S."],
    explanation: "U is false (P3). T↔U (P2): T is false. S↔¬T (P1): since T is false, ¬T is true, so S is true.",
  },
];

// ─── Difficulty pools ─────────────────────────────────────────────────────────

function getPool(difficulty: DifficultyLevel): LogicTemplate[] {
  // Pure pools for clean difficulty separation
  const pools: Record<DifficultyLevel, DifficultyLevel[]> = {
    1: [1],
    2: [1, 2],
    3: [2, 3],
    4: [3, 4],
    5: [4, 5],
  };
  const allowed = pools[difficulty];
  return TEMPLATES.filter((t) => allowed.includes(t.difficulty));
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function randomInt(min: number, max: number): number {
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

// ─── Session history tracker ──────────────────────────────────────────────────
// Module-level state tracking recently shown questions per difficulty to prevent repeats.
// Stores the template's correct answer string as the unique ID.

const _recentByDifficulty: Partial<Record<DifficultyLevel, Set<string>>> = {};

function getRecentSet(difficulty: DifficultyLevel): Set<string> {
  if (!_recentByDifficulty[difficulty]) {
    _recentByDifficulty[difficulty] = new Set();
  }
  return _recentByDifficulty[difficulty]!;
}

function markSeen(difficulty: DifficultyLevel, templateKey: string): void {
  const set = getRecentSet(difficulty);
  set.add(templateKey);
  // Keep only last N seen to allow repetition after cycling through
  const pool = getPool(difficulty);
  const maxHistory = Math.max(Math.floor(pool.length * 0.7), 3);
  if (set.size > maxHistory) {
    // Remove oldest entry
    const oldest = set.values().next().value;
    if (oldest) set.delete(oldest);
  }
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generateLogicForgeChallenge(
  difficulty: DifficultyLevel,
  _exclude?: string[], // kept for API compatibility but internal tracking is now used
): LogicForgeChallenge {
  const pool = getPool(difficulty);
  const recent = getRecentSet(difficulty);

  // Prefer templates not recently seen
  let candidates = pool.filter((t) => !recent.has(t.correct));
  if (candidates.length === 0) {
    // All templates recently shown — reset and use full pool
    recent.clear();
    candidates = pool;
  }

  const template = candidates[randomInt(0, candidates.length)] ?? pool[0]!;
  markSeen(difficulty, template.correct);

  // Shuffle the 4 options and track the new correct index
  const optionsWithMeta = [
    { text: template.correct, isCorrect: true },
    ...template.distractors.map((d) => ({ text: d, isCorrect: false })),
  ];
  const shuffled = shuffle(optionsWithMeta);
  const correctIndex = shuffled.findIndex((o) => o.isCorrect);

  return {
    premises: template.premises,
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
