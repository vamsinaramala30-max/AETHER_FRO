import { useEffect } from "react";
import { cn } from "../../lib/utils";

// ─── Feedback Overlay ────────────────────────────────────────────────────────

interface FeedbackOverlayProps {
  feedback?: "correct" | "incorrect" | null;
  type?: "correct" | "incorrect" | null;
  onDone?: () => void;
}

export function FeedbackOverlay({ feedback, type, onDone }: FeedbackOverlayProps) {
  const activeFeedback = feedback ?? type ?? null;

  useEffect(() => {
    if (!activeFeedback || !onDone) return;
    const t = setTimeout(onDone, 420);
    return () => clearTimeout(t);
  }, [activeFeedback, onDone]);

  if (!activeFeedback) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-50 transition-opacity duration-300",
        activeFeedback === "correct"
          ? "bg-emerald-500/10 animate-[lab-correct-flash_0.42s_ease-out_forwards]"
          : "bg-rose-500/10 animate-[lab-wrong-flash_0.42s_ease-out_forwards]",
      )}
      style={{
        animation: activeFeedback === "correct"
          ? "lab-correct-flash 0.42s ease-out forwards"
          : "lab-wrong-flash 0.42s ease-out forwards",
      }}
    />
  );
}

// ─── Streak Badge ─────────────────────────────────────────────────────────────

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) return null;

  const isHot = streak >= 5;
  const icon = isHot ? "🔥" : "✨";

  return (
    <span className={cn("lab-streak-badge", isHot && "hot")} aria-label={`Streak: ${String(streak)}`}>
      <span aria-hidden="true">{icon}</span>
      {streak}x
    </span>
  );
}
