import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  Square,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { GameShell } from "../GameShell";
import { GameInstructions } from "../GameInstructions";
import { GameResults } from "../GameResults";
import { FeedbackOverlay } from "../FeedbackEffects";
import {
  generateLogicGridChallenge,
  validateLogicSolution,
  checkLogicGridContradiction,
  getLogicGridHint,
  type LogicGridChallenge,
  type DeductionAssignment,
} from "../../../lib/cognitive-lab/engines/logic-grid";
import { GAME_META, DIFFICULTY_LABELS } from "../../../lib/cognitive-lab/constants";
import { useCognitiveLabStore } from "../../../stores/cognitive-lab-store";
import type { DifficultyLevel, GameResult } from "../../../lib/cognitive-lab/types";

const META = GAME_META["logic-grid"];

type MatrixState = "empty" | "cross" | "check";

export function LogicGridGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"instructions" | "playing" | "results">("instructions");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(3);
  const [challenge, setChallenge] = useState<LogicGridChallenge | null>(null);

  // Matrix cell state: key is `person:attribute` -> "empty" | "cross" | "check"
  const [matrix, setMatrix] = useState<Record<string, MatrixState>>({});

  // Checked state for clues
  const [checkedClues, setCheckedClues] = useState<Record<number, boolean>>({});

  // Player's final deduction cards: { [person]: { location?: string, item?: string } }
  const [deductions, setDeductions] = useState<Record<string, DeductionAssignment>>({});

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [contradictionAlert, setContradictionAlert] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<GameResult | null>(null);

  const store = useCognitiveLabStore();
  const bestScore = store.getBestScore("logic-grid");
  const hintCost = store.getHintCost();

  const startNewGame = useCallback((diff: DifficultyLevel = 3) => {
    setDifficulty(diff);
    setScore(0);
    setStreak(0);
    setMistakes(0);
    setHintsUsed(0);
    setTimeLeft(300);
    setIsPaused(false);
    setMatrix({});
    setCheckedClues({});
    setStatusMessage(null);
    setContradictionAlert(null);

    const newChallenge = generateLogicGridChallenge(diff);
    setChallenge(newChallenge);

    // Initial empty deductions for each person
    const initialDeductions: Record<string, DeductionAssignment> = {};
    for (const p of newChallenge.primaryCategory.items) {
      initialDeductions[p] = {};
    }
    setDeductions(initialDeductions);
    setGameState("playing");
  }, []);

  const finishGame = useCallback(
    (isWon: boolean, currentDeductions?: Record<string, DeductionAssignment>) => {
      const activeDeductions = currentDeductions ?? deductions;
      const durationMs = (300 - timeLeft) * 1000;
      
      let scorePercentage = 0;
      if (isWon) {
        scorePercentage = Math.max(60, Math.min(100, Math.round(100 - (mistakes * 6) - (hintsUsed * 5))));
      } else if (challenge) {
        const evalRes = validateLogicSolution(challenge, activeDeductions);
        scorePercentage = Math.min(55, Math.round((evalRes.correctCount / challenge.totalMatchesToFind) * 50));
      }

      const attemptId = `logicgrid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const coinsEarned = store.claimReward(attemptId, scorePercentage, difficulty);
      const totalScore = Math.round(scorePercentage * 10 * difficulty);

      const result: GameResult = {
        id: attemptId,
        gameId: "logic-grid",
        playedAt: Date.now(),
        difficulty,
        totalRounds: 1,
        correctRounds: isWon ? 1 : 0,
        score: totalScore,
        scorePercentage,
        isSuccess: scorePercentage >= 60,
        coinsEarned,
        hintsUsed,
        mistakes,
        accuracy: scorePercentage,
        avgResponseTimeMs: Math.round(durationMs / 6),
        maxStreak: isWon ? 1 : 0,
        durationMs,
        rounds: [
          {
            roundIndex: 1,
            correct: isWon,
            responseTimeMs: durationMs,
            score: totalScore,
          },
        ],
      };

      store.recordResult(result);
      setFinalResult(result);
      setGameState("results");
    },
    [challenge, deductions, difficulty, hintsUsed, mistakes, store, timeLeft]
  );

  // Timer loop
  useEffect(() => {
    if (gameState !== "playing" || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, isPaused, finishGame]);

  // Check auto-completion whenever deductions update
  const checkCompletion = useCallback(
    (currentDeductions: Record<string, DeductionAssignment>) => {
      if (!challenge) return;
      const evalResult = validateLogicSolution(challenge, currentDeductions);
      if (evalResult.isCorrect) {
        setFeedback("correct");
        setStatusMessage("✓ All deductions correctly confirmed!");
        setTimeout(() => {
          setFeedback(null);
          finishGame(true, currentDeductions);
        }, 700);
      }
    },
    [challenge, finishGame]
  );

  // Toggle matrix cell state with Contradiction Prevention and Mutual Exclusion
  const handleToggleCell = (key: string, person: string, attribute: string, isLocation: boolean) => {
    if (!challenge) return;
    setContradictionAlert(null);

    const current = matrix[key] || "empty";
    let nextState: MatrixState = "empty";

    if (current === "empty") nextState = "cross";
    else if (current === "cross") nextState = "check";
    else nextState = "empty";

    // If attempting to confirm (✓), check for Contradictions!
    if (nextState === "check") {
      const contradiction = checkLogicGridContradiction(challenge, person, attribute);
      if (contradiction.isContradiction) {
        setContradictionAlert(contradiction.reason ?? `Contradiction: ${person} cannot be stationed with ${attribute}!`);
        setMistakes((m) => m + 1);
        setFeedback("incorrect");
        setTimeout(() => setFeedback(null), 1200);
        return; // Prevent contradictory confirmed check!
      }

      // Mutual Exclusion: Confirmation automatically eliminates other options in same row/col
      const nextMatrix = { ...matrix };
      const groupItems = isLocation
        ? challenge.secondaryCategory.items
        : challenge.tertiaryCategory?.items ?? [];

      // 1. Mark all other attributes in this category for this person as cross
      for (const otherAttr of groupItems) {
        if (otherAttr !== attribute) {
          nextMatrix[`${person}:${otherAttr}`] = "cross";
        }
      }

      // 2. Mark all other operatives for this attribute as cross
      for (const otherPerson of challenge.primaryCategory.items) {
        if (otherPerson !== person) {
          nextMatrix[`${otherPerson}:${attribute}`] = "cross";
        }
      }

      nextMatrix[key] = "check";
      setMatrix(nextMatrix);

      // Sync deduction card
      const updatedDeductions = {
        ...deductions,
        [person]: {
          ...deductions[person],
          [isLocation ? "location" : "item"]: attribute,
        },
      };
      setDeductions(updatedDeductions);

      // Automatic completion check
      checkCompletion(updatedDeductions);
      return;
    }

    if (nextState === "cross") {
      setMatrix((prev) => ({ ...prev, [key]: "cross" }));
      // If was previously checked in deductions card, remove it
      if (current === "check") {
        setDeductions((d) => {
          const personDed = { ...(d[person] ?? {}) };
          if (isLocation && personDed.location === attribute) delete personDed.location;
          if (!isLocation && personDed.item === attribute) delete personDed.item;
          return { ...d, [person]: personDed };
        });
      }
      return;
    }

    // nextState === "empty"
    setMatrix((prev) => ({ ...prev, [key]: "empty" }));
    if (current === "check") {
      setDeductions((d) => {
        const personDed = { ...(d[person] ?? {}) };
        if (isLocation && personDed.location === attribute) delete personDed.location;
        if (!isLocation && personDed.item === attribute) delete personDed.item;
        return { ...d, [person]: personDed };
      });
    }
  };

  const handleClueCheck = (clueId: number) => {
    setCheckedClues((prev) => ({ ...prev, [clueId]: !prev[clueId] }));
  };

  const handleClearMatrix = () => {
    if (!challenge) return;
    setMatrix({});
    const emptyDeds: Record<string, DeductionAssignment> = {};
    for (const p of challenge.primaryCategory.items) {
      emptyDeds[p] = {};
    }
    setDeductions(emptyDeds);
    setContradictionAlert(null);
    setStatusMessage("Elimination grid and deductions reset.");
    setTimeout(() => setStatusMessage(null), 1800);
  };

  // Provide hint with universal coin system
  const handleHint = () => {
    if (!challenge) return;
    const hint = getLogicGridHint(challenge, deductions);
    if (!hint) {
      setStatusMessage("All assignments are already correctly placed!");
      setTimeout(() => setStatusMessage(null), 2000);
      return;
    }

    const req = store.requestHint();
    if (!req.success) {
      setStatusMessage(req.error || "Not enough coins for this hint.");
      setTimeout(() => setStatusMessage(null), 2500);
      return;
    }

    setHintsUsed((h) => h + 1);

    // Apply hint to matrix and deductions with mutual exclusion
    const key = `${hint.person}:${hint.value}`;
    const nextMatrix = { ...matrix };
    const groupItems = hint.isLocation
      ? challenge.secondaryCategory.items
      : challenge.tertiaryCategory?.items ?? [];

    for (const otherAttr of groupItems) {
      if (otherAttr !== hint.value) {
        nextMatrix[`${hint.person}:${otherAttr}`] = "cross";
      }
    }
    for (const otherPerson of challenge.primaryCategory.items) {
      if (otherPerson !== hint.person) {
        nextMatrix[`${otherPerson}:${hint.value}`] = "cross";
      }
    }
    nextMatrix[key] = "check";
    setMatrix(nextMatrix);

    const updatedDeductions = {
      ...deductions,
      [hint.person]: {
        ...deductions[hint.person],
        [hint.isLocation ? "location" : "item"]: hint.value,
      },
    };
    setDeductions(updatedDeductions);
    setStatusMessage(`Hint: Confirmed ${hint.person} → ${hint.value}`);
    setTimeout(() => setStatusMessage(null), 2500);

    // Auto-complete if finished
    checkCompletion(updatedDeductions);
  };

  if (gameState === "instructions") {
    return (
      <GameInstructions
        gameName={META.name}
        icon={META.icon}
        instructions={[
          "Read the clues carefully to deduce which operative matches each location and equipment.",
          "Use the interactive elimination matrix:",
          "• Tap once for ✕ (Eliminated — cannot be true)",
          "• Tap twice for ✓ (Confirmed Match)",
          "• Tap again to clear",
          "Contradictions (e.g. attempting to confirm a proven impossibility) are blocked and flagged.",
          "Puzzle auto-completes as soon as the full logical match is verified!",
        ]}
        onStart={() => startNewGame(difficulty)}
        onBack={() => navigate("/app/cognitive-hub")}
      >
        <div className="mt-4 flex flex-col items-center gap-2">
          <label htmlFor="diff-select" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Difficulty
          </label>
          <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
            {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  difficulty === d
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </div>
      </GameInstructions>
    );
  }

  if (gameState === "results" && finalResult) {
    return (
      <GameResults
        result={finalResult}
        gameTitle={META.name}
        bestScore={bestScore}
        onReplay={() => startNewGame(difficulty)}
        onExit={() => navigate("/app/cognitive-hub")}
      />
    );
  }

  return (
    <GameShell
      title={META.name}
      categoryName={META.categoryLabel}
      categoryIcon={META.icon}
      difficulty={difficulty}
      score={score}
      streak={streak}
      timeLeft={timeLeft}
      maxTime={300}
      isPaused={isPaused}
      onPauseToggle={() => setIsPaused(!isPaused)}
      onRestart={() => startNewGame(difficulty)}
      onBack={() => navigate("/app/cognitive-hub")}
    >
      <FeedbackOverlay feedback={feedback} />

      <div className="w-full flex flex-col items-center max-w-2xl space-y-4 sm:space-y-6">
        {/* Status Bar */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 px-4 w-full flex items-center justify-between text-xs font-bold shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {DIFFICULTY_LABELS[difficulty]} Puzzle
          </span>
          <div className="flex items-center gap-3">
            <span className={mistakes > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-400"}>
              Mistakes: {mistakes}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-600 dark:text-amber-400">Hints: {hintsUsed}</span>
            <span className="text-slate-400">•</span>
            <span className="text-indigo-600 dark:text-cyan-400">🪙 {store.coins}</span>
            <span className="text-slate-400">•</span>
            <button
              type="button"
              onClick={handleClearMatrix}
              className="text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Grid
            </button>
          </div>
        </div>

        {/* Contradiction Alert Notification */}
        {contradictionAlert && (
          <div className="w-full text-xs font-extrabold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 p-3 rounded-2xl flex items-center gap-2 animate-pulse shadow-sm">
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <span>{contradictionAlert}</span>
          </div>
        )}

        {statusMessage && (
          <div className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl animate-fade-in flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Clues Section */}
        {challenge && (
          <div className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span>Logical Clues &amp; Constraints</span>
                <span className="text-[11px] font-normal lowercase">(check off as you deduce)</span>
              </h3>
              <button
                type="button"
                onClick={handleHint}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors shadow-xs"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{hintCost === 0 ? "Hint (Free)" : `Hint (${hintCost}🪙)`}</span>
              </button>
            </div>
            <div className="space-y-1.5">
              {challenge.clues.map((clue) => {
                const isChecked = !!checkedClues[clue.id];
                return (
                  <button
                    key={clue.id}
                    type="button"
                    onClick={() => handleClueCheck(clue.id)}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left text-xs sm:text-sm font-medium transition-colors ${
                      isChecked
                        ? "bg-slate-200/60 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 line-through"
                        : "hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{clue.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Elimination Matrix */}
        {challenge && (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-3 overflow-x-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Elimination Matrix (Tap: ✕ Eliminated / ✓ Confirmed)
              </h3>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                <span className="flex items-center gap-1"><span className="text-rose-600 font-black">✕</span> Eliminated</span>
                <span className="flex items-center gap-1"><span className="text-emerald-600 font-black">✓</span> Confirmed</span>
              </div>
            </div>

            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    Operative
                  </th>
                  {challenge.secondaryCategory.items.map((loc) => (
                    <th
                      key={loc}
                      className="p-1.5 sm:p-2 font-bold text-slate-700 dark:text-slate-300 border-b border-l border-slate-200 dark:border-slate-800"
                    >
                      <span className="block truncate max-w-[80px]" title={loc}>
                        {loc}
                      </span>
                    </th>
                  ))}
                  {challenge.tertiaryCategory?.items.map((item) => (
                    <th
                      key={item}
                      className="p-1.5 sm:p-2 font-bold text-indigo-700 dark:text-cyan-400 border-b border-l border-slate-200 dark:border-slate-800"
                    >
                      <span className="block truncate max-w-[80px]" title={item}>
                        {item}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {challenge.primaryCategory.items.map((person) => (
                  <tr key={person} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-2 text-left font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {person}
                    </td>

                    {/* Locations Columns */}
                    {challenge.secondaryCategory.items.map((loc) => {
                      const key = `${person}:${loc}`;
                      const state = matrix[key] || "empty";

                      return (
                        <td key={loc} className="p-1 border-l border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => handleToggleCell(key, person, loc, true)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                              state === "cross"
                                ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
                                : state === "check"
                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            {state === "cross" ? "✕" : state === "check" ? "✓" : "•"}
                          </button>
                        </td>
                      );
                    })}

                    {/* Items Columns (if tertiary exists) */}
                    {challenge.tertiaryCategory?.items.map((item) => {
                      const key = `${person}:${item}`;
                      const state = matrix[key] || "empty";

                      return (
                        <td key={item} className="p-1 border-l border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => handleToggleCell(key, person, item, false)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                              state === "cross"
                                ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
                                : state === "check"
                                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            {state === "cross" ? "✕" : state === "check" ? "✓" : "•"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Confirmed Deductions Cards */}
        {challenge && (
          <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Confirmed Deductions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {challenge.primaryCategory.items.map((person) => {
                const current = deductions[person] || {};

                return (
                  <div
                    key={person}
                    className="p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-xs"
                  >
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 block">
                      {person}
                    </span>

                    {/* Location select */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-16">Location:</span>
                      <select
                        aria-label={`Location for ${person}`}
                        value={current.location || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            const contradiction = checkLogicGridContradiction(challenge, person, val);
                            if (contradiction.isContradiction) {
                              setContradictionAlert(contradiction.reason ?? `Contradiction: ${person} cannot be at ${val}!`);
                              setMistakes((m) => m + 1);
                              setFeedback("incorrect");
                              setTimeout(() => setFeedback(null), 1200);
                              return;
                            }
                          }
                          const updated = {
                            ...deductions,
                            [person]: {
                              ...deductions[person],
                              location: val || undefined,
                            },
                          };
                          setDeductions(updated);
                          checkCompletion(updated);
                        }}
                        className="flex-1 text-xs font-bold p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">(Unassigned)</option>
                        {challenge.secondaryCategory.items.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Item select if applicable */}
                    {challenge.tertiaryCategory && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-16">Item:</span>
                        <select
                          aria-label={`Item for ${person}`}
                          value={current.item || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const contradiction = checkLogicGridContradiction(challenge, person, val);
                              if (contradiction.isContradiction) {
                                setContradictionAlert(contradiction.reason ?? `Contradiction: ${person} cannot carry ${val}!`);
                                setMistakes((m) => m + 1);
                                setFeedback("incorrect");
                                setTimeout(() => setFeedback(null), 1200);
                                return;
                              }
                            }
                            const updated = {
                              ...deductions,
                              [person]: {
                                ...deductions[person],
                                item: val || undefined,
                              },
                            };
                            setDeductions(updated);
                            checkCompletion(updated);
                          }}
                          className="flex-1 text-xs font-bold p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="">(Unassigned)</option>
                          {challenge.tertiaryCategory.items.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
