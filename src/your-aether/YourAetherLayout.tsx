/**
 * YourAetherLayout.tsx
 *
 * Shared layout wrapper for pages opened from YOUR AETHER launcher.
 * Provides:
 * - A consistent sticky back-navigation bar at the top
 * - Context-aware back navigation (goes to /app/your-aether or actual history)
 * - No sidebar (YOUR AETHER is a sidebar-free experience)
 * - Applies the ya-module-page base styles
 *
 * BACK BUTTON RULES (from spec):
 * 1. If opened from YOUR AETHER launcher → Back returns to /app/your-aether
 * 2. If the user has navigated multiple pages deep → Back follows actual history
 * 3. If arrived via direct URL/bookmark → Back goes to /app/your-aether (safe parent)
 * 4. Browser Back/Forward continue to work naturally
 * 5. Does NOT log out or reset authentication
 */

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AetherSymbol } from '@/components/branding/AetherLogo';
import './your-aether-layout.css';

// ─────────────────────────────────────────────────────────────────────────────
// Route → Label mapping (used for breadcrumb display in back bar)
// ─────────────────────────────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  // Launcher
  '/app/your-aether': 'YOUR AETHER',
  // Classic AETHER paths
  '/app': 'Dashboard',
  '/app/ai': 'AETHER Agent',
  '/app/ai/assistant': 'AI Assistant',
  '/app/ai/memory': 'Memory',
  '/app/ai/prompts': 'Prompt Library',
  '/app/ai/models': 'Models',
  '/app/ai/agents': 'Agents',
  '/app/projects': 'Projects',
  '/app/projects/tasks': 'Tasks',
  '/app/projects/goals': 'Goals',
  '/app/projects/files': 'Files',
  '/app/knowledge': 'Knowledge',
  '/app/knowledge/documents': 'Documents',
  '/app/knowledge/notes': 'Notes',
  '/app/knowledge/base': 'Knowledge Base',
  '/app/knowledge/search': 'Search',
  '/app/workspace': 'Workspace',
  '/app/workspace/calendar': 'Calendar',
  '/app/workspace/focustimer': 'Focus Timer',
  '/app/workspace/webdirectory': 'Web Directory',
  '/app/workspace/weeklyplanner': 'Weekly Planner',
  '/app/workspace/productivity-hub': 'Productivity Hub',
  '/app/automation': 'Automation',
  '/app/automation/logs': 'Automation Logs',
  '/app/quick-tools': 'Quick Tools',
  '/app/cognitive-hub': 'Cognitive Hub',
  '/app/cognitive-hub/daily': 'Daily Challenge',
  '/app/cognitive-hub/dashboard': 'Cognitive Dashboard',
  '/app/settings/profile': 'Profile',
  '/app/settings/appearance': 'Appearance',
  '/app/settings/notifications': 'Notifications',
  '/app/settings/security': 'Security',
  '/app/settings/preferences': 'Preferences',
  '/app/settings/billing': 'Billing',
  // YOUR AETHER module paths (opened from launcher, have back bar)
  '/ya/dashboard': 'Dashboard',
  '/ya/ai': 'AETHER Agent',
  '/ya/ai/assistant': 'AI Assistant',
  '/ya/ai/memory': 'Memory',
  '/ya/ai/prompts': 'Prompt Library',
  '/ya/ai/models': 'Models',
  '/ya/ai/agents': 'Agents',
  '/ya/projects': 'Projects',
  '/ya/projects/tasks': 'Tasks',
  '/ya/projects/goals': 'Goals',
  '/ya/projects/files': 'Files',
  '/ya/knowledge': 'Knowledge',
  '/ya/knowledge/documents': 'Documents',
  '/ya/knowledge/notes': 'Notes',
  '/ya/knowledge/base': 'Knowledge Base',
  '/ya/knowledge/search': 'Research',
  '/ya/workspace': 'Workspace',
  '/ya/workspace/calendar': 'Calendar',
  '/ya/workspace/focustimer': 'Focus Timer',
  '/ya/workspace/webdirectory': 'Web Directory',
  '/ya/workspace/weeklyplanner': 'Weekly Planner',
  '/ya/workspace/productivity-hub': 'Productivity Hub',
  '/ya/automation': 'Automation',
  '/ya/automation/logs': 'Automation Logs',
  '/ya/quick-tools': 'Quick Tools',
  '/ya/cognitive-hub': 'Cognitive Hub',
  '/ya/cognitive-hub/daily': 'Daily Challenge',
  '/ya/cognitive-hub/dashboard': 'Cognitive Dashboard',
  '/ya/settings/profile': 'Profile',
  '/ya/settings/appearance': 'Appearance',
  '/ya/settings/notifications': 'Notifications',
  '/ya/settings/security': 'Security',
  '/ya/settings/preferences': 'Preferences',
  '/ya/settings/billing': 'Billing',
};

function getPageLabel(pathname: string): string {
  const exact = ROUTE_LABELS[pathname];
  if (exact) return exact;
  // Partial match for dynamic routes (e.g., /app/cognitive-hub/:gameId)
  const parts = pathname.split('/').filter(Boolean);
  for (let i = parts.length; i > 0; i--) {
    const partial = '/' + parts.slice(0, i).join('/');
    if (ROUTE_LABELS[partial]) return ROUTE_LABELS[partial];
  }
  // Fallback: capitalize last path segment
  const last = parts[parts.length - 1];
  return last ? last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ') : 'Module';
}

// ─────────────────────────────────────────────────────────────────────────────
// BackBar — the shared navigation bar
// ─────────────────────────────────────────────────────────────────────────────

interface BackBarProps {
  /** Override the back destination (default: /app/your-aether) */
  backTo?: string;
  /** Override the back label */
  backLabel?: string;
}

export const YourAetherBackBar: React.FC<BackBarProps> = ({
  backTo = '/app/your-aether',
  backLabel = 'YOUR AETHER',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLabel = getPageLabel(location.pathname);

  const handleBack = () => {
    // If browser history has a previous entry in this session, go back
    // This preserves filters, scroll positions, etc.
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // No history (direct URL / refresh) → go to safe parent
      navigate(backTo, { replace: true });
    }
  };

  return (
    <div className="ya-back-bar" role="navigation" aria-label="Module navigation">
      <div className="ya-back-bar-inner">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="ya-back-btn"
          aria-label={`Back to ${backLabel}`}
          title={`Back to ${backLabel}`}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="ya-back-btn-label">{backLabel}</span>
        </button>

        {/* Breadcrumb separator + current page */}
        <div className="ya-back-breadcrumb" aria-hidden="true">
          <span className="ya-back-sep">/</span>
          <span className="ya-back-current">{currentLabel}</span>
        </div>

        {/* Launcher Logo (right-aligned, links back to launcher) */}
        <Link
          to="/app/your-aether"
          className="ya-back-launcher-link"
          title="YOUR AETHER Launcher"
          aria-label="YOUR AETHER Launcher"
        >
          <AetherSymbol size={20} idPrefix="back-bar" />
          <span className="ya-back-launcher-text">YOUR AETHER</span>
        </Link>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// YourAetherModulePage — thin wrapper that adds the back bar above content
// ─────────────────────────────────────────────────────────────────────────────

interface YourAetherModulePageProps {
  children: React.ReactNode;
  backTo?: string;
  backLabel?: string;
}

export const YourAetherModulePage: React.FC<YourAetherModulePageProps> = ({
  children,
  backTo,
  backLabel,
}) => {
  return (
    <div className="ya-module-page">
      <YourAetherBackBar backTo={backTo} backLabel={backLabel} />
      <div className="ya-module-content">{children}</div>
    </div>
  );
};

export default YourAetherModulePage;
