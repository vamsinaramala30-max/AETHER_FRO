import React, { Suspense } from 'react';
import { RouteObject, Outlet, Navigate } from 'react-router-dom';

import { AppLayout } from '@/app/layouts/applayout';
import { ProtectedGuard } from '@/guards/ProtectedGuard';

// ── Home ─────────────────────────────────────────────────────────────────────
import { HomePage } from '@/home/HomePage';

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
import { NotesPage } from '@/knowledge/notes/notepage';
import { DocumentsPage } from '@/knowledge/documents/documentpage';
import { KnowledgeBasePage } from '@/knowledge/knowledge-base/KnowledgeBasePage';
import { SearchPage } from '@/knowledge/search/searchpage';

// ── Calendar ─────────────────────────────────────────────────────────────────
import { CalendarPage } from '@/workspace/calendar/pages/CalendarPage';

// ── Automation ───────────────────────────────────────────────────────────────
import { AutomationPage } from '@/automation/AutomationPage';
import { WorkflowCenterPage } from '@/automation/workflow-center/workflowcenterpage';
import { IntegrationsPage } from '@/automation/integrations/integrationpage';
import { ScheduledAutomationPage } from '@/automation/scheduled-automation/scheduleautomationpage';
import { AutomationLogsPage } from '@/automation/logs/automationlogspage';

// ── Workspace ─────────────────────────────────────────────────────────────────
import { WorkspacePage } from '@/workspace/WorkspacePage';
import { ProductivityHubPage } from '@/workspace/productivity-hub/productivityhubpage';
import { RecentFilesPage } from '@/workspace/recent-files/recentfilepage';
import { FavoritesPage } from '@/workspace/favorites/favoritepage';
import { MembersPage } from '@/workspace/members/MembersPage';
import FocusTimer from '@/workspace/timer/focustimer';
import { WebDirectory } from '@/workspace/webdirectory/webdirectory';
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
          { path: 'workflows', element: <WorkflowCenterPage /> },
          { path: 'integrations', element: <IntegrationsPage /> },
          { path: 'schedules', element: <ScheduledAutomationPage /> },
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
          { path: 'api-keys', element: <WorkspacePage /> },
          { path: 'audit-logs', element: <WorkspacePage /> },
          { path: 'focustimer', element: <FocusTimer /> },
          { path: 'webdirectory', element: <WebDirectory /> },

        ],
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
