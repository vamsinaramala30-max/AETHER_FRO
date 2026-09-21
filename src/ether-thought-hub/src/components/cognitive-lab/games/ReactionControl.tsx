import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, AlertCircle, ShieldAlert, CheckCircle, Flame, Flag } from "lucide-react";
import { GameShell } from "../GameShell";
import { GameInstructions } from "../GameInstructions";
import { GameResults } from "../GameResults";
import { FeedbackOverlay } from "../FeedbackEffects";
import {
  generateReactionControlChallenge,
  scoreReactionTrial,
  type ReactionControlChallenge,
  type ReactionTrial,
} from "../../../lib/cognitive-lab/engines/reaction-control";
import { GAME_META, DIFFICULTY_LABELS } from "../../../lib/cognitive-lab/constants";
import { useCognitiveLabStore } from "../../../stores/cognitive-lab-store";
import type { DifficultyLevel, GameResult, RoundResult } from "../../../lib/cognitive-lab/types";

const META = GAME_META["reaction-control"];

type Phase = "instructions" | "countdown" | "waiting" | "stimulus" | "feedback" | "results";

export function ReactionControlGame() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("instructions");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(3);
  const [challenge, setChallenge] = useState<ReactionControlChallenge | null>(null);
  const [trialIndex, setTrialIndex] = useState(0);
  const [countdownNum, setCountdownNum] = useState(3);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [falseStarts, setFalseStarts] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [roundsHistory, setRoundsHistory] = useState<RoundResult[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [finalResult, setFinalResult] = useState<GameResult | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stimulusStartRef = useRef<number>(0);
  const hasRespondedRef = useRef<boolean>(false);
  const store = useCognitiveLabStore();
  const bestScore = store.getBestScore("reaction-control");

  // Clear any pending timeout
  const clearCurrentTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const finishGame = useCallback(
    (history: RoundResult[], times: number[], finalScore: number, finalCorrect: number) => {
      clearCurrentTimer();
      const totalRounds = history.length;
      const accuracy = totalRounds > 0 ? Math.round((finalCorrect / totalRounds) * 100) : 0;
      const scorePercentage = accuracy;
      const isSuccess = scorePercentage >= 60;
      const attemptId = `reaction_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const coinsEarned = store.claimReward(attemptId, scorePercentage, difficulty);
      const avgResponse =
        times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

      const result: GameResult = {
        id: attemptId,
        gameId: "reaction-control",
        playedAt: Date.now(),
        difficulty,
        totalRounds,
        correctRounds: finalCorrect,
        score: finalScore,
        scorePercentage,
        isSuccess,
        coinsEarned,
        hintsUsed: 0,
        mistakes: totalRounds - finalCorrect + falseStarts,
        accuracy,
        avgResponseTimeMs: avgResponse,
        maxStreak,
        durationMs: 0,
        rounds: history,
      };

      store.recordResult(result);
      setFinalResult(result);
      setPhase("results");
    },
    [difficulty, maxStreak, falseStarts, store]
  );

  const handleFinishEarly = () => {
    finishGame(roundsHistory, reactionTimes, score, correctCount);
  };

  // Run next trial
  const runTrial = useCallback(
    (trials: ReactionTrial[], index: number) => {
      clearCurrentTimer();

      if (index >= trials.length) {
        setRoundsHistory((history) => {
          setReactionTimes((times) => {
            setScore((currentScore) => {
              setCorrectCount((currentCorrect) => {
                finishGame(history, times, currentScore, currentCorrect);
                return currentCorrect;
              });
              return currentScore;
            });
            return times;
          });
          return history;
        });
        return;
      }

      const trial = trials[index]!;
      setTrialIndex(index);
      hasRespondedRef.current = false;
      setPhase("waiting");

      // Random jitter delay before stimulus
      timerRef.current = setTimeout(() => {
        setPhase("stimulus");
        stimulusStartRef.current = performance.now();

        // Stimulus presentation window
        timerRef.current = setTimeout(() => {
          // If time expires without response
          if (!hasRespondedRef.current) {
            hasRespondedRef.current = true;
            const outcome = scoreReactionTrial(trial, false, null);

            let roundPoints = 0;
            if (outcome.correct) {
              // Successfully inhibited a NO-GO trial
              roundPoints = 75;
              setScore((s) => s + roundPoints);
              setStreak((st) => {
                const n = st + 1;
                setMaxStreak((m) => Math.max(m, n));
                return n;
              });
              setCorrectCount((c) => c + 1);
              setFeedbackStatus("correct");
              setFeedbackText("✓ Inhibit Successful! (+75)");
            } else {
              // Missed a GO trial
              setStreak(0);
              setFeedbackStatus("incorrect");
              setFeedbackText("Missed Target!");
            }

            setRoundsHistory((prev) => [
              ...prev,
              {
                roundIndex: index + 1,
                correct: outcome.correct,
                responseTimeMs: trial.showDurationMs,
                score: roundPoints,
              },
            ]);

            setPhase("feedback");
            timerRef.current = setTimeout(() => {
              runTrial(trials, index + 1);
            }, 650);
          }
        }, trial.showDurationMs);
      }, trial.delayBeforeMs);
    },
    [finishGame]
  );

  const startCountdown = useCallback(
    (trials: ReactionTrial[]) => {
      clearCurrentTimer();
      setPhase("countdown");
      setCountdownNum(3);

      let current = 3;
      const interval = setInterval(() => {
        current -= 1;
        if (current <= 0) {
          clearInterval(interval);
          runTrial(trials, 0);
        } else {
          setCountdownNum(current);
        }
      }, 750);
    },
    [runTrial]
  );

  const startNewGame = useCallback(
    (diff: DifficultyLevel = 3) => {
      clearCurrentTimer();
      setDifficulty(diff);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setCorrectCount(0);
      setFalseStarts(0);
      setReactionTimes([]);
      setRoundsHistory([]);
      setIsPaused(false);
      setFeedbackStatus(null);
      setFeedbackText("");

      const newChallenge = generateReactionControlChallenge(diff);
      setChallenge(newChallenge);
      startCountdown(newChallenge.trials);
    },
    [startCountdown]
  );

  // Handle user response
  const handleAction = useCallback(() => {
    if (isPaused || !challenge) return;

    if (phase === "waiting") {
      // User tapped too early => False Start
      clearCurrentTimer();
      setFalseStarts((f) => f + 1);
      setStreak(0);
      setScore((s) => Math.max(0, s - 35));
      setFeedbackStatus("incorrect");
      setFeedbackText("⚠️ FALSE START! Wait for stimulus! (-35)");
      setPhase("feedback");

      timerRef.current = setTimeout(() => {
        // Retry current trial with fresh delay
        runTrial(challenge.trials, trialIndex);
      }, 1000);
      return;
    }

    if (phase === "stimulus") {
      if (hasRespondedRef.current) return;
      hasRespondedRef.current = true;
      clearCurrentTimer();

      const reactionTimeMs = Math.round(performance.now() - stimulusStartRef.current);
      const trial = challenge.trials[trialIndex]!;
      const outcome = scoreReactionTrial(trial, true, reactionTimeMs);

      let roundScore = 0;
      if (outcome.correct) {
        roundScore = outcome.score;
        setScore((s) => s + roundScore);
        setStreak((st) => {
          const n = st + 1;
          setMaxStreak((m) => Math.max(m, n));
          return n;
        });
        setCorrectCount((c) => c + 1);
        setReactionTimes((times) => [...times, reactionTimeMs]);
        setFeedbackStatus("correct");
        setFeedbackText(`⚡ ${reactionTimeMs}ms! (+${roundScore})`);
      } else {
        // User tapped on NO-GO or Distractor
        setStreak(0);
        setFeedbackStatus("incorrect");
        setFeedbackText("✕ Inappropriate Response! (-20)");
        setScore((s) => Math.max(0, s - 20));
      }

      setRoundsHistory((prev) => [
        ...prev,
        {
          roundIndex: trialIndex + 1,
          correct: outcome.correct,
          responseTimeMs: reactionTimeMs,
          score: roundScore,
        },
      ]);

      setPhase("feedback");
      timerRef.current = setTimeout(() => {
        runTrial(challenge.trials, trialIndex + 1);
      }, 700);
    }
  }, [phase, isPaused, challenge, trialIndex, runTrial]);

  // Keyboard shortcut (Space / Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        handleAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearCurrentTimer();
  }, []);

  if (phase === "instructions") {
    return (
      <GameInstructions
        gameName={META.name}
        icon={META.icon}
        instructions={[
          "Prepare to react as quickly and accurately as possible.",
          "Wait through the random delay — do NOT tap early!",
          "When the GO target appears, tap IMMEDIATELY (or press Spacebar).",
          "If a STOP / Distractor appears, suppress your reaction!",
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
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
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

  if (phase === "results" && finalResult) {
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

  const currentTrial = challenge?.trials[trialIndex] ?? null;
  const currentStimulus = currentTrial?.stimulus ?? null;
  const totalTrialsCount = challenge?.trials.length ?? 0;

  return (
    <GameShell
      title={META.name}
      categoryName={META.categoryLabel}
      categoryIcon={META.icon}
      difficulty={difficulty}
      score={score}
      streak={streak}
      timeLeft={0}
      isPaused={isPaused}
      onPauseToggle={() => setIsPaused(!isPaused)}
      onRestart={() => startNewGame(difficulty)}
      onBack={() => navigate("/app/cognitive-hub")}
    >
      <FeedbackOverlay feedback={feedbackStatus} />

      <div className="w-full flex flex-col items-center max-w-lg space-y-4 sm:space-y-6 select-none">
        {/* Status / Coins Bar */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 px-4 w-full flex items-center justify-between text-xs font-bold shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Trial {trialIndex + 1} of {totalTrialsCount}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-slate-600 dark:text-slate-300">Success: {correctCount}/{Math.max(1, trialIndex)}</span>
            <span className="text-slate-400">•</span>
            <span className="text-rose-500 dark:text-rose-400">False Starts: {falseStarts}</span>
            <span className="text-slate-400">•</span>
            <span className="text-indigo-600 dark:text-cyan-400">🪙 {store.coins}</span>
          </div>
        </div>

        {/* Rule Banner */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 text-center w-full shadow-sm">
          <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
            {challenge?.ruleTitle}
          </p>
        </div>

        {/* Interactive Reaction Surface */}
        <button
          type="button"
          onPointerDown={handleAction}
          className={`w-full aspect-[4/3] rounded-3xl border-2 flex flex-col items-center justify-center p-6 transition-all duration-150 relative overflow-hidden shadow-lg active:scale-98 focus:outline-none focus:ring-4 focus:ring-amber-500/20 ${
            phase === "stimulus" && currentStimulus
              ? `${currentStimulus.bgColor} text-white border-white/40 shadow-2xl scale-102`
              : phase === "feedback"
              ? feedbackStatus === "correct"
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400"
                : "bg-rose-50 dark:bg-rose-950/60 border-rose-400"
              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
          }`}
          aria-label="Reaction target pad"
        >
          {phase === "countdown" && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-7xl sm:text-8xl font-black text-amber-500 animate-pulse font-mono">
                {countdownNum}
              </span>
              <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
                Get Ready...
              </span>
            </div>
          )}

          {phase === "waiting" && (
            <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
              <div className="w-16 h-16 rounded-full border-4 border-dashed border-slate-300 dark:border-slate-700 animate-spin" />
              <span className="text-sm font-bold tracking-wide">
                Wait for signal... (Do NOT tap early)
              </span>
            </div>
          )}

          {phase === "stimulus" && currentStimulus && (
            <div className="flex flex-col items-center justify-center gap-2 transform transition-transform scale-110">
              <span className="text-6xl sm:text-7xl drop-shadow-md">
                {currentStimulus.symbol}
              </span>
              <span className="text-2xl sm:text-3xl font-black tracking-wider uppercase drop-shadow">
                {currentStimulus.label}
              </span>
            </div>
          )}

          {phase === "feedback" && (
            <div className="flex flex-col items-center gap-2 text-center">
              <span
                className={`text-2xl sm:text-3xl font-black ${
                  feedbackStatus === "correct"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {feedbackText}
              </span>
            </div>
          )}
        </button>

        {/* Input Hint & Early Finish Action */}
        <div className="flex items-center justify-between w-full pt-1">
          <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Tap surface or press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">Space</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">Enter</kbd>
          </div>

          <button
            type="button"
            onClick={handleFinishEarly}
            disabled={roundsHistory.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-all shadow-sm"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Finish Early</span>
          </button>
        </div>
      </div>
    </GameShell>
  );
}
