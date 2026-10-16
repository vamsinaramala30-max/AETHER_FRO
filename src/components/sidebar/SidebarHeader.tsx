import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SidebarTooltip } from './SidebarTooltip';
import { AetherSymbol } from '@/components/branding/AetherLogo';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onMobileClose?: () => void;
  isMobile?: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  collapsed,
  onToggleCollapse,
  onMobileClose,
  isMobile = false,
}) => {
  return (
    <div
      className={`border-aether-border/60 relative flex items-center border-b ${
        collapsed && !isMobile ? 'justify-center px-2 py-3.5' : 'justify-between px-4 py-3.5'
      }`}
    >
      {/* Brand Header */}
      {!collapsed || isMobile ? (
        <Link
          to="/app"
          onClick={onMobileClose}
          className="hover:bg-aether-hover/60 group flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
        >
          <AetherSymbol size={28} className="shrink-0 transition-transform group-hover:scale-105" />

          <div className="min-w-0 flex-1">
            <span className="block truncate text-base font-bold tracking-tight text-aether-main">
              Aether
            </span>
            <span className="block truncate text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
              AI Operating System
            </span>
          </div>
        </Link>
      ) : (
        /* Collapsed Logo */
        <SidebarTooltip content="Aether — AI Operating System">
          <Link
            to="/app"
            className="flex items-center justify-center transition-transform hover:scale-110"
            onClick={onMobileClose}
          >
            <AetherSymbol size={28} />
          </Link>
        </SidebarTooltip>
      )}

      {/* Close button for Mobile / Collapse Toggle Button for Desktop */}
      {isMobile ? (
        <button
          type="button"
          onClick={onMobileClose}
          aria-label="Close sidebar"
          className="border-aether-border/60 bg-aether-subtle/50 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <X className="h-4 w-4" />
        </button>
      ) : (
        <SidebarTooltip content={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} shortcut="⌘B">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="border-aether-border/60 bg-aether-subtle/50 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </SidebarTooltip>
      )}
    </div>
  );
};
