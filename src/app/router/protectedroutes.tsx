import React, { Suspense } from 'react';
import { RouteObject, Outlet } from 'react-router-dom';

import { AppLayout } from '@/app/layouts/applayout';
import { ProtectedGuard } from '@/guards/ProtectedGuard';

// Home
import { HomePage } from '@/home/HomePage';

// AI
import { AssistantPage } from '@/ai/assistant/AssistantPage';
import { ConversationsPage } from '@/ai/conversations/conversationPage';
import { MemoryPage } from '@/ai/memory/MemoryPage';
import { PromptLibraryPage } from '@/ai/prompt-library/promptlibPage';

// Projects
import { TasksPage } from '@/projects/tasks/taskPage';
import { GoalsPage } from '@/projects/goals/goalPage';
import { StudyPlannerPage } from '@/projects/study-planner/StudyPlannerPage';
import { WeeklyReviewPage } from '@/projects/weekly-review/WeeklyReviewPage';

// Knowledge
import { NotesPage } from '@/knowledge/notes/notePage';
import { DocumentsPage } from '@/knowledge/documents/documentPage';
import { KnowledgeBasePage } from '@/knowledge/knowledge-base/KnowledgeBasePage';
import { SearchPage } from '@/knowledge/search/SearchPage';

// Automation
import { WorkflowCenterPage } from '@/automation/workflow-center/WorkflowCenterPage';
import { IntegrationsPage } from '@/automation/integrations/integrationPage';
import { ScheduledAutomationPage } from '@/automation/scheduled-automation/scheduleautomationPage';
import { FutureAIFeaturesPage } from '@/automation/future-ai-features/FutureAIFeaturesPage';

// Workspace
import { CalendarPage } from '@/workspace/calendar/pages/calendarpage';
import { ProductivityHubPage } from '@/workspace/productivity-hub/ProductivityHubPage';
import { RecentFilesPage } from '@/workspace/recent-files/recentfilePage';
import { FavoritesPage } from '@/workspace/favorites/favoritepage';

// Settings
import { ProfilePage } from '@/settings/profile/ProfilePage';
import { AppearancePage } from '@/settings/appearance/apperancepage';
import { NotificationsPage } from '@/settings/notifications/notificationpage';
import { SecurityPage } from '@/settings/security/SecurityPage';
import { PreferencesPage } from '@/settings/preferences/preferencepage';
import { ConnectedAccountsPage } from '@/settings/connected-accounts/connectedaccountpage';
import { BillingPage } from '@/settings/billing/BillingPage';

/**
 * Loading Spinner for Route-level Transitions
 */
const PageLoadingSpinner: React.FC = () => (
  <div className="flex h-full w-full items-center justify-center min-h-[400px]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

/**
 * Authenticated Layout Wrapper with Protected Guard Check
 */
const ProtectedLayoutWrapper: React.FC = () => (
  <ProtectedGuard>
    <AppLayout>
      <Suspense fallback={<PageLoadingSpinner />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  </ProtectedGuard>
);

/**
 * Core Protected Route Definitions for React Router v7
 */
export const protectedRoutes: RouteObject[] = [
  {
    path: 'app',
    element: <ProtectedLayoutWrapper />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // AI Section
      {
        path: 'assistant',
        element: <AssistantPage />,
      },
      {
        path: 'conversations',
        element: <ConversationsPage />,
      },
      {
        path: 'memory',
        element: <MemoryPage />,
      },
      {
        path: 'prompts',
        element: <PromptLibraryPage />,
      },
      // Projects Section
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'goals',
        element: <GoalsPage />,
      },
      {
        path: 'study-planner',
        element: <StudyPlannerPage />,
      },
      {
        path: 'weekly-review',
        element: <WeeklyReviewPage />,
      },
      // Knowledge Section
      {
        path: 'notes',
        element: <NotesPage />,
      },
      {
        path: 'documents',
        element: <DocumentsPage />,
      },
      {
        path: 'knowledge-base',
        element: <KnowledgeBasePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      // Automation Section
      {
        path: 'workflows',
        element: <WorkflowCenterPage />,
      },
      {
        path: 'integrations',
        element: <IntegrationsPage />,
      },
      {
        path: 'scheduled-automation',
        element: <ScheduledAutomationPage />,
      },
      {
        path: 'future-ai',
        element: <FutureAIFeaturesPage />,
      },
      // Workspace Section
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'productivity',
        element: <ProductivityHubPage />,
      },
      {
        path: 'recent-files',
        element: <RecentFilesPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      // Settings Section
      {
        path: 'settings',
        children: [
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'appearance',
            element: <AppearancePage />,
          },
          {
            path: 'notifications',
            element: <NotificationsPage />,
          },
          {
            path: 'security',
            element: <SecurityPage />,
          },
          {
            path: 'preferences',
            element: <PreferencesPage />,
          },
          {
            path: 'accounts',
            element: <ConnectedAccountsPage />,
          },
          {
            path: 'billing',
            element: <BillingPage />,
          },
        ],
      },
    ],
  },
];

export default protectedRoutes;