import React, { useEffect, useRef, useState } from "react";

interface FocusTimerProps {
  onSessionComplete?: (minutes: number) => void;
}

export default function FocusTimer({
  onSessionComplete,
}: FocusTimerProps) {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);

          if (mode === "focus") {
            onSessionComplete?.(focusMinutes);
            alert("Focus session completed!");

            setMode("break");
            setIsRunning(false);
            return breakMinutes * 60;
          } else {
            alert("Break completed!");

            setMode("focus");
            setIsRunning(false);
            return focusMinutes * 60;
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, focusMinutes, breakMinutes, onSessionComplete]);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(
        mode === "focus"
          ? focusMinutes * 60
          : breakMinutes * 60
      );
    }
  }, [focusMinutes, breakMinutes, mode, isRunning]);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsRunning(false);

    setTimeLeft(
      mode === "focus"
        ? focusMinutes * 60
        : breakMinutes * 60
    );
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-xl border p-6 bg-white dark:bg-slate-900 shadow-md">

      <h2 className="text-2xl font-bold text-center mb-5">
        {mode === "focus" ? "Focus Timer" : "Break Timer"}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">

        <div>
          <label className="block mb-2 font-medium">
            Focus (minutes)
          </label>

          <input
            type="number"
            min={1}
            max={120}
            value={focusMinutes}
            disabled={isRunning}
            onChange={(e) =>
              setFocusMinutes(Number(e.target.value))
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Break (minutes)
          </label>

          <input
            type="number"
            min={1}
            max={60}
            value={breakMinutes}
            disabled={isRunning}
            onChange={(e) =>
              setBreakMinutes(Number(e.target.value))
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>

      </div>

      <div className="text-center text-6xl font-bold mb-6">
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-4">

        <button
          onClick={toggleTimer}
          className="rounded bg-blue-600 px-5 py-2 text-white"
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={resetTimer}
          className="rounded bg-gray-600 px-5 py-2 text-white"
        >
          Reset
        </button>

      </div>

    </div>
  );
}