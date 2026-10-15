/**
 * YourAetherPage.tsx
 *
 * Full-screen app-launcher experience for YOUR AETHER.
 * - Standalone interface (no left sidebar drawer)
 * - Official Concept 1 "The Core" branding throughout
 * - Header with live search, notifications, and user profile dropdown
 * - Cosmic Hero section with center glowing Core orb and quick CTA card
 * - All AETHER modules as app cards (genuine routes to real implementations)
 * - Back button context — every module opened from here returns here
 * - Footer with Privacy, Terms, Help, Contact, © 2026 AETHER
 * - Responsive: mobile → tablet → desktop
 * - Reduced-motion support
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Bot,
  Brain,
  Zap,
  FolderKanban,
  FolderOpen,
  BookOpen,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Library,
  Cpu,
  HardDrive,
  Users,
  Sparkles,
  FileText,
  Languages,
  LayoutGrid,
  RotateCcw,
  LogOut,
  User,
  Sliders,
  CheckCircle2,
  X,
  Calendar,
  CheckSquare,
  Timer,
  Globe,
  FileBox,
  StickyNote,
  Database,
  Workflow,
  Shield,
  CreditCard,
  Activity,
  ClipboardList,
} from 'lucide-react';

import { useAuth } from '@/app/providers/authprovider';
import { normalizeUserProfile } from '@/auth/userProfile';
import { AetherSymbol } from '@/components/branding/AetherLogo';
import { useLastSession, useSessionTracker } from '@/your-aether/useLastSession';
import './your-aether.css';

// ─────────────────────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

interface AppCardData {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  colorClass: string;
}

interface CompactCardData {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  iconBg: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// App Data — All connect to genuine platform routes
// ─────────────────────────────────────────────────────────────────────────────

const MAIN_APPS: AppCardData[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Complete overview of your work, projects and AI activity.',
    href: '/ya/dashboard',
    icon: <Home className="h-6 w-6 text-blue-400" />,
    iconBg: 'rgba(59, 130, 246, 0.16)',
    colorClass: 'ya-app-card--blue',
  },
  {
    id: 'aether-agent',
    name: 'AETHER Agent',
    description: 'Your intelligent AI companion for smarter work.',
    href: '/ya/ai',
    icon: <Bot className="h-6 w-6 text-purple-400" />,
    iconBg: 'rgba(139, 92, 246, 0.16)',
    colorClass: 'ya-app-card--purple',
  },
  {
    id: 'cognitive-hub',
    name: 'Cognitive Hub',
    description: 'Explore knowledge, insights and AI-powered tools.',
    href: '/ya/cognitive-hub',
    icon: <Brain className="h-6 w-6 text-cyan-400" />,
    iconBg: 'rgba(6, 182, 212, 0.16)',
    colorClass: 'ya-app-card--cyan',
  },
  {
    id: 'quick-tools',
    name: 'Quick Tools',
    description: 'Useful tools for everyday productivity and creativity.',
    href: '/ya/quick-tools',
    icon: <Zap className="h-6 w-6 text-amber-400" />,
    iconBg: 'rgba(245, 158, 11, 0.16)',
    colorClass: 'ya-app-card--amber',
  },
  {
    id: 'workspace',
    name: 'Workspace',
    description: 'Your collaborative space for ideas and work.',
    href: '/ya/workspace',
    icon: <FolderKanban className="h-6 w-6 text-indigo-400" />,
    iconBg: 'rgba(99, 102, 241, 0.16)',
    colorClass: 'ya-app-card--indigo',
  },
];

const PRODUCTIVITY_APPS: AppCardData[] = [
  {
    id: 'projects',
    name: 'Projects',
    description: 'Manage your projects, tasks and milestones.',
    href: '/ya/projects',
    icon: <FolderOpen className="h-6 w-6 text-rose-400" />,
    iconBg: 'rgba(244, 63, 94, 0.16)',
    colorClass: 'ya-app-card--rose',
  },
  {
    id: 'knowledge',
    name: 'Knowledge',
    description: 'Access and organize your knowledge base.',
    href: '/ya/knowledge',
    icon: <BookOpen className="h-6 w-6 text-purple-400" />,
    iconBg: 'rgba(168, 85, 247, 0.16)',
    colorClass: 'ya-app-card--purple',
  },
  {
    id: 'automation',
    name: 'Automation',
    description: 'Automate your workflows and save time.',
    href: '/ya/automation',
    icon: <Workflow className="h-6 w-6 text-emerald-400" />,
    iconBg: 'rgba(16, 185, 129, 0.16)',
    colorClass: 'ya-app-card--emerald',
  },
];

const AGENT_FEATURES: CompactCardData[] = [
  {
    id: 'assistant',
    name: 'AI Assistant',
    description: 'Chat with your AI assistant',
    href: '/ya/ai/assistant',
    icon: <MessageSquare className="h-5 w-5 text-blue-400" />,
    iconBg: 'rgba(59, 130, 246, 0.18)',
  },
  {
    id: 'prompt-library',
    name: 'Prompt Library',
    description: 'Explore ready-to-use prompts',
    href: '/ya/ai/prompts',
    icon: <Library className="h-5 w-5 text-indigo-400" />,
    iconBg: 'rgba(99, 102, 241, 0.18)',
  },
  {
    id: 'models',
    name: 'Models',
    description: 'Access and manage AI models',
    href: '/ya/ai/models',
    icon: <Cpu className="h-5 w-5 text-purple-400" />,
    iconBg: 'rgba(168, 85, 247, 0.18)',
  },
  {
    id: 'memory',
    name: 'Memory',
    description: 'Your AI memory system',
    href: '/ya/ai/memory',
    icon: <HardDrive className="h-5 w-5 text-cyan-400" />,
    iconBg: 'rgba(6, 182, 212, 0.18)',
  },
  {
    id: 'agents',
    name: 'Agents',
    description: 'Manage your AI agents',
    href: '/ya/ai/agents',
    icon: <Users className="h-5 w-5 text-fuchsia-400" />,
    iconBg: 'rgba(217, 70, 239, 0.18)',
  },
];

const COGNITIVE_TOOLS: CompactCardData[] = [
  {
    id: 'research',
    name: 'Research',
    description: 'Explore and discover',
    href: '/ya/knowledge/search',
    icon: <Search className="h-5 w-5 text-blue-400" />,
    iconBg: 'rgba(59, 130, 246, 0.18)',
  },
  {
    id: 'summarize',
    name: 'Summarize',
    description: 'Get key insights',
    href: '/ya/ai/assistant',
    icon: <FileText className="h-5 w-5 text-indigo-400" />,
    iconBg: 'rgba(99, 102, 241, 0.18)',
  },
  {
    id: 'translate',
    name: 'Translate',
    description: 'Break language barriers',
    href: '/ya/ai/assistant',
    icon: <Languages className="h-5 w-5 text-purple-400" />,
    iconBg: 'rgba(168, 85, 247, 0.18)',
  },
  {
    id: 'analyze',
    name: 'Analyze',
    description: 'Understand your data',
    href: '/ya/cognitive-hub/dashboard',
    icon: <Activity className="h-5 w-5 text-teal-400" />,
    iconBg: 'rgba(20, 184, 166, 0.18)',
  },
  {
    id: 'generate',
    name: 'Generate',
    description: 'Create with AI',
    href: '/ya/ai/prompts',
    icon: <Sparkles className="h-5 w-5 text-fuchsia-400" />,
    iconBg: 'rgba(217, 70, 239, 0.18)',
  },
];

// Additional modules grid
const MORE_MODULES: CompactCardData[] = [
  {
    id: 'files',
    name: 'Files',
    description: 'Browse and manage your files',
    href: '/ya/projects/files',
    icon: <FileBox className="h-5 w-5 text-orange-400" />,
    iconBg: 'rgba(251, 146, 60, 0.18)',
  },
  {
    id: 'tasks',
    name: 'Tasks',
    description: 'Track and complete tasks',
    href: '/ya/projects/tasks',
    icon: <CheckSquare className="h-5 w-5 text-green-400" />,
    iconBg: 'rgba(74, 222, 128, 0.18)',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Schedule and plan events',
    href: '/ya/workspace/calendar',
    icon: <Calendar className="h-5 w-5 text-sky-400" />,
    iconBg: 'rgba(56, 189, 248, 0.18)',
  },
  {
    id: 'notes',
    name: 'Notes',
    description: 'Capture your ideas',
    href: '/ya/knowledge/notes',
    icon: <StickyNote className="h-5 w-5 text-yellow-400" />,
    iconBg: 'rgba(250, 204, 21, 0.18)',
  },
  {
    id: 'documents',
    name: 'Documents',
    description: 'Create and edit documents',
    href: '/ya/knowledge/documents',
    icon: <FileText className="h-5 w-5 text-rose-400" />,
    iconBg: 'rgba(251, 113, 133, 0.18)',
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'Your organized knowledge store',
    href: '/ya/knowledge/base',
    icon: <Database className="h-5 w-5 text-violet-400" />,
    iconBg: 'rgba(167, 139, 250, 0.18)',
  },
  {
    id: 'focus-timer',
    name: 'Focus Timer',
    description: 'Pomodoro and focus sessions',
    href: '/ya/workspace/focustimer',
    icon: <Timer className="h-5 w-5 text-red-400" />,
    iconBg: 'rgba(248, 113, 113, 0.18)',
  },
  {
    id: 'weekly-planner',
    name: 'Weekly Planner',
    description: 'Plan your whole week',
    href: '/ya/workspace/weeklyplanner',
    icon: <ClipboardList className="h-5 w-5 text-emerald-400" />,
    iconBg: 'rgba(52, 211, 153, 0.18)',
  },
  {
    id: 'web-directory',
    name: 'Web Directory',
    description: 'Browse curated web resources',
    href: '/ya/workspace/webdirectory',
    icon: <Globe className="h-5 w-5 text-cyan-400" />,
    iconBg: 'rgba(34, 211, 238, 0.18)',
  },
  {
    id: 'productivity-hub',
    name: 'Productivity Hub',
    description: 'Track productivity metrics',
    href: '/ya/workspace/productivity-hub',
    icon: <Activity className="h-5 w-5 text-lime-400" />,
    iconBg: 'rgba(163, 230, 53, 0.18)',
  },
];

const SETTINGS_MODULES: CompactCardData[] = [
  {
    id: 'settings-profile',
    name: 'Profile',
    description: 'Manage your account',
    href: '/ya/settings/profile',
    icon: <User className="h-5 w-5 text-blue-400" />,
    iconBg: 'rgba(59, 130, 246, 0.18)',
  },
  {
    id: 'settings-appearance',
    name: 'Appearance',
    description: 'Theme and display preferences',
    href: '/ya/settings/appearance',
    icon: <Sliders className="h-5 w-5 text-purple-400" />,
    iconBg: 'rgba(168, 85, 247, 0.18)',
  },
  {
    id: 'settings-notifications',
    name: 'Notifications',
    description: 'Notification preferences',
    href: '/ya/settings/notifications',
    icon: <Bell className="h-5 w-5 text-amber-400" />,
    iconBg: 'rgba(245, 158, 11, 0.18)',
  },
  {
    id: 'settings-security',
    name: 'Security',
    description: 'Password and security',
    href: '/ya/settings/security',
    icon: <Shield className="h-5 w-5 text-emerald-400" />,
    iconBg: 'rgba(16, 185, 129, 0.18)',
  },
  {
    id: 'settings-billing',
    name: 'Billing',
    description: 'Plans and payments',
    href: '/ya/settings/billing',
    icon: <CreditCard className="h-5 w-5 text-rose-400" />,
    iconBg: 'rgba(244, 63, 94, 0.18)',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hero Center Emblem (Faithful 3D Concept 1 Core Visual Centerpiece)
// ─────────────────────────────────────────────────────────────────────────────

const HeroCenterEmblem: React.FC = () => {
  return (
    <div className="ya-hero-center-visual" aria-hidden="true">
      <div className="ya-orb-container">
        {/* Soft cosmic atmospheric glows */}
        <div className="ya-orb-glow ya-orb-glow--cyan" />
        <div className="ya-orb-glow ya-orb-glow--purple" />

        {/* Orbit ring SVG */}
        <svg viewBox="0 0 280 280" className="ya-orb-rings" fill="none">
          <defs>
            <linearGradient id="ring-glow-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#818CF8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="ring-glow-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E879F9" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Outer perspective ring */}
          <ellipse
            cx="140"
            cy="140"
            rx="115"
            ry="45"
            stroke="url(#ring-glow-1)"
            strokeWidth="2.5"
            transform="rotate(-26 140 140)"
            className="ya-ring-pulse"
          />

          {/* Secondary counter ring */}
          <ellipse
            cx="140"
            cy="140"
            rx="105"
            ry="38"
            stroke="url(#ring-glow-2)"
            strokeWidth="1.8"
            strokeDasharray="160 90"
            transform="rotate(32 140 140)"
            className="ya-ring-orbit"
          />

          {/* Satellite orb particles */}
          <circle cx="218" cy="98" r="4" fill="#00E5FF" filter="drop-shadow(0 0 6px #00E5FF)" />
          <circle cx="68" cy="184" r="3" fill="#E879F9" filter="drop-shadow(0 0 4px #E879F9)" />
        </svg>

        {/* The 3D Emblem Core */}
        <div className="ya-orb-symbol">
          <AetherSymbol size={110} idPrefix="hero-core" />
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Card Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const AppCard: React.FC<{ app: AppCardData }> = ({ app }) => (
  <Link to={app.href} className={`ya-app-card ${app.colorClass}`}>
    <div>
      <div className="ya-app-card-icon" style={{ background: app.iconBg }}>
        {app.icon}
      </div>
      <h3 className="ya-app-card-name">{app.name}</h3>
      <p className="ya-app-card-desc">{app.description}</p>
    </div>
    <div className="ya-app-card-arrow" aria-hidden="true">
      <ArrowRight className="h-3.5 w-3.5" />
    </div>
  </Link>
);

const CompactCard: React.FC<{ card: CompactCardData }> = ({ card }) => (
  <Link to={card.href} className="ya-compact-card">
    <div className="ya-compact-card-icon" style={{ background: card.iconBg }}>
      {card.icon}
    </div>
    <div className="ya-compact-card-info">
      <p className="ya-compact-card-name">{card.name}</p>
      <p className="ya-compact-card-desc">{card.description}</p>
    </div>
    <div className="ya-compact-card-arrow" aria-hidden="true">
      <ArrowRight className="h-3.5 w-3.5" />
    </div>
  </Link>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────

export const YourAetherPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const normalizedUser = normalizeUserProfile(user as Record<string, unknown> | null | undefined);

  // Track sessions from within YOUR AETHER (for /ya/ routes too)
  useSessionTracker();

  // Last session restore
  const { lastPath, hasSession } = useLastSession();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Dropdown states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close menus on outside click
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard shortcut: '/' focuses search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // All module data in a flat list for searching
  const allModules = useMemo(
    () => [
      ...MAIN_APPS.map((a) => ({ ...a, section: 'main' })),
      ...PRODUCTIVITY_APPS.map((a) => ({ ...a, section: 'prod' })),
      ...AGENT_FEATURES.map((a) => ({ ...a, section: 'agent' })),
      ...COGNITIVE_TOOLS.map((a) => ({ ...a, section: 'cognitive' })),
      ...MORE_MODULES.map((a) => ({ ...a, section: 'more' })),
      ...SETTINGS_MODULES.map((a) => ({ ...a, section: 'settings' })),
    ],
    [],
  );

  const query = searchQuery.trim().toLowerCase();

  const filterItems = <T extends { name: string; description: string }>(items: T[]): T[] => {
    if (!query) return items;
    return items.filter(
      (a) => a.name.toLowerCase().includes(query) || a.description.toLowerCase().includes(query),
    );
  };

  const filteredMainApps = useMemo(() => filterItems(MAIN_APPS), [query]);
  const filteredProdApps = useMemo(() => filterItems(PRODUCTIVITY_APPS), [query]);
  const filteredAgentFeatures = useMemo(() => filterItems(AGENT_FEATURES), [query]);
  const filteredCognitiveTools = useMemo(() => filterItems(COGNITIVE_TOOLS), [query]);
  const filteredMoreModules = useMemo(() => filterItems(MORE_MODULES), [query]);
  const filteredSettingsModules = useMemo(() => filterItems(SETTINGS_MODULES), [query]);

  const totalResults =
    filteredMainApps.length +
    filteredProdApps.length +
    filteredAgentFeatures.length +
    filteredCognitiveTools.length +
    filteredMoreModules.length +
    filteredSettingsModules.length;

  // Search result matches from all modules (for search-only flat view)
  const searchResults = useMemo(() => {
    if (!query) return [];
    return allModules.filter(
      (a) => a.name.toLowerCase().includes(query) || a.description.toLowerCase().includes(query),
    );
  }, [query, allModules]);

  return (
    <div className="ya-page">
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <header className="ya-header" ref={headerRef}>
        {/* Official Concept 1 Logo & Title */}
        <Link to="/app/your-aether" className="ya-header-logo" title="YOUR AETHER Experience">
          <AetherSymbol size={28} idPrefix="ya-header" />
          <div className="ya-header-logo-text">
            YOUR <span>AETHER</span>
          </div>
        </Link>

        {/* Header Controls */}
        <div className="ya-header-controls">
          {/* Interactive Search Bar */}
          <div className="ya-search-wrapper">
            <Search className="h-4 w-4 ya-search-icon" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps & modules… (/)"
              className="ya-search-input"
              aria-label="Search your apps and modules"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="ya-search-clear"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Return to Classic AETHER — quick link */}
          <Link
            to="/app"
            className="ya-classic-link"
            title="Return to Classic AETHER"
            aria-label="Return to Classic AETHER"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="ya-classic-link-text">Classic</span>
          </Link>

          {/* Notifications Button & Dropdown */}
          <div className="ya-menu-container">
            <button
              type="button"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowUserMenu(false);
              }}
              className="ya-icon-btn"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="ya-notif-dot" />
            </button>

            {showNotifications && (
              <div className="ya-dropdown ya-dropdown--notifications" role="dialog" aria-label="Notifications">
                <div className="ya-dropdown-header">
                  <span>Notifications</span>
                  <Link
                    to="/ya/settings/notifications"
                    className="ya-badge-count"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all
                  </Link>
                </div>
                <div className="ya-dropdown-list">
                  <div className="ya-dropdown-item">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="ya-item-title">Welcome to YOUR AETHER</p>
                      <p className="ya-item-time">Concept 1 "The Core" experience activated</p>
                    </div>
                  </div>
                  <div className="ya-dropdown-item">
                    <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
                    <div>
                      <p className="ya-item-title">AI Assistant ready</p>
                      <p className="ya-item-time">Chat, generate prompts, and automate workflows</p>
                    </div>
                  </div>
                </div>
                <Link
                  to="/ya/settings/notifications"
                  className="ya-dropdown-footer"
                  onClick={() => setShowNotifications(false)}
                >
                  Manage notification preferences
                </Link>
              </div>
            )}
          </div>

          {/* User Profile Button & Dropdown */}
          <div className="ya-menu-container">
            <button
              type="button"
              onClick={() => {
                setShowUserMenu((prev) => !prev);
                setShowNotifications(false);
              }}
              className="ya-user-btn"
              aria-label={`Profile: ${normalizedUser.displayName}`}
              aria-expanded={showUserMenu}
            >
              <div className="ya-user-avatar" aria-hidden="true">{normalizedUser.initials}</div>
              <span className="ya-user-name">{normalizedUser.displayName}</span>
              <ChevronDown className="h-3.5 w-3.5 ya-user-caret" aria-hidden="true" />
            </button>

            {showUserMenu && (
              <div className="ya-dropdown ya-dropdown--user" role="dialog" aria-label="User menu">
                <div className="ya-user-dropdown-info">
                  <p className="ya-user-dropdown-name">{normalizedUser.displayName}</p>
                  <p className="ya-user-dropdown-email">{normalizedUser.email || 'user@aether.ai'}</p>
                </div>
                <div className="ya-dropdown-divider" />
                <Link
                  to="/ya/settings/profile"
                  className="ya-dropdown-link"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Profile &amp; Account</span>
                </Link>
                <Link
                  to="/ya/settings/appearance"
                  className="ya-dropdown-link"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Sliders className="h-4 w-4" />
                  <span>Appearance</span>
                </Link>
                <Link
                  to="/ya/settings/preferences"
                  className="ya-dropdown-link"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Preferences</span>
                </Link>
                <Link
                  to="/app"
                  className="ya-dropdown-link"
                  onClick={() => setShowUserMenu(false)}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Classic AETHER View</span>
                </Link>
                <div className="ya-dropdown-divider" />
                <button
                  type="button"
                  onClick={() => {
                    void logout();
                    navigate('/login');
                  }}
                  className="ya-dropdown-link ya-dropdown-link--danger"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Banner Section ────────────────────────────────────────── */}
      <section className="ya-hero" aria-label="Welcome hero">
        <div className="ya-hero-bg" aria-hidden="true" />
        <div className="ya-hero-content">
          {/* Left Title & Tagline */}
          <div className="ya-hero-text">
            <h1>
              Welcome to
              <strong className="ya-hero-gradient-title">
                YOUR <span>AETHER</span>
              </strong>
            </h1>
            <p className="ya-hero-subtitle">
              Your workspace. Your intelligence. Your way.
            </p>
            <p className="ya-hero-tagline">AI OPERATING SYSTEM</p>
          </div>

          {/* Center Glowing 3D Concept 1 Core Emblem */}
          <HeroCenterEmblem />

          {/* Right Action Card */}
          <div className="ya-hero-cta-card">
            <div className="ya-cta-card-header">
              <Sparkles className="h-4 w-4 text-purple-400" aria-hidden="true" />
              <h3>Build. Create. Automate.</h3>
            </div>
            <p>Everything you need, in one place.</p>
            <Link to="/ya/ai/assistant" className="ya-cta-btn">
              <span>Start with AI Assistant</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link to="/ya/cognitive-hub" className="ya-cta-btn-secondary">
              <Brain className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Cognitive Hub</span>
            </Link>
            {hasSession && (
              <button
                type="button"
                onClick={() => navigate(lastPath)}
                className="ya-cta-btn-secondary"
                title={`Resume: ${lastPath}`}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Continue Last Session</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Content Area ──────────────────────────────────────────────── */}
      <main className="ya-content" id="ya-main-content">

        {/* Search Query Feedback */}
        {searchQuery && (
          <div className="ya-search-status" role="status" aria-live="polite">
            <span>
              Found <strong>{totalResults}</strong> {totalResults === 1 ? 'module' : 'modules'} matching &ldquo;{searchQuery}&rdquo;
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="ya-clear-filter-btn"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* ── Section 1: Main Apps ────────────────────────────────────── */}
        {filteredMainApps.length > 0 && (
          <section className="ya-section" aria-labelledby="heading-main-apps">
            <div className="ya-section-header">
              <div className="ya-section-icon ya-section-icon--blue">
                <LayoutGrid className="h-5 w-5 text-indigo-400" aria-hidden="true" />
              </div>
              <div>
                <h2 id="heading-main-apps" className="ya-section-title">
                  Main Apps
                </h2>
                <p className="ya-section-subtitle">
                  Your core AI workspace and productivity tools
                </p>
              </div>
            </div>
            <div className="ya-grid-main">
              {filteredMainApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        )}

        {/* ── Section 2: Productivity Apps ────────────────────────────── */}
        {filteredProdApps.length > 0 && (
          <section className="ya-section" aria-labelledby="heading-prod-apps">
            <div className="ya-section-header">
              <div className="ya-section-icon ya-section-icon--pink">
                <FolderOpen className="h-5 w-5 text-rose-400" aria-hidden="true" />
              </div>
              <div>
                <h2 id="heading-prod-apps" className="ya-section-title">
                  Productivity Apps
                </h2>
                <p className="ya-section-subtitle">
                  Organize, build and grow your work
                </p>
              </div>
            </div>
            <div className="ya-grid-prod">
              {filteredProdApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        )}

        {/* ── Section 3: AETHER Agent Features ────────────────────────── */}
        {filteredAgentFeatures.length > 0 && (
          <section className="ya-section" aria-labelledby="heading-agent-features">
            <div className="ya-section-header">
              <div className="ya-section-icon ya-section-icon--purple">
                <Bot className="h-5 w-5 text-purple-400" aria-hidden="true" />
              </div>
              <div>
                <h2 id="heading-agent-features" className="ya-section-title">
                  AETHER Agent Features
                </h2>
                <p className="ya-section-subtitle">
                  Powerful AI tools at your fingertips
                </p>
              </div>
            </div>
            <div className="ya-grid-agent">
              {filteredAgentFeatures.map((card) => (
                <CompactCard key={card.id} card={card} />
              ))}
            </div>
          </section>
        )}

        {/* ── Section 4: Cognitive Hub Tools ──────────────────────────── */}
        {filteredCognitiveTools.length > 0 && (
          <section className="ya-section" aria-labelledby="heading-cognitive-tools">
            <div className="ya-section-header">
              <div className="ya-section-icon ya-section-icon--cyan">
                <Brain className="h-5 w-5 text-cyan-400" aria-hidden="true" />
              </div>
              <div>
                <h2 id="heading-cognitive-tools" className="ya-section-title">
                  Cognitive Hub Tools
                </h2>
                <p className="ya-section-subtitle">
                  Boost your thinking with intelligent tools
                </p>
              </div>
            </div>

            <div className="ya-cognitive-row">
              {/* 5 Tools Grid */}
              <div className="ya-grid-cognitive">
                {filteredCognitiveTools.map((card) => (
                  <CompactCard key={card.id} card={card} />
                ))}
              </div>

              {/* Promoted Feature Card */}
              <Link to="/ya/cognitive-hub" className="ya-feature-banner">
                <div className="ya-feature-banner-content">
                  <div className="ya-feature-banner-badge">
                    <Sparkles className="h-3 w-3 text-cyan-300" aria-hidden="true" />
                    <span>SMARTER TOOLS</span>
                  </div>
                  <h3>Smarter Tools. Greater Possibilities.</h3>
                  <p>Your AI-powered workspace for a better tomorrow.</p>
                </div>
                <div className="ya-feature-banner-btn" aria-hidden="true">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ── Section 5: More Modules ──────────────────────────────────── */}
        {filteredMoreModules.length > 0 && (
          <section className="ya-section" aria-labelledby="heading-more-modules">
            <div className="ya-section-header">
              <div className="ya-section-icon ya-section-icon--amber">
                <Zap className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <div>
                <h2 id="heading-more-modules" className="ya-section-title">
                  More Modules
                </h2>
                <p className="ya-section-subtitle">
                  Files, Calendar, Tasks, Notes, Documents and more
                </p>
              </div>
            </div>
            <div className="ya-grid-more">
              {filteredMoreModules.map((card) => (
                <CompactCard key={card.id} card={card} />
              ))}
            </div>
          </section>
        )}

        {/* ── Section 6: Settings & Account ───────────────────────────── */}
        {filteredSettingsModules.length > 0 && (
          <section className="ya-section" aria-labelledby="heading-settings">
            <div className="ya-section-header">
              <div className="ya-section-icon ya-section-icon--slate">
                <Settings className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <div>
                <h2 id="heading-settings" className="ya-section-title">
                  Settings &amp; Account
                </h2>
                <p className="ya-section-subtitle">
                  Configure your AETHER experience
                </p>
              </div>
            </div>
            <div className="ya-grid-settings">
              {filteredSettingsModules.map((card) => (
                <CompactCard key={card.id} card={card} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state when search produces no items */}
        {searchQuery && totalResults === 0 && (
          <div className="ya-empty-state" role="status">
            <Search className="h-8 w-8 text-slate-500 mb-2" aria-hidden="true" />
            <h3>No modules found</h3>
            <p>No tools matched &ldquo;{searchQuery}&rdquo;. Try another search term.</p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="ya-cta-btn"
              style={{ marginTop: '1rem', width: 'auto', padding: '0.625rem 1.75rem' }}
            >
              Show all modules
            </button>
          </div>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="ya-footer" aria-label="YOUR AETHER footer">
        {/* Left Brand & Version */}
        <div className="ya-footer-brand">
          <AetherSymbol size={20} idPrefix="ya-footer" />
          <span>
            YOUR <strong>AETHER</strong>
          </span>
          <span className="ya-footer-badge">v1.0</span>
        </div>

        {/* Center Info Links */}
        <nav className="ya-footer-links" aria-label="Footer navigation">
          <Link to="/privacy" className="ya-footer-link">Privacy</Link>
          <span className="ya-footer-sep" aria-hidden="true">·</span>
          <Link to="/terms" className="ya-footer-link">Terms</Link>
          <span className="ya-footer-sep" aria-hidden="true">·</span>
          <Link to="/help" className="ya-footer-link">Help</Link>
          <span className="ya-footer-sep" aria-hidden="true">·</span>
          <Link to="/contact" className="ya-footer-link">Contact</Link>
          <span className="ya-footer-sep" aria-hidden="true">·</span>
          <span className="ya-footer-copy">&copy; 2026 AETHER</span>
        </nav>

        {/* Right Return Link */}
        <Link to="/app" className="ya-footer-return" title="Return to Classic AETHER OS">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Return to Classic AETHER</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </footer>
    </div>
  );
};

export default YourAetherPage;
