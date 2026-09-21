import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Flag } from "lucide-react";
import { GameShell } from "../GameShell";
import { GameInstructions } from "../GameInstructions";
import { GameResults } from "../GameResults";
import { FeedbackOverlay } from "../FeedbackEffects";
import {
  generateCodeBreakerChallenge,
  scoreGuess,
  type CodeBreakerChallenge,
  type CodeColor,
} from "../../../lib/cognitive-lab/engines/code-breaker";
import { calcRoundScore } from "../../../lib/cognitive-lab/scoring";
import { GAME_META, DIFFICULTY_LABELS } from "../../../lib/cognitive-lab/constants";
import { useCognitiveLabStore } from "../../../stores/cognitive-lab-store";
import type { DifficultyLevel, GameResult } from "../../../lib/cognitive-lab/types";

import { ShapeIcon, getGameColor } from "../../../../../cognitive-hub/components/gameVisuals";

const META = GAME_META["code-breaker"];

interface CodeAttempt {
  guess: CodeColor[];
  blacks: number;
  whites: number;
}

function ColorPeg({
  color,
  size = "md",
  showLabel = false,
}: {
  color: CodeColor;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const token = getGameColor(color);
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`${sizeClasses[size]} rounded-full shadow-sm flex items-center justify-center transition-all border-2 flex-shrink-0`}
        style={{
          backgroundColor: token.fill,
          borderColor: token.stroke,
          boxShadow: `0 2px 5px ${token.ring}`,
        }}
        title={token.name}
        aria-label={token.name}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-inner" />
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 capitalize tracking-tight">
          {token.name}
        </span>
      )}
    </div>
  );
}

export function CodeBreakerGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"instructions" | "playing" | "results">("instructions");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(3);
  const [challenge, setChallenge] = useState<CodeBreakerChallenge | null>(null);
  const [currentGuess, setCurrentGuess] = useState<CodeColor[]>([]);
  const [attempts, setAttempts] = useState<CodeAttempt[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [finalResult, setFinalResult] = useState<GameResult | null>(null);

  const store = useCognitiveLabStore();
  const bestScore = store.getBestScore("code-breaker");
  const hintCost = store.getHintCost();

  const startNewGame = useCallback((diff: DifficultyLevel = 3) => {
    setDifficulty(diff);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalRounds(0);
    setHintsUsed(0);
    setStatusMessage(null);
    setTimeLeft(90);
    setIsPaused(false);
    setAttempts([]);
    setCurrentGuess([]);
    const initialChallenge = generateCodeBreakerChallenge(diff);
    setChallenge(initialChallenge);
    setGameState("playing");
  }, []);

  const finishGame = useCallback(() => {
    const accuracy = totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0;
    const scorePercentage = accuracy;
    const durationMs = (90 - timeLeft) * 1000;
    const attemptId = `codebreaker_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const coinsEarned = store.claimReward(attemptId, scorePercentage, difficulty);

    const result: GameResult = {
      id: attemptId,
      gameId: "code-breaker",
      playedAt: Date.now(),
      difficulty,
      totalRounds: Math.max(1, totalRounds),
      correctRounds: correctCount,
      score,
      scorePercentage,
      isSuccess: scorePercentage >= 60,
      coinsEarned,
      hintsUsed,
      mistakes: attempts.length,
      accuracy,
      avgResponseTimeMs: 800,
      maxStreak,
      durationMs,
      rounds: [],
    };

    store.recordResult(result);
    setFinalResult(result);
    setGameState("results");
  }, [totalRounds, correctCount, score, timeLeft, maxStreak, difficulty, hintsUsed, attempts.length, store]);

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

  const handleColorSelect = (color: CodeColor) => {
    if (!challenge) return;
    if (currentGuess.length < challenge.codeLength) {
      setCurrentGuess([...currentGuess, color]);
    }
  };

  const handleRemoveColor = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const handleHint = () => {
    if (!challenge) return;
    const res = store.requestHint();
    if (!res.success) {
      setStatusMessage(res.error || "Not enough coins for this hint.");
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    setHintsUsed((prev) => prev + 1);

    // Reveal the peg at the current guess index or next unplaced position
    const targetIdx = currentGuess.length < challenge.codeLength ? currentGuess.length : 0;
    const correctColor = challenge.secretCode[targetIdx];
    if (correctColor) {
      const colorToken = getGameColor(correctColor);
      if (currentGuess.length < challenge.codeLength) {
        setCurrentGuess((prev) => [...prev, correctColor]);
        setStatusMessage(`Hint added position ${targetIdx + 1}: ${colorToken.name}!`);
      } else {
        setStatusMessage(`Hint: Position ${targetIdx + 1} is ${colorToken.name}!`);
      }
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleSubmitGuess = () => {
    if (!challenge || currentGuess.length !== challenge.codeLength) return;

    const { blacks, whites } = scoreGuess(challenge.secretCode, currentGuess);
    const newAttempt: CodeAttempt = {
      guess: currentGuess,
      blacks,
      whites,
    };

    const updatedAttempts = [...attempts, newAttempt];
    setAttempts(updatedAttempts);
    setCurrentGuess([]);

    // Solved!
    if (blacks === challenge.codeLength) {
      setCorrectCount((prev) => prev + 1);
      setTotalRounds((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      const pts = calcRoundScore({
        correct: true,
        responseTimeMs: 800,
        difficulty,
        streak: newStreak,
      });
      setScore((prev) => prev + pts);
      setFeedback("correct");

      setTimeout(() => {
        setFeedback(null);
        setAttempts([]);
        setChallenge(generateCodeBreakerChallenge(difficulty));
      }, 600);
    } else if (updatedAttempts.length >= challenge.maxGuesses) {
      setTotalRounds((prev) => prev + 1);
      setStreak(0);
      setFeedback("incorrect");

      setTimeout(() => {
        setFeedback(null);
        setAttempts([]);
        setChallenge(generateCodeBreakerChallenge(difficulty));
      }, 600);
    }
  };

  if (gameState === "instructions") {
    return (
      <GameInstructions
        gameName={META.name}
        icon={META.icon}
        instructions={[
          "Guess the hidden color code sequence.",
          "🎯 Black peg = correct color & exact position.",
          "🔍 White peg = correct color, but wrong position.",
          "Use the hint feature if you need help uncovering hidden pegs.",
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
      maxTime={90}
      isPaused={isPaused}
      onPauseToggle={() => setIsPaused(!isPaused)}
      onRestart={() => startNewGame(difficulty)}
      onBack={() => navigate("/app/cognitive-hub")}
    >
      <FeedbackOverlay feedback={feedback} />

      <div className="w-full flex flex-col items-center max-w-lg space-y-4 sm:space-y-5">
        {/* Status / Hint / Coins Bar */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 px-4 w-full flex items-center justify-between text-xs font-bold shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Codes Broken: {correctCount}
          </span>
          <div className="flex items-center gap-3">
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
          <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl animate-fade-in text-center w-full">
            {statusMessage}
          </div>
        )}

        {/* Attempts Board */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 min-h-[200px]">
          <div className="flex justify-between items-center text-xs font-mono text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Attempts: {attempts.length} / {challenge?.maxGuesses || 8}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white inline-block shadow-sm" /> Exact
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-full bg-white border-2 border-slate-500 inline-block shadow-sm" /> Close
              </span>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {attempts.map((att, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-slate-400 w-5">#{i + 1}</span>
                  <div className="flex gap-2">
                    {att.guess.map((c, idx) => (
                      <ColorPeg key={idx} color={c} size="sm" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <div
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg font-bold"
                    title={`${att.blacks} exact match (correct color & position)`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white inline-block" />
                    <span>{att.blacks}</span>
                  </div>
                  <div
                    className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg font-bold"
                    title={`${att.whites} color match (wrong position)`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400 inline-block" />
                    <span>{att.whites}</span>
                  </div>
                </div>
              </div>
            ))}

            {attempts.length === 0 && (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 font-sans text-xs">
                Select colors below to break the secret {challenge?.codeLength || 4}-color sequence!
              </div>
            )}
          </div>
        </div>

        {/* Current Active Guess */}
        <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Guess</div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            {Array.from({ length: challenge?.codeLength || 4 }).map((_, idx) => {
              const color = currentGuess[idx];
              return (
                <div
                  key={idx}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center shadow-inner"
                >
                  {color ? (
                    <ColorPeg color={color} size="md" />
                  ) : (
                    <span className="text-xs font-mono text-slate-300 dark:text-slate-600 font-bold">{idx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
          {currentGuess.length > 0 ? (
            <button
              type="button"
              onClick={handleRemoveColor}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              Undo
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>

        {/* Color Pool */}
        <div className="w-full space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Choose Next Color</div>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 w-full">
            {challenge?.colorPool.map((color, idx) => {
              const token = getGameColor(color);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  disabled={currentGuess.length >= (challenge?.codeLength || 4)}
                  className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 flex flex-col items-center gap-1 transition-all duration-150 active:scale-95 disabled:opacity-40 shadow-sm"
                  title={`Select ${token.name}`}
                >
                  <ColorPeg color={color} size="md" />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 capitalize">
                    {token.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons: Finish Attempt & Submit */}
        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={finishGame}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
          >
            <Flag className="w-4 h-4" />
            <span>Finish Attempt</span>
          </button>

          <button
            type="button"
            onClick={handleSubmitGuess}
            disabled={currentGuess.length !== challenge?.codeLength}
            className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-md shadow-indigo-600/20 transition-all duration-150 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Deduction
          </button>
        </div>
      </div>
    </GameShell>
  );
}
