import React, { useEffect, useState } from 'react';
import { Play, Pause, FastForward, Clock, Calendar, RotateCcw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ruleEngine } from '../engine/RuleEngine';
import { ApplicationState } from '../engine/types';

export const SimulatedClock: React.FC = () => {
  const [appState, setAppState] = useState<ApplicationState>(ruleEngine.getState());
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(60); // Default 60x (1 sim-minute per real-second)

  useEffect(() => {
    return ruleEngine.subscribe((state) => {
      setAppState(state);
    });
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      // 1 real second ticks (speed / 60) simulated minutes
      // e.g. 60x speed = +1 sim-minute per second (+0.01666 hours)
      // 300x speed = +5 sim-minutes per second (+0.08333 hours)
      const tickAmountHours = speed / 3600;
      interval = setInterval(() => {
        setAppState((prev) => {
          let nextTime = prev.simulatedTime + tickAmountHours;
          if (nextTime >= 24) {
            nextTime = 0; // Wrap around to next day
          }
          ruleEngine.setSimulatedTime(nextTime);
          return { ...prev, simulatedTime: nextTime };
        });
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, speed]);

  const formattedHours = Math.floor(appState.simulatedTime);
  const formattedMinutes = Math.round((appState.simulatedTime % 1) * 60);
  const displayTime = `${formattedHours.toString().padStart(2, '0')}:${formattedMinutes.toString().padStart(2, '0')}`;
  const ampm = formattedHours >= 12 ? 'PM' : 'AM';
  const display12Hour = `${(formattedHours % 12 || 12).toString().padStart(2, '0')}:${formattedMinutes.toString().padStart(2, '0')} ${ampm}`;

  const handleStep = (minutes: number) => {
    let nextTime = appState.simulatedTime + minutes / 60;
    if (nextTime >= 24) nextTime %= 24;
    ruleEngine.setSimulatedTime(nextTime);
  };

  const handleReset = () => {
    setIsRunning(false);
    ruleEngine.setSimulatedTime(8.5); // Reset to 8:30 AM
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Time Display */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Clock className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Simulated Clock
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                LIVE ENGINE
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {display12Hour}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                ({displayTime})
              </span>
            </div>
          </div>
        </div>

        {/* Play/Pause & Speed Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Step buttons */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStep(15)}
            className="h-8 border-slate-200 px-2.5 text-xs font-bold dark:border-slate-800"
          >
            +15m
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStep(60)}
            className="h-8 border-slate-200 px-2.5 text-xs font-bold dark:border-slate-800"
          >
            +1h
          </Button>

          {/* Speed selector */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-800/80">
            {[1, 5, 60, 300].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${
                  speed === s
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Play / Pause Toggle */}
          <Button
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
            className={`h-8 px-3 text-xs font-bold text-white transition-all ${
              isRunning ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="mr-1 h-3.5 w-3.5 fill-white" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-1 h-3.5 w-3.5 fill-white" /> Play Clock
              </>
            )}
          </Button>

          {/* Reset */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            title="Reset to 08:30 AM"
            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Time Slider */}
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-[11px] font-medium text-slate-400">
          <span>00:00 (Midnight)</span>
          <span>06:00 (Morning)</span>
          <span>12:00 (Noon)</span>
          <span>18:00 (Evening)</span>
          <span>24:00 (Night)</span>
        </div>
        <input
          type="range"
          min={0}
          max={24}
          step={0.25}
          value={appState.simulatedTime}
          onChange={(e) => ruleEngine.setSimulatedTime(parseFloat(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-amber-500 dark:bg-slate-800"
        />
      </div>
    </div>
  );
};
