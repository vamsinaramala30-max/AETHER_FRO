import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Flag } from "lucide-react";
import { GameShell } from "../GameShell";
import { GameInstructions } from "../GameInstructions";
import { GameResults } from "../GameResults";
import { FeedbackOverlay } from "../FeedbackEffects";
import {
  generateLogicForgeChallenge,
  validateLogicForgeAnswer,
  type LogicForgeChallenge,
} from "../../../lib/cognitive-lab/engines/logic-forge";
import { calcRoundScore } from "../../../lib/cognitive-lab/scoring";
import { GAME_META, DIFFICULTY_LABELS } from "../../../lib/cognitive-lab/constants";
import { useCognitiveLabStore } from "../../../stores/cognitive-lab-store";
import type { DifficultyLevel, GameResult } from "../../../lib/cognitive-lab/types";

const META = GAME_META["logic-forge"];

export function LogicForgeGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"instructions" | "playing" | "results">("instructions");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(3);
  const [challenge, setChallenge] = useState<LogicForgeChallenge | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<GameResult | null>(null);

  const store = useCognitiveLabStore();
  const bestScore = store.getBestScore("logic-forge");
  const hintCost = store.getHintCost();

  const startNewGame = useCallback((diff: DifficultyLevel = 3) => {
    setDifficulty(diff);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalRounds(0);
    setHintsUsed(0);
    setTimeLeft(60);
    setIsPaused(false);
    setEliminatedOptions([]);
    setStatusMessage(null);
    setChallenge(generateLogicForgeChallenge(diff));
    setGameState("playing");
  }, []);

  const finishGame = useCallback(() => {
    const accuracy = totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0;
    const scorePercentage = accuracy;
    const durationMs = (60 - timeLeft) * 1000;
    const attemptId = `logicforge_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const coinsEarned = store.claimReward(attemptId, scorePercentage, difficulty);

    const result: GameResult = {
      id: attemptId,
      gameId: "logic-forge",
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
      avgResponseTimeMs: 600,
      maxStreak,
      durationMs,
      rounds: [],
    };

    store.recordResult(result);
    setFinalResult(result);
    setGameState("results");
  }, [totalRounds, correctCount, score, timeLeft, maxStreak, difficulty, hintsUsed, store]);

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

  const handleSelectOption = (optionIndex: number) => {
    if (!challenge) return;
    const isCorrect = validateLogicForgeAnswer(challenge, optionIndex);
    setTotalRounds((prev) => prev + 1);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      const pts = calcRoundScore({
        correct: true,
        responseTimeMs: 600,
        difficulty,
        streak: newStreak,
      });
      setScore((prev) => prev + pts);
      setFeedback("correct");
    } else {
      setStreak(0);
      setFeedback("incorrect");
    }

    setTimeout(() => {
      setFeedback(null);
      setEliminatedOptions([]);
      setChallenge(generateLogicForgeChallenge(difficulty));
    }, 400);
  };

  const handleHint = () => {
    if (!challenge) return;
    // Find wrong option not yet eliminated
    const wrongOptions = challenge.options
      .map((_, i) => i)
      .filter((i) => i !== challenge.correctIndex && !eliminatedOptions.includes(i));

    if (wrongOptions.length === 0) {
      setStatusMessage("Only the correct conclusion remains!");
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
    const toEliminate = wrongOptions[0]!;
    setEliminatedOptions((prev) => [...prev, toEliminate]);
    setStatusMessage(`Hint: Option ${String.fromCharCode(65 + toEliminate)} eliminated!`);
    setTimeout(() => setStatusMessage(null), 2000);
  };

  if (gameState === "instructions") {
    return (
      <GameInstructions
        gameName={META.name}
        icon={META.icon}
        instructions={[
          "Read the given logical premises carefully.",
          "Select the only conclusion that logically must follow.",
          "Score 60% accuracy or higher to earn coin rewards!",
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
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
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
      maxTime={60}
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

        {/* Premises Card */}
        <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-indigo-600 dark:text-cyan-400 font-bold block">
              Given Premises
            </span>
          </div>
          <div className="space-y-2.5">
            {challenge?.premises.map((premise, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <span className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold font-mono border border-indigo-200 dark:border-indigo-800">
                  P{idx + 1}
                </span>
                <span className="text-slate-800 dark:text-slate-200 text-base font-semibold leading-relaxed">
                  {premise}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Question Header */}
        <div className="w-full bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-xs uppercase font-bold tracking-wider text-indigo-700 dark:text-indigo-300">
            Which conclusion MUST follow logically?
          </p>
        </div>

        {/* Options */}
        <div className="w-full grid gap-3">
          {challenge?.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            const isEliminated = eliminatedOptions.includes(index);

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectOption(index)}
                disabled={isEliminated}
                className={`w-full py-4 px-5 rounded-2xl border-2 transition-all duration-150 flex items-center justify-between gap-4 shadow-sm text-left focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                  isEliminated
                    ? "bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-40 line-through cursor-not-allowed text-slate-400"
                    : "bg-white dark:bg-slate-900 hover:bg-indigo-50/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-900 dark:text-slate-100 font-semibold text-base active:scale-98"
                }`}
              >
                <span className="leading-snug">{option}</span>
                <span className="flex-shrink-0 text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {letter}
                </span>
              </button>
            );
          })}
        </div>

        {/* Finish Module Action */}
        <div className="w-full pt-1">
          <button
            type="button"
            onClick={finishGame}
            disabled={totalRounds === 0}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Flag className="w-4 h-4" />
            <span>Finish Reasoning Module &amp; View Result</span>
          </button>
        </div>
      </div>
    </GameShell>
  );
}
