import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sparkles, Bell, Search, Sun, Moon, Menu } from 'lucide-react';

import { useTheme } from '../providers/themeprovider';
import { Sidebar } from '../../components/sidebar/Sidebar';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBreadcrumbs(pathname: string): { label: string; isLast: boolean }[] {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return [{ label: 'Workspace', isLast: true }];

  // Drop leading 'app' segment for display purposes
  const segments = parts[0] === 'app' ? parts.slice(1) : parts;
  if (segments.length === 0) return [{ label: 'Home', isLast: true }];

  return segments.map((seg, idx) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    isLast: idx === segments.length - 1,
  }));
}

// ---------------------------------------------------------------------------
// Desktop & Mobile Header Sub-components
// ---------------------------------------------------------------------------

interface HeaderProps {
  onSearchOpen: () => void;
  onNotificationsOpen: () => void;
}

const DesktopHeader: React.FC<HeaderProps> = ({ onSearchOpen, onNotificationsOpen }) => {
  const location = useLocation();
  const breadcrumbs = formatBreadcrumbs(location.pathname);
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-aether-border bg-aether-surface px-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-aether-muted/40">/</span>}
            <span
              className={
                crumb.isLast
                  ? 'font-semibold text-aether-main'
                  : 'cursor-pointer text-aether-muted transition-colors hover:text-aether-main'
              }
            >
              {crumb.label}
            </span>
          </React.Fragment>
        ))}

        {/* Engine status indicator pill */}
        <span className="ml-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          AI Engine Active
        </span>
      </nav>

      {/* Quick Search trigger & controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSearchOpen}
          className="flex items-center gap-2 rounded-xl border border-aether-border bg-aether-subtle px-3 py-1.5 text-xs text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
        >
          <Search className="h-3.5 w-3.5 text-indigo-400" />
          <span>Quick Search</span>
          <kbd className="py-0.2 rounded border border-aether-border bg-aether-surface px-1 font-mono text-[9px] text-aether-subtleText">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onNotificationsOpen}
          className="relative rounded-xl border border-aether-border bg-aether-subtle p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="rounded-xl border border-aether-border bg-aether-subtle p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
          title="Toggle Theme"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-400" />
          )}
        </button>
      </div>
    </header>
  );
};

interface TopHeaderProps extends HeaderProps {
  onMobileMenuOpen: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({
  onMobileMenuOpen,
  onSearchOpen,
  onNotificationsOpen,
}) => (
  <header className="flex shrink-0 items-center justify-between border-b border-aether-border bg-aether-surface px-4 py-3 md:hidden">
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500">
        <Sparkles className="h-3.5 w-3.5 text-white" />
      </div>
      <span className="text-base font-extrabold text-aether-main">Aether OS</span>
    </div>
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onSearchOpen}
        className="rounded-lg p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
      >
        <Search className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onNotificationsOpen}
        className="relative rounded-lg p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
      >
        <Bell className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onMobileMenuOpen}
        className="rounded-lg p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
      >
        <Menu className="h-5 w-5" />
      </button>
    </div>
  </header>
);

// ---------------------------------------------------------------------------
// AppLayout
// ---------------------------------------------------------------------------

export const AppLayout: React.FC<React.PropsWithChildren> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, setSearchOpen] = useState(false);
  const [, setNotificationsOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-aether-bg font-sans text-aether-main antialiased">
      {/* Sidebar navigation */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        isMobile={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onSearchOpen={() => setSearchOpen(true)}
        onNotificationsOpen={() => setNotificationsOpen(true)}
        unreadCount={0}
      />

      {/* Main content container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header (hidden on desktop) */}
        <TopHeader
          onMobileMenuOpen={() => setMobileOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
          onNotificationsOpen={() => setNotificationsOpen(true)}
        />

        {/* Desktop header (hidden on mobile) */}
        <div className="hidden md:block">
          <DesktopHeader
            onSearchOpen={() => setSearchOpen(true)}
            onNotificationsOpen={() => setNotificationsOpen(true)}
          />
        </div>

        {/* Dynamic page view content outlet */}
        <main className="flex-1 overflow-y-auto bg-aether-bg p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
