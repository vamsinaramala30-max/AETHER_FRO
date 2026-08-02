import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Building2, Sparkles, Menu, Bell, Search, Moon, Sun } from 'lucide-react';

import { useTheme } from '@/app/providers/themeprovider';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { Sidebar } from '@/components/sidebar';

// ---------------------------------------------------------------------------
// Top Header Bar (Desktop & Mobile Header)
// ---------------------------------------------------------------------------

interface TopHeaderProps {
  onMobileMenuOpen: () => void;
  onSearchOpen: () => void;
  onNotificationsOpen: () => void;
  unreadCount: number;
}

const DesktopHeader: React.FC<{
  onSearchOpen: () => void;
  onNotificationsOpen: () => void;
  unreadCount: number;
}> = ({ onSearchOpen, onNotificationsOpen, unreadCount }) => {
  const location = useLocation();
  const { resolvedTheme, setTheme } = useTheme();

  // Create breadcrumb segments
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.slice(1); // omit 'app'

  return (
    <header className="bg-aether-surface/80 hidden shrink-0 items-center justify-between border-b border-aether-border px-6 py-2.5 backdrop-blur-md md:flex">
      {/* Left Breadcrumbs & Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-aether-muted">
          <Link
            to="/app"
            className="flex items-center gap-1.5 transition-colors hover:text-aether-main"
          >
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Workspace</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb + idx}>
              <span className="text-aether-subtleText">/</span>
              <span
                className={`capitalize ${idx === breadcrumbs.length - 1 ? 'font-semibold text-aether-main' : 'hover:text-aether-main'}`}
              >
                {crumb.replace('-', ' ')}
              </span>
            </React.Fragment>
          ))}
        </div>
        <div className="h-3 w-px bg-aether-border" />
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span>AI Engine Active</span>
        </div>
      </div>

      {/* Right Quick Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSearchOpen}
          className="flex items-center gap-2 rounded-xl border border-aether-border bg-aether-subtle px-3 py-1.5 text-xs text-aether-muted transition-all hover:border-aether-border-strong hover:text-aether-main"
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
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
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

const TopHeader: React.FC<TopHeaderProps> = ({
  onMobileMenuOpen,
  onSearchOpen,
  onNotificationsOpen,
  unreadCount,
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
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-indigo-500" />
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

// ---------------------------------------------------------------------------
// AppLayout
// ---------------------------------------------------------------------------

export const AppLayout: React.FC<React.PropsWithChildren> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount] = useState(3);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((p) => !p);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setCollapsed((p) => !p);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const location = useLocation();
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-aether-bg font-sans text-aether-main selection:bg-indigo-500/30">
      {/* Desktop Sidebar */}
      <div className="hidden h-full shrink-0 flex-col md:flex">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((p) => !p)}
          onSearchOpen={() => setSearchOpen(true)}
          onNotificationsOpen={() => setNotificationsOpen((p) => !p)}
          unreadCount={unreadCount}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          collapsed={false}
          onToggleCollapse={() => {}}
          onMobileClose={() => setMobileOpen(false)}
          isMobile
          onSearchOpen={() => {
            setSearchOpen(true);
            setMobileOpen(false);
          }}
          onNotificationsOpen={() => {
            setNotificationsOpen((p) => !p);
            setMobileOpen(false);
          }}
          unreadCount={unreadCount}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Desktop Sticky Header */}
        <DesktopHeader
          onSearchOpen={() => setSearchOpen(true)}
          onNotificationsOpen={() => setNotificationsOpen((p) => !p)}
          unreadCount={unreadCount}
        />

        {/* Mobile Header */}
        <TopHeader
          onMobileMenuOpen={() => setMobileOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
          onNotificationsOpen={() => setNotificationsOpen((p) => !p)}
          unreadCount={unreadCount}
        />

        {/* Page Content */}
        <main id="app-content" className="flex-1 overflow-y-auto bg-aether-bg" role="main">
          <Outlet />
        </main>
      </div>

      {/* Global Search Modal */}
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}

      {/* Notification Center Panel */}
      {notificationsOpen && <NotificationCenter onClose={() => setNotificationsOpen(false)} />}
    </div>
  );
};

export default AppLayout;
