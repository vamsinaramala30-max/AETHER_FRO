import React, { Suspense } from 'react';
import { RouteObject, Navigate, Outlet } from 'react-router-dom';

// Auth & Layout Guards
import { ProtectedGuard } from '@/components/auth/ProtectedGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';

// Direct Page Imports (Guarantees reliable chunk resolution and strict exports)
import DashboardPage from '@/pages/dashboard/DashboardPage';

// AI Pages
import AssistantPage from '@/ai/assistant/AssistantPage';
import ConversationsPage from '@/ai/conversations/ConversationsPage';
import MemoryPage from '@/ai/memory/MemoryPage';
import PromptLibraryPage from '@/ai/prompt-library/PromptLibraryPage';

// Projects Pages
import TasksPage from '@/projects/tasks/TasksPage';
import GoalsPage from '@/projects/goals/GoalsPage';
import StudyPlannerPage from '@/projects/study-planner/StudyPlannerPage';
import WeeklyReviewPage from '@/projects/weekly-review/WeeklyReviewPage';

// Knowledge Pages
import NotesPage from '@/knowledge/notes/NotesPage';
import DocumentsPage from '@/knowledge/documents/DocumentsPage';
import KnowledgeBasePage from '@/knowledge/knowledge-base/KnowledgeBasePage';
import SearchPage from '@/knowledge/search/SearchPage';

// Automation Pages
import WorkflowCenterPage from '@/automation/workflow-center/WorkflowCenterPage';
import IntegrationsPage from '@/automation/integrations/IntegrationsPage';
import ScheduledAutomationPage from '@/automation/scheduled-automation/ScheduledAutomationPage';
import FutureAIFeaturesPage from '@/automation/future-ai-features/FutureAIFeaturesPage';

// Workspace Pages
import CalendarPage from '@/workspace/calendar/CalendarPage';
import ProductivityHubPage from '@/workspace/productivity-hub/ProductivityHubPage';
import RecentFilesPage from '@/workspace/recent-files/RecentFilesPage';
import FavoritesPage from '@/workspace/favorites/FavoritesPage';

// Settings Pages
import ProfilePage from '@/settings/profile/ProfilePage';
import AppearancePage from '@/settings/appearance/AppearancePage';
import NotificationsPage from '@/settings/notifications/NotificationsPage';
import SecurityPage from '@/settings/security/SecurityPage';
import PreferencesPage from '@/settings/preferences/PreferencesPage';
import ConnectedAccountsPage from '@/settings/connected-accounts/ConnectedAccountsPage';
import BillingPage from '@/settings/billing/BillingPage';

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
const ProtectedLayoutWrapper: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ProtectedGuard>
      <AppLayout>
        <Suspense fallback={<PageLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </AppLayout>
    </ProtectedGuard>
  );
};

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