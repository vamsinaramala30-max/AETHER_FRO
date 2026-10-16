import React, { Suspense } from 'react';
import { RouteObject, Outlet, Navigate } from 'react-router-dom';

import { AppLayout } from '@/app/layouts/applayout';
import { ProtectedGuard } from '@/guards/ProtectedGuard';
import { YourAetherModulePage } from '@/your-aether/YourAetherLayout';
import { WelcomeChoicePage } from '@/auth/WelcomeChoicePage';

// ── Home ─────────────────────────────────────────────────────────────────────
import { HomePage } from '@/home/HomePage';
import { YourAetherPage } from '@/your-aether/YourAetherPage';

// ── AI ───────────────────────────────────────────────────────────────────────
import { AIModulePage } from '@/ai/AIModulePage';
import { AssistantPage } from '@/ai/assistant/assistantpage';
import { MemoryPage } from '@/ai/memory/memorypage';
import { PromptLibraryPage } from '@/ai/prompt-library/promptlibpage';
import { ModelsPage } from '@/ai/models/ModelsPage';
import { AgentsPage } from '@/ai/agents/AgentsPage';

// ── Projects ─────────────────────────────────────────────────────────────────
import { ProjectsPage } from '@/projects/projectspage';
import { TasksPage } from '@/projects/tasks/taskpage';
import { GoalsPage } from '@/projects/goals/goalpage';
import { FilesPage } from '@/projects/files/filespage';

// ── Knowledge ─────────────────────────────────────────────────────────────────
import { KnowledgePage } from '@/knowledge/KnowledgePage';
import { NotesPage } from '@/knowledge/notes/NotesPage';
import { DocumentsPage } from '@/knowledge/documents/documentpage';
import { KnowledgeBasePage } from '@/knowledge/knowledge-base/KnowledgeBasePage';
import { SearchPage } from '@/knowledge/search/searchpage';

// ── Calendar ─────────────────────────────────────────────────────────────────
import { CalendarPage } from '@/workspace/calendar/pages/CalendarPage';

// ── Automation ───────────────────────────────────────────────────────────────
import { AutomationPage } from '@/automation/AutomationPage';
import { AutomationLogsPage } from '@/automation/logs/automationlogspage';

// ── Workspace & Quick Tools ──────────────────────────────────────────────────
import { WorkspacePage } from '@/workspace/WorkspacePage';
import { ProductivityHubPage } from '@/workspace/productivity-hub/productivityhubpage';
import { RecentFilesPage } from '@/workspace/recent-files/recentfilepage';
import { FavoritesPage } from '@/workspace/favorites/favoritepage';
import { MembersPage } from '@/workspace/members/MembersPage';
import FocusTimer from '@/workspace/timer/focustimer';
import WebDirectory from '@/workspace/webdirectory/webdirectory';
import WeeklyPlanner from '@/workspace/weekly planner/weeklyplanner';
import { QuickToolsPage } from '@/workspace/QuickToolsPage';


// ── Settings ─────────────────────────────────────────────────────────────────
import { ProfilePage } from '@/settings/profile/profilepage';
import { AppearancePage } from '@/settings/appearance/apperancepage';
import { NotificationsPage } from '@/settings/notifications/notificationpage';
import { SecurityPage } from '@/settings/security/securitypage';
import { PreferencesPage } from '@/settings/preferences/preferencepage';
import { ConnectedAccountsPage } from '@/settings/connected-accounts/connectedaccountpage';
import { BillingPage } from '@/settings/billing/billingpage';

// ── 404 ──────────────────────────────────────────────────────────────────────
import { AppNotFoundPage } from '@/components/ui/AppNotFoundPage';

// ── Cognitive Hub ─────────────────────────────────────────────────────────────
import { CognitiveHubPage } from '@/cognitive-hub/CognitiveHubPage';
import { CognitiveHubGamePage } from '@/cognitive-hub/CognitiveHubGamePage';
import { CognitiveHubDailyPage } from '@/cognitive-hub/CognitiveHubDailyPage';
import { CognitiveHubDashboardPage } from '@/cognitive-hub/CognitiveHubDashboardPage';

// ─────────────────────────────────────────────────────────────────────────────
// Spinner for Suspense boundaries
// ─────────────────────────────────────────────────────────────────────────────
const PageSpinner: React.FC = () => (
  <div className="flex h-full min-h-[400px] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-500/20 border-t-indigo-500" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Protected layout wrapper: ProtectedGuard → AppLayout → Suspense → Outlet
// ─────────────────────────────────────────────────────────────────────────────
const ProtectedLayoutWrapper: React.FC = () => (
  <ProtectedGuard>
    <AppLayout>
      <Suspense fallback={<PageSpinner />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  </ProtectedGuard>
);

// ─────────────────────────────────────────────────────────────────────────────
// Route Definitions
// ─────────────────────────────────────────────────────────────────────────────
export const protectedRoutes: RouteObject[] = [
  // ── WELCOME / CHOICE PAGE (Standalone Full-Screen, shown after login) ─────────
  {
    path: '/welcome',
    element: (
      <ProtectedGuard>
        <Suspense fallback={<PageSpinner />}>
          <WelcomeChoicePage />
        </Suspense>
      </ProtectedGuard>
    ),
  },

  // ── YOUR AETHER (Standalone Full-Screen Experience) ─────────────────────────
  {
    path: 'app/your-aether',
    element: (
      <ProtectedGuard>
        <Suspense fallback={<PageSpinner />}>
          <YourAetherPage />
        </Suspense>
      </ProtectedGuard>
    ),
  },
  {
    path: 'your-aether',
    element: <Navigate to="/app/your-aether" replace />,
  },

  // ── YOUR AETHER MODULE ROUTES (back-bar, no sidebar) ────────────────────────
  // Each module opened from YOUR AETHER launcher has a sticky back button.
  {
    path: 'ya',
    element: (
      <ProtectedGuard>
        <Suspense fallback={<PageSpinner />}>
          <YourAetherModulePage>
            <Outlet />
          </YourAetherModulePage>
        </Suspense>
      </ProtectedGuard>
    ),
    children: [
      // Dashboard
      { path: 'dashboard', element: <HomePage /> },
      // AI Module
      { path: 'ai', element: <AIModulePage /> },
      { path: 'ai/assistant', element: <AssistantPage /> },
      { path: 'ai/memory', element: <MemoryPage /> },
      { path: 'ai/prompts', element: <PromptLibraryPage /> },
      { path: 'ai/models', element: <ModelsPage /> },
      { path: 'ai/agents', element: <AgentsPage /> },
      // Projects
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/tasks', element: <TasksPage /> },
      { path: 'projects/goals', element: <GoalsPage /> },
      { path: 'projects/files', element: <FilesPage /> },
      // Knowledge
      { path: 'knowledge', element: <KnowledgePage /> },
      { path: 'knowledge/documents', element: <DocumentsPage /> },
      { path: 'knowledge/notes', element: <NotesPage /> },
      { path: 'knowledge/base', element: <KnowledgeBasePage /> },
      { path: 'knowledge/search', element: <SearchPage /> },
      // Workspace
      { path: 'workspace', element: <WorkspacePage /> },
      { path: 'workspace/calendar', element: <CalendarPage /> },
      { path: 'workspace/focustimer', element: <FocusTimer /> },
      { path: 'workspace/webdirectory', element: <WebDirectory /> },
      { path: 'workspace/weeklyplanner', element: <WeeklyPlanner /> },
      { path: 'workspace/productivity-hub', element: <ProductivityHubPage /> },
      // Quick Tools
      { path: 'quick-tools', element: <QuickToolsPage /> },
      // Cognitive Hub
      { path: 'cognitive-hub', element: <CognitiveHubPage /> },
      { path: 'cognitive-hub/daily', element: <CognitiveHubDailyPage /> },
      { path: 'cognitive-hub/dashboard', element: <CognitiveHubDashboardPage /> },
      { path: 'cognitive-hub/:gameId', element: <CognitiveHubGamePage /> },
      // Automation
      { path: 'automation', element: <AutomationPage /> },
      { path: 'automation/logs', element: <AutomationLogsPage /> },
      // Settings
      { path: 'settings/profile', element: <ProfilePage /> },
      { path: 'settings/appearance', element: <AppearancePage /> },
      { path: 'settings/notifications', element: <NotificationsPage /> },
      { path: 'settings/security', element: <SecurityPage /> },
      { path: 'settings/preferences', element: <PreferencesPage /> },
      { path: 'settings/billing', element: <BillingPage /> },
    ],
  },

  // ── Classic AETHER OS (Sidebar Layout) ──────────────────────────────────────
  {
    path: 'app',
    element: <ProtectedLayoutWrapper />,
    children: [
      // ── Home Dashboard ────────────────────────────────────────────────────
      {
        index: true,
        element: <HomePage />,
      },

      // ── AI Module ─────────────────────────────────────────────────────────
      {
        path: 'ai',
        children: [
          { index: true, element: <AIModulePage /> },
          { path: 'assistant', element: <AssistantPage /> },
          { path: 'agent', element: <Navigate to="/app/ai/assistant" replace /> },
          { path: 'conversations', element: <Navigate to="/app/ai/assistant" replace /> },
          {
            path: 'conversations/:conversationId',
            element: <Navigate to="/app/ai/assistant" replace />,
          },
          { path: 'memory', element: <MemoryPage /> },
          { path: 'prompts', element: <PromptLibraryPage /> },
          { path: 'models', element: <ModelsPage /> },
          { path: 'agents', element: <AgentsPage /> },
        ],
      },

      // ── Projects Module ───────────────────────────────────────────────────
      {
        path: 'projects',
        children: [
          { index: true, element: <ProjectsPage /> },
          { path: 'tasks', element: <TasksPage /> },
          { path: 'goals', element: <GoalsPage /> },
          { path: 'board', element: <ProjectsPage /> },
          { path: 'files', element: <FilesPage /> },
          { path: 'file-manager', element: <FilesPage /> },
          { path: ':projectId', element: <Navigate to="/app/projects" replace /> },
        ],
      },

      // ── Tasks Legacy / Direct Redirect ─────────────────────────────────────
      {
        path: 'tasks',
        children: [
          { index: true, element: <Navigate to="/app/projects/tasks" replace /> },
          { path: ':taskId', element: <Navigate to="/app/projects/tasks" replace /> },
        ],
      },


      // ── Knowledge Module ──────────────────────────────────────────────────
      {
        path: 'knowledge',
        children: [
          { index: true, element: <KnowledgePage /> },
          { path: 'documents', element: <DocumentsPage /> },
          { path: 'notes', element: <NotesPage /> },
          { path: 'base', element: <KnowledgeBasePage /> },
          { path: 'search', element: <SearchPage /> },
        ],
      },

      // ── Calendar ──────────────────────────────────────────────────────────
      {
        path: 'calendar',
        element: <Navigate to="/app/workspace/calendar" replace />,
      },

      // ── Automation Module ─────────────────────────────────────────────────
      {
        path: 'automation',
        children: [
          { index: true, element: <AutomationPage /> },
          { path: 'automations', element: <AutomationPage /> },
          { path: 'templates', element: <AutomationPage /> },
          { path: 'activity', element: <AutomationPage /> },
          { path: 'logs', element: <AutomationLogsPage /> },
        ],
      },

      // ── Workspace Module ──────────────────────────────────────────────────
      {
        path: 'workspace',
        children: [
          { index: true, element: <WorkspacePage /> },
          { path: 'calendar', element: <CalendarPage /> },
          { path: 'productivity-hub', element: <ProductivityHubPage /> },
          { path: 'recent-files', element: <RecentFilesPage /> },
          { path: 'favorites', element: <FavoritesPage /> },
          { path: 'members', element: <MembersPage /> },
          { path: 'billing', element: <BillingPage /> },
          { path: 'api-keys', element: <Navigate to="/app/settings/security" replace /> },
          { path: 'audit-logs', element: <Navigate to="/app/automation/logs" replace /> },
          { path: 'focustimer', element: <FocusTimer /> },
          { path: 'webdirectory', element: <WebDirectory /> },
          { path: 'weeklyplanner', element: <WeeklyPlanner /> },
          { path: 'weekly-planner', element: <Navigate to="/app/workspace/weeklyplanner" replace /> },

        ],
      },

      // ── Quick Tools Module ────────────────────────────────────────────────
      {
        path: 'quick-tools',
        children: [
          { index: true, element: <QuickToolsPage /> },
          { path: 'timer', element: <Navigate to="/app/workspace/focustimer" replace /> },
          { path: 'web-directory', element: <Navigate to="/app/workspace/webdirectory" replace /> },
        ],
      },

      // ── Cognitive Hub Module ──────────────────────────────────────────────
      {
        path: 'cognitive-hub',
        children: [
          { index: true, element: <CognitiveHubPage /> },
          { path: 'daily', element: <CognitiveHubDailyPage /> },
          { path: 'dashboard', element: <CognitiveHubDashboardPage /> },
          { path: ':gameId', element: <CognitiveHubGamePage /> },
        ],
      },

      // ── Cognitive Hub legacy redirect ─────────────────────────────────────
      {
        path: 'cognitive-lab',
        element: <Navigate to="/app/cognitive-hub" replace />,
      },

      // ── Settings Module ───────────────────────────────────────────────────
      {
        path: 'settings',
        children: [
          { index: true, element: <Navigate to="/app/settings/profile" replace /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'appearance', element: <AppearancePage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'security', element: <SecurityPage /> },
          { path: 'preferences', element: <PreferencesPage /> },
          { path: 'accounts', element: <ConnectedAccountsPage /> },
          { path: 'billing', element: <BillingPage /> },
          { path: 'audit-logs', element: <AutomationLogsPage /> },
        ],
      },

      // ── In-app 404 ────────────────────────────────────────────────────────
      {
        path: '*',
        element: <AppNotFoundPage />,
      },
    ],
  },
];

export default protectedRoutes;
