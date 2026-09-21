interface GameInstructionsProps {
  gameName: string;
  icon: string;
  instructions: string[];
  controls?: { key: string; action: string }[];
  onStart: () => void;
  onBack: () => void;
  children?: React.ReactNode;
}

export function GameInstructions({
  gameName,
  icon,
  instructions,
  controls,
  onStart,
  onBack,
  children,
}: GameInstructionsProps) {
  return (
    <div className="lab-page-enter flex min-h-dvh flex-col items-center justify-center p-4 bg-white dark:bg-slate-950 transition-colors duration-200">
      <div
        className="w-full max-w-md p-8 flex flex-col gap-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="text-5xl drop-shadow-sm" aria-hidden="true">{icon}</div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {gameName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Read the instructions, then press Start to begin.
          </p>
        </div>

        <hr className="border-t border-slate-200 dark:border-slate-800 my-0" />

        {/* Instructions */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            How to Play
          </h2>
          <ol className="flex flex-col gap-2.5">
            {instructions.map((instruction, i) => (
              <li key={i} className="flex gap-3 items-start text-sm text-slate-700 dark:text-slate-300">
                <span
                  className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-cyan-950 dark:text-cyan-400 border border-indigo-200 dark:border-cyan-800"
                >
                  {i + 1}
                </span>
                <span className="leading-snug">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Controls */}
        {controls && controls.length > 0 && (
          <>
            <hr className="border-t border-slate-200 dark:border-slate-800 my-0" />
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Controls
              </h2>
              <div className="flex flex-col gap-2">
                {controls.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <kbd
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm"
                    >
                      {c.key}
                    </kbd>
                    <span className="text-slate-600 dark:text-slate-400">{c.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {children}

        <hr className="border-t border-slate-200 dark:border-slate-800 my-0" />

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/20 transition-all duration-150 active:scale-98 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={onStart}
            autoFocus
          >
            Start Game
          </button>
          <button
            className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium transition-colors"
            onClick={onBack}
          >
            ← Back to Hub
          </button>
        </div>
      </div>
    </div>
  );
}
