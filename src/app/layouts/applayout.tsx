import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  Thermometer,
  X,
} from 'lucide-react';

import { useTheme } from '../providers/themeprovider';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { useNotificationStore } from '../../state/notificationStore';

<<<<<<< HEAD
// ---------------------------------------------------------------------------
// Lazy-loaded modals/components
// ---------------------------------------------------------------------------

const GlobalSearch = React.lazy(
  () =>
    import('../../components/search/GlobalSearch').then((module) => ({
      default: module.GlobalSearch,
    })),
);

const NotificationCenter = React.lazy(
  () =>
    import('../../components/notifications/NotificationCenter').then(
      (module) => ({
        default: module.NotificationCenter,
      }),
    ),
);

// Weather component
// IMPORTANT: Weather.tsx must use:
// export default function Weather() { ... }
const Weather = React.lazy(
  () =>
    import('../../components/weather/weather').then((module) => ({
      default: module.default,
    })),
=======
// Lazy-load modals so they don't bloat the initial bundle
const GlobalSearch = React.lazy(() =>
  import('../../components/search/GlobalSearch').then((m) => ({ default: m.GlobalSearch })),
);
const NotificationCenter = React.lazy(() =>
  import('../../components/notifications/NotificationCenter').then((m) => ({
    default: m.NotificationCenter,
  })),
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBreadcrumbs(
  pathname: string,
): { label: string; isLast: boolean }[] {
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    return [{ label: 'Workspace', isLast: true }];
  }

  // Drop leading "app" segment for display purposes
  const segments = parts[0] === 'app' ? parts.slice(1) : parts;

  if (segments.length === 0) {
    return [{ label: 'Home', isLast: true }];
  }

  return segments.map((segment, index) => ({
    label:
      segment.charAt(0).toUpperCase() +
      segment.slice(1).replace(/-/g, ' '),
    isLast: index === segments.length - 1,
  }));
}

// ---------------------------------------------------------------------------
// Header Props
// ---------------------------------------------------------------------------

interface HeaderProps {
  onSearchOpen: () => void;
  onNotificationsOpen: () => void;
<<<<<<< HEAD
  onWeatherOpen: () => void;
}

interface TopHeaderProps extends HeaderProps {
  onMobileMenuOpen: () => void;
}

// ---------------------------------------------------------------------------
// Desktop Header
// ---------------------------------------------------------------------------

const DesktopHeader: React.FC<HeaderProps> = ({
  onSearchOpen,
  onNotificationsOpen,
  onWeatherOpen,
=======
  unreadCount?: number;
}

const DesktopHeader: React.FC<HeaderProps> = ({
  onSearchOpen,
  onNotificationsOpen,
  unreadCount = 0,
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3
}) => {
  const location = useLocation();
  const breadcrumbs = formatBreadcrumbs(location.pathname);
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-aether-border bg-aether-surface px-6">
      {/* ----------------------------------------------------------------- */}
      {/* Breadcrumbs                                                        */}
      {/* ----------------------------------------------------------------- */}

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs"
      >
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={`${crumb.label}-${index}`}>
            {index > 0 && (
              <span className="text-aether-muted/40">/</span>
            )}

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

        {/* AI Engine status */}
        <span className="ml-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          AI Engine Active
        </span>
      </nav>

      {/* ----------------------------------------------------------------- */}
      {/* Header Controls                                                    */}
      {/* ----------------------------------------------------------------- */}

      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          type="button"
          onClick={onSearchOpen}
          aria-label="Open quick search"
          title="Quick Search"
          className="flex items-center gap-2 rounded-xl border border-aether-border bg-aether-subtle px-3 py-1.5 text-xs text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
        >
          <Search className="h-3.5 w-3.5 text-indigo-400" />

          <span>Quick Search</span>

          <kbd className="rounded border border-aether-border bg-aether-surface px-1 py-0.5 font-mono text-[9px] text-aether-subtleText">
            ⌘K
          </kbd>
        </button>

        {/* --------------------------------------------------------------- */}
        {/* Weather                                                          */}
        {/* --------------------------------------------------------------- */}

       <button
  type="button"
  onClick={onWeatherOpen}
  aria-label="Open weather"
  title="Weather"
  className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400 transition-all hover:border-blue-400/40 hover:bg-blue-500/20 hover:text-blue-300"
>
  <Thermometer className="h-4 w-4" />
</button>

        {/* --------------------------------------------------------------- */}
        {/* Notifications                                                    */}
        {/* --------------------------------------------------------------- */}

        <button
          type="button"
          onClick={onNotificationsOpen}
          aria-label="Open notifications"
          title="Notifications"
          className="relative rounded-xl border border-aether-border bg-aether-subtle p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-aether-surface">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* --------------------------------------------------------------- */}
        {/* Theme                                                             */}
        {/* --------------------------------------------------------------- */}

        <button
          type="button"
          onClick={() =>
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
          }
          aria-label="Toggle theme"
          title="Toggle Theme"
          className="rounded-xl border border-aether-border bg-aether-subtle p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
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

// ---------------------------------------------------------------------------
// Mobile Header
// ---------------------------------------------------------------------------

const TopHeader: React.FC<TopHeaderProps> = ({
  onMobileMenuOpen,
  onSearchOpen,
  onNotificationsOpen,
<<<<<<< HEAD
  onWeatherOpen,
}) => {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-aether-border bg-aether-surface px-4 py-3 md:hidden">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>

        <span className="text-base font-extrabold text-aether-main">
          Aether OS
        </span>
      </div>

      {/* Mobile controls */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <button
          type="button"
          onClick={onSearchOpen}
          aria-label="Open search"
          title="Search"
          className="rounded-lg p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Weather */}
        <button
          type="button"
          onClick={onWeatherOpen}
          aria-label="Open weather"
          title="Weather"
          className="rounded-lg p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
        >
          <Thermometer className="h-4 w-4 text-cyan-400" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={onNotificationsOpen}
          aria-label="Open notifications"
          title="Notifications"
          className="relative rounded-lg p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Menu */}
        <button
          type="button"
          onClick={onMobileMenuOpen}
          aria-label="Open menu"
          title="Menu"
          className="rounded-lg p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

// ---------------------------------------------------------------------------
// Weather Overlay
// ---------------------------------------------------------------------------

interface WeatherOverlayProps {
  onClose: () => void;
}

const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-end bg-black/30 p-4 pt-20 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-aether-border bg-aether-surface shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Weather"
      >
        {/* Weather header */}
        <div className="flex items-center justify-between border-b border-aether-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
              <Thermometer className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-aether-main">
                Weather
              </h2>

              <p className="text-xs text-aether-muted">
                Current weather information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close weather"
            title="Close"
            className="rounded-lg p-2 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Weather component */}
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-4">
          <React.Suspense
            fallback={
              <div className="flex min-h-[180px] items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-aether-muted">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-aether-border border-t-cyan-400" />
                  Loading weather...
                </div>
              </div>
            }
          >
            <Weather />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};
=======
  unreadCount = 0,
}) => (
  <header className="flex shrink-0 items-center justify-between border-b border-aether-border bg-aether-surface px-4 py-3 md:hidden">
    <div className="flex items-center gap-2.5">
      <Sparkles className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
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
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-aether-surface">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
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
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3

// ---------------------------------------------------------------------------
// AppLayout
// ---------------------------------------------------------------------------

export const AppLayout: React.FC<React.PropsWithChildren> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);

  const location = useLocation();

<<<<<<< HEAD
  // -------------------------------------------------------------------------
  // Automatically close mobile sidebar when route changes
  // -------------------------------------------------------------------------

=======
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  // Auto-close mobile sidebar on route change
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // -------------------------------------------------------------------------
  // Lock body scrolling when mobile sidebar is open
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // -------------------------------------------------------------------------
  // Keyboard shortcut: Cmd/Ctrl + K
  // -------------------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }

      // Escape closes overlays
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setWeatherOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
<<<<<<< HEAD
    <div className="flex h-screen w-screen overflow-hidden bg-aether-bg font-sans text-aether-main antialiased pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      {/* ================================================================= */}
      {/* Mobile Backdrop                                                    */}
      {/* ================================================================= */}

=======
    <div className="flex h-screen w-screen overflow-hidden bg-aether-bg pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] font-sans text-aether-main antialiased">
      {/* Mobile backdrop */}
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ================================================================= */}
      {/* Mobile Sidebar                                                     */}
      {/* ================================================================= */}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] transform shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
<<<<<<< HEAD
        }`}
=======
        } w-[280px] max-w-[85vw] shadow-2xl`}
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3
        aria-hidden={!mobileOpen}
      >
        <Sidebar
          collapsed={false}
          onToggleCollapse={() => {}}
          isMobile={true}
          onMobileClose={() => setMobileOpen(false)}
          onSearchOpen={() => {
            setMobileOpen(false);
            setSearchOpen(true);
          }}
          onNotificationsOpen={() => {
            setMobileOpen(false);
            setNotificationsOpen(true);
          }}
<<<<<<< HEAD
          unreadCount={0}
=======
          unreadCount={unreadCount}
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3
        />
      </div>

      {/* ================================================================= */}
      {/* Desktop Sidebar                                                    */}
      {/* ================================================================= */}

      <div className="hidden md:block">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() =>
            setCollapsed((previousValue) => !previousValue)
          }
          isMobile={false}
          onMobileClose={() => {}}
          onSearchOpen={() => setSearchOpen(true)}
          onNotificationsOpen={() => setNotificationsOpen(true)}
          unreadCount={unreadCount}
        />
      </div>

<<<<<<< HEAD
      {/* ================================================================= */}
      {/* Main Content                                                       */}
      {/* ================================================================= */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
=======
      {/* Main content container */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile header (hidden on desktop) */}
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3
        <TopHeader
          onMobileMenuOpen={() => setMobileOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
          onNotificationsOpen={() => setNotificationsOpen(true)}
<<<<<<< HEAD
          onWeatherOpen={() => setWeatherOpen(true)}
=======
          unreadCount={unreadCount}
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3
        />

        {/* Desktop Header */}
        <div className="hidden md:block">
          <DesktopHeader
            onSearchOpen={() => setSearchOpen(true)}
            onNotificationsOpen={() => setNotificationsOpen(true)}
<<<<<<< HEAD
            onWeatherOpen={() => setWeatherOpen(true)}
          />
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-aether-bg p-3 transition-all duration-200 sm:p-4 md:p-6">
=======
            unreadCount={unreadCount}
          />
        </div>

        {/* Dynamic page view content outlet */}
        <main
          className={`min-h-0 w-full min-w-0 flex-1 bg-aether-bg transition-all duration-200 ${
            location.pathname.startsWith('/app/ai/assistant')
              ? 'mx-auto flex w-[95%] flex-col overflow-hidden p-0 md:w-full'
              : 'overflow-y-auto p-0'
          }`}
        >
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3
          <Outlet />
        </main>
      </div>

      {/* ================================================================= */}
      {/* Weather                                                            */}
      {/* ================================================================= */}

      {weatherOpen && (
        <WeatherOverlay onClose={() => setWeatherOpen(false)} />
      )}

      {/* ================================================================= */}
      {/* Global Search                                                      */}
      {/* ================================================================= */}

      {searchOpen && (
        <React.Suspense fallback={null}>
          <GlobalSearch onClose={() => setSearchOpen(false)} />
        </React.Suspense>
      )}

      {/* ================================================================= */}
      {/* Notification Center                                                */}
      {/* ================================================================= */}

      {notificationsOpen && (
        <React.Suspense fallback={null}>
          <NotificationCenter
            onClose={() => setNotificationsOpen(false)}
          />
        </React.Suspense>
      )}
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> bdf16a88761c687982aac221abf41ecee12202e3
