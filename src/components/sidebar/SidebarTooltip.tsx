import React, { useState } from 'react';

interface SidebarTooltipProps {
  content: string;
  shortcut?: string;
  disabled?: boolean;
  children: React.ReactElement;
  side?: 'right' | 'top';
}

export const SidebarTooltip: React.FC<SidebarTooltipProps> = ({
  content,
  shortcut,
  disabled = false,
  children,
  side = 'right',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled) return children;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`animate-in fade-in zoom-in-95 pointer-events-none absolute z-50 flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-aether-border bg-slate-900/95 px-2.5 py-1 text-xs font-medium text-white shadow-xl backdrop-blur-md transition-all duration-150 dark:bg-slate-950/95 ${
            side === 'right'
              ? 'left-full top-1/2 ml-3 -translate-y-1/2'
              : 'bottom-full left-1/2 mb-2 -translate-x-1/2'
          }`}
        >
          <span>{content}</span>
          {shortcut && (
            <span className="py-0.2 rounded bg-white/20 px-1 font-mono text-[10px] text-slate-200">
              {shortcut}
            </span>
          )}
          {/* Arrow */}
          {side === 'right' && (
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900/95 dark:border-r-slate-950/95" />
          )}
        </div>
      )}
    </div>
  );
};
