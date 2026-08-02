import React from 'react';
import { Search } from 'lucide-react';
import { SidebarTooltip } from './SidebarTooltip';

interface SidebarSearchProps {
  collapsed: boolean;
  onSearchOpen: () => void;
  isMobile?: boolean;
}

export const SidebarSearch: React.FC<SidebarSearchProps> = ({
  collapsed,
  onSearchOpen,
  isMobile = false,
}) => {
  if (collapsed && !isMobile) {
    return (
      <div className="flex justify-center px-2 py-2">
        <SidebarTooltip content="Search everything..." shortcut="⌘K">
          <button
            type="button"
            onClick={onSearchOpen}
            aria-label="Search everything"
            className="border-aether-border/60 bg-aether-subtle/50 flex h-9 w-9 items-center justify-center rounded-xl border text-aether-muted transition-all duration-150 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:text-indigo-400"
          >
            <Search className="h-4 w-4" />
          </button>
        </SidebarTooltip>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <button
        type="button"
        onClick={onSearchOpen}
        aria-label="Search everything (Cmd+K)"
        className="border-aether-border/70 bg-aether-subtle/60 hover:bg-aether-hover/80 group flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-medium text-aether-muted shadow-sm transition-all duration-150 hover:border-indigo-500/40 hover:text-aether-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <Search className="h-4 w-4 shrink-0 text-aether-muted transition-colors group-hover:text-indigo-500" />
        <span className="flex-1 text-left text-xs font-normal">Search everything...</span>
        <kbd className="border-aether-border/80 shadow-xs inline-flex items-center gap-0.5 rounded-md border bg-aether-surface px-1.5 py-0.5 font-mono text-[10px] font-semibold text-aether-muted group-hover:border-aether-border">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>
    </div>
  );
};
