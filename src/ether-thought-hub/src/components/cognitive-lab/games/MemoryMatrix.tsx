import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Flag, CheckCircle2 } from "lucide-react";
import { GameShell } from "../GameShell";
import { GameInstructions } from "../GameInstructions";
import { GameResults } from "../GameResults";
import { FeedbackOverlay } from "../FeedbackEffects";
import {
  generateMemoryMatrixChallenge,
  validateMemoryMatrixAnswer,
  type MemoryMatrixChallenge,
} from "../../../lib/cognitive-lab/engines/memory-matrix";
import { calcRoundScore } from "../../../lib/cognitive-lab/scoring";
import { GAME_META, DIFFICULTY_LABELS } from "../../../lib/cognitive-lab/constants";
import { useCognitiveLabStore } from "../../../stores/cognitive-lab-store";
import type { DifficultyLevel, GameResult } from "../../../lib/cognitive-lab/types";

const META = GAME_META["memory-matrix"];

export function MemoryMatrixGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"instructions" | "memorize" | "recall" | "results">(
    "instructions"
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(3);
  const [challenge, setChallenge] = useState<MemoryMatrixChallenge | null>(null);
  const [userSelected, setUserSelected] = useState<number[]>([]);
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
  const bestScore = store.getBestScore("memory-matrix");
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
    setUserSelected([]);
    setStatusMessage(null);
    const initialChallenge = generateMemoryMatrixChallenge(diff);
    setChallenge(initialChallenge);
    setGameState("memorize");
  }, []);

  const finishGame = useCallback(() => {
    const accuracy = totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0;
    const scorePercentage = accuracy;
    const durationMs = (45 - timeLeft) * 1000;
    const attemptId = `memorymatrix_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const coinsEarned = store.claimReward(attemptId, scorePercentage, difficulty);

    const result: GameResult = {
      id: attemptId,
      gameId: "memory-matrix",
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

  // Memorize phase countdown
  useEffect(() => {
    if (gameState !== "memorize" || !challenge) return;
    const timer = setTimeout(() => {
      setGameState("recall");
    }, challenge.showDurationMs);
    return () => clearTimeout(timer);
  }, [gameState, challenge]);

  // Game clock countdown
  useEffect(() => {
    if ((gameState !== "memorize" && gameState !== "recall") || isPaused) return;

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

  const handleTileClick = (index: number) => {
    if (gameState !== "recall" || !challenge) return;

    let updatedSelection: number[];
    if (userSelected.includes(index)) {
      updatedSelection = userSelected.filter((i) => i !== index);
    } else {
      updatedSelection = [...userSelected, index];
    }
    setUserSelected(updatedSelection);

    if (updatedSelection.length === challenge.activeCells.length) {
      const isCorrect = validateMemoryMatrixAnswer(challenge, updatedSelection);
      setTotalRounds((prev) => prev + 1);

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        setMaxStreak((prev) => Math.max(prev, newStreak));
        const pts = calcRoundScore({
          correct: true,
          responseTimeMs: 500,
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
        setUserSelected([]);
        setChallenge(generateMemoryMatrixChallenge(difficulty));
        setGameState("memorize");
      }, 500);
    }
  };

  const handleHint = () => {
    if (gameState !== "recall" || !challenge) return;
    const missingIndex = challenge.activeCells.find((cell) => !userSelected.includes(cell));
    if (missingIndex === undefined) {
      setStatusMessage("All active cells already highlighted!");
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
    const updated = [...userSelected, missingIndex];
    setUserSelected(updated);
    setStatusMessage(`Hint: Revealed cell #${missingIndex + 1}!`);
    setTimeout(() => setStatusMessage(null), 2000);

    if (updated.length === challenge.activeCells.length) {
      const isCorrect = validateMemoryMatrixAnswer(challenge, updated);
      setTotalRounds((prev) => prev + 1);
      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
        setScore((prev) => prev + 100);
        setFeedback("correct");
      }
      setTimeout(() => {
        setFeedback(null);
        setUserSelected([]);
        setChallenge(generateMemoryMatrixChallenge(difficulty));
        setGameState("memorize");
      }, 500);
    }
  };

  if (gameState === "instructions") {
    return (
      <GameInstructions
        gameName={META.name}
        icon={META.icon}
        instructions={[
          "Memorize the pattern of lit tiles.",
          "Once tiles flip, click all active cells to reconstruct the pattern.",
          "Score 60% accuracy or higher to earn rewards!",
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
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
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

  const gridSize = challenge?.gridSize || 4;
  const totalCells = gridSize * gridSize;

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

      <div className="w-full flex flex-col items-center max-w-md space-y-5">
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
              disabled={gameState !== "recall"}
              className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline disabled:opacity-40"
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

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 text-center w-full shadow-sm">
          {gameState === "memorize" ? (
            <p className="text-amber-600 dark:text-amber-400 font-extrabold text-lg animate-pulse">
              Memorize the illuminated pattern!
            </p>
          ) : (
            <p className="text-indigo-600 dark:text-cyan-400 font-extrabold text-lg">
              Recreate pattern ({userSelected.length} / {challenge?.activeCells.length})
            </p>
          )}
        </div>

        <div
          className="grid gap-3 w-full aspect-square p-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: totalCells }).map((_, index) => {
            const isTarget = challenge?.activeCells.includes(index);
            const isSelected = userSelected.includes(index);

            let cellStyle = "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60";
            if (gameState === "memorize" && isTarget) {
              cellStyle = "bg-indigo-600 border-indigo-500 shadow-md shadow-indigo-600/30 scale-95 ring-4 ring-indigo-500/20";
            } else if (gameState === "recall" && isSelected) {
              cellStyle = "bg-cyan-600 border-cyan-500 shadow-md shadow-cyan-600/30 scale-95 ring-4 ring-cyan-500/20";
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleTileClick(index)}
                disabled={gameState === "memorize"}
                aria-label={`Cell ${index + 1}`}
                className={`w-full h-full rounded-2xl border-2 transition-all duration-150 flex items-center justify-center ${cellStyle} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                {gameState === "memorize" && isTarget && (
                  <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                )}
                {gameState === "recall" && isSelected && (
                  <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button: Finish Module */}
        <div className="w-full">
          <button
            type="button"
            onClick={finishGame}
            disabled={totalRounds === 0}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Flag className="w-4 h-4" />
            <span>Finish Module &amp; View Result</span>
          </button>
        </div>
      </div>
    </GameShell>
  );
}
