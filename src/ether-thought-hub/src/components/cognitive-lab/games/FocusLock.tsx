import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, CheckCircle2, Flag } from "lucide-react";
import { GameShell } from "../GameShell";
import { GameInstructions } from "../GameInstructions";
import { GameResults } from "../GameResults";
import { FeedbackOverlay } from "../FeedbackEffects";
import {
  generateFocusLockChallenge,
  validateFocusLockAnswer,
  type FocusLockChallenge,
} from "../../../lib/cognitive-lab/engines/focus-lock";
import { calcRoundScore } from "../../../lib/cognitive-lab/scoring";
import { GAME_META, DIFFICULTY_LABELS } from "../../../lib/cognitive-lab/constants";
import { useCognitiveLabStore } from "../../../stores/cognitive-lab-store";
import type { DifficultyLevel, GameResult } from "../../../lib/cognitive-lab/types";
import { ShapeIcon } from "../../../../../cognitive-hub/components/gameVisuals";

const META = GAME_META["focus-lock"];

export function FocusLockGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"instructions" | "playing" | "results">("instructions");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(3);
  const [challenge, setChallenge] = useState<FocusLockChallenge | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<GameResult | null>(null);

  const store = useCognitiveLabStore();
  const bestScore = store.getBestScore("focus-lock");
  const hintCost = store.getHintCost();

  const startNewGame = useCallback((diff: DifficultyLevel = 3) => {
    setDifficulty(diff);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalRounds(0);
    setHintsUsed(0);
    setTimeLeft(45);
    setIsPaused(false);
    setSelectedIds(new Set());
    setStatusMessage(null);
    const initialChallenge = generateFocusLockChallenge(diff);
    setChallenge(initialChallenge);
    setGameState("playing");
  }, []);

  const finishGame = useCallback(() => {
    const accuracy = totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0;
    const scorePercentage = accuracy;
    const durationMs = (45 - timeLeft) * 1000;
    const attemptId = `focuslock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const coinsEarned = store.claimReward(attemptId, scorePercentage, difficulty);

    const result: GameResult = {
      id: attemptId,
      gameId: "focus-lock",
      playedAt: Date.now(),
      difficulty,
      totalRounds,
      correctRounds: correctCount,
      score,
      scorePercentage,
      isSuccess: scorePercentage >= 60,
      coinsEarned,
      hintsUsed,
      accuracy,
      avgResponseTimeMs: 400,
      maxStreak,
      durationMs,
      rounds: [],
    };

    store.recordResult(result);
    setFinalResult(result);
    setGameState("results");
  }, [totalRounds, correctCount, score, timeLeft, maxStreak, difficulty, hintsUsed, store]);

  // Timer loop
  useEffect(() => {
    if (gameState !== "playing" || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, isPaused, finishGame]);

  const toggleSelectItem = (id: number) => {
    if (!challenge) return;
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSubmittingAnswer = () => {
    if (!challenge) return;
    const isCorrect = validateFocusLockAnswer(challenge, selectedIds);
    setTotalRounds((prev) => prev + 1);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      const roundPts = calcRoundScore({
        correct: true,
        responseTimeMs: 300,
        difficulty,
        streak: newStreak,
      });
      setScore((prev) => prev + roundPts);
      setFeedback("correct");
    } else {
      setStreak(0);
      setFeedback("incorrect");
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedIds(new Set());
      setChallenge(generateFocusLockChallenge(difficulty));
    }, 400);
  };

  const handleHint = () => {
    if (!challenge) return;
    // Find unselected target
    const target = challenge.grid.find((item) => item.isTarget && !selectedIds.has(item.id));
    if (!target) {
      setStatusMessage("All targets in this round are already selected!");
      setTimeout(() => setStatusMessage(null), 1800);
      return;
    }

    const req = store.requestHint();
    if (!req.success) {
      setStatusMessage(req.error || "Not enough coins for this hint.");
      setTimeout(() => setStatusMessage(null), 2500);
      return;
    }

    setHintsUsed((h) => h + 1);
    const next = new Set(selectedIds);
    next.add(target.id);
    setSelectedIds(next);
    setStatusMessage(`Hint: Target ${target.color} ${target.shape} highlighted!`);
    setTimeout(() => setStatusMessage(null), 2000);
  };

  if (gameState === "instructions") {
    return (
      <GameInstructions
        gameName={META.name}
        icon={META.icon}
        instructions={[
          "Identify the target criteria shown at the top.",
          "Select all matching symbols in the grid.",
          "Avoid clicking non-matching distractors.",
          "Click 'Confirm Selection' to score each round.",
          "Reach 60% accuracy or higher to earn rewards!",
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
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
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
      maxTime={45}
      isPaused={isPaused}
      onPauseToggle={() => setIsPaused(!isPaused)}
      onRestart={() => startNewGame(difficulty)}
      onBack={() => navigate("/app/cognitive-hub")}
    >
      <FeedbackOverlay feedback={feedback} />

      <div className="w-full flex flex-col items-center max-w-xl space-y-5">
        {/* Status Bar */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 px-4 w-full flex items-center justify-between text-xs font-bold shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Round {totalRounds + 1}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-slate-600 dark:text-slate-300">Correct: {correctCount}/{totalRounds}</span>
            <span className="text-slate-400">•</span>
            <button
              type="button"
              onClick={handleHint}
              className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{hintCost === 0 ? "Hint (Free)" : `Hint (${hintCost}🪙)`}</span>
            </button>
            <span className="text-slate-400">•</span>
            <span className="text-indigo-600 dark:text-cyan-400">🪙 {store.coins}</span>
          </div>
        </div>

        {statusMessage && (
          <div className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl animate-fade-in text-center w-full">
            {statusMessage}
          </div>
        )}

        {/* Target criteria */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 text-center w-full shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-2">Target Criteria</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select all:</span>
            {challenge && (
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <ShapeIcon shape={challenge.targetShape} color={challenge.targetColor} size="md" />
                <span className="text-base font-black uppercase tracking-wide text-slate-900 dark:text-slate-100">
                  {challenge.targetColor} {challenge.targetShape}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid gap-3 w-full p-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm"
          style={{
            gridTemplateColumns: `repeat(${challenge?.gridSize || 4}, minmax(0, 1fr))`,
          }}
        >
          {challenge?.grid.map((item) => {
            const isSelected = selectedIds.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleSelectItem(item.id)}
                aria-label={`${item.color} ${item.shape}`}
                title={`${item.color} ${item.shape}`}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-150 border-2 relative focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:border-indigo-400 scale-95 ring-4 ring-indigo-500/20"
                    : "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <ShapeIcon shape={item.shape} color={item.color} size={challenge.gridSize >= 5 ? 24 : 32} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1 select-none">
                  {item.shape[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Actions: Confirm Selection & Finish Module */}
        <div className="w-full flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmittingAnswer}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/20 transition-all duration-150 active:scale-98 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Selection ({selectedIds.size})</span>
          </button>

          <button
            type="button"
            onClick={finishGame}
            disabled={totalRounds === 0}
            className="py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            title="Finish module and view score"
          >
            <Flag className="w-4 h-4" />
            <span>Finish</span>
          </button>
        </div>
      </div>
    </GameShell>
  );
}
