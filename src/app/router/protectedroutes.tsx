import React, { Suspense } from 'react';
import { RouteObject, Outlet } from 'react-router-dom';

import { AppLayout } from '@/app/layouts/applayout';
import { ProtectedGuard } from '@/guards/ProtectedGuard';

import { DashboardPage } from '@/dashboard/dashboardpage';
import { AssistantPage } from '@/ai/assistant/assistantpage';
import { ConversationsPage } from '@/ai/conversations/conversationpage';
import { MemoryPage } from '@/ai/memory/memorypage';
import { PromptLibraryPage } from '@/ai/prompt-library/promptlibpage';
import { TasksPage } from '@/projects/tasks/taskpage';
import { GoalsPage } from '@/projects/goals/goalpage';
import { StudyPlannerPage } from '@/projects/study-planner/studyplannerpage';
import { WeeklyReviewPage } from '@/projects/weekly-review/weeklyreviewpage';
import { NotesPage } from '@/knowledge/notes/notepage';
import { DocumentsPage } from '@/knowledge/documents/documentpage';
import { KnowledgeBasePage } from '@/knowledge/knowledge-base/KnowledgeBasePage';
import { SearchPage } from '@/knowledge/search/searchpage';
import { WorkflowCenterPage } from '@/automation/workflow-center/workflowcenterpage';
import { IntegrationsPage } from '@/automation/integrations/integrationpage';
import { ScheduledAutomationPage } from '@/automation/scheduled-automation/scheduleautomationpage';
import { FutureAIFeaturesPage } from '@/automation/future-ai-features/futureAIfeaturespage';
import { CalendarPage } from '@/workspace/calendar/pages/CalendarPage';
import { ProductivityHubPage } from '@/workspace/productivity-hub/productivityhubpage';
import { RecentFilesPage } from '@/workspace/recent-files/recentfilepage';
import { FavoritesPage } from '@/workspace/favorites/favoritepage';
import { ProfilePage } from '@/settings/profile/profilepage';
import { AppearancePage } from '@/settings/appearance/apperancepage';
import { NotificationsPage } from '@/settings/notifications/notificationpage';
import { SecurityPage } from '@/settings/security/securitypage';
import { PreferencesPage } from '@/settings/preferences/preferencepage';
import { ConnectedAccountsPage } from '@/settings/connected-accounts/connectedaccountpage';
import { BillingPage } from '@/settings/billing/billingpage';

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
        element: <DashboardPage />,
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