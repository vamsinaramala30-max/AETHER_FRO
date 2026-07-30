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

import { DailyOverviewPage } from '@/dashboard/dailyoverviewpage';
import { SchedulePage } from '@/dashboard/schedulepage';
import { RecentActivityPage } from '@/dashboard/recentactivitypage';
import { QuickActionsPage } from '@/dashboard/quickactionspage';
import { AIInsightsPage } from '@/ai/insights/aiinsightspage';
import { ProjectsPage } from '@/projects/projectspage';
import { FinanceOverviewPage } from '@/workspace/finance/financeoverviewpage';
import { FocusModePage } from '@/workspace/focus/focusmodepage';
import { SmartRemindersPage } from '@/automation/reminders/smartreminderspage';
import { AnalyticsReportPage } from '@/analytics/analyticsreportpage';
import { BarChart3, TrendingUp, Target, Clock, Bot } from 'lucide-react';

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
      {
        path: 'overview',
        element: <DailyOverviewPage />,
      },
      {
        path: 'schedule',
        element: <SchedulePage />,
      },
      {
        path: 'activity',
        element: <RecentActivityPage />,
      },
      {
        path: 'quick-actions',
        element: <QuickActionsPage />,
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
        path: 'conversations/:conversationId',
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
      {
        path: 'insights',
        element: <AIInsightsPage />,
      },
      // Projects Section
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
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
      // Finance Section
      {
        path: 'finance',
        element: <FinanceOverviewPage />,
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
        path: 'reminders',
        element: <SmartRemindersPage />,
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
        path: 'focus',
        element: <FocusModePage />,
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
      // Analytics Section
      {
        path: 'analytics/productivity',
        element: (
          <AnalyticsReportPage
            title="Productivity Report"
            subtitle="Detailed analysis of daily throughput, focus sessions, and completed deliverables."
            icon={<BarChart3 className="w-6 h-6 text-purple-400" />}
          />
        ),
      },
      {
        path: 'analytics/goals',
        element: (
          <AnalyticsReportPage
            title="Goal Progress Tracking"
            subtitle="Trajectory analysis for quarterly OKRs and milestone completions."
            icon={<Target className="w-6 h-6 text-emerald-400" />}
          />
        ),
      },
      {
        path: 'analytics/time',
        element: (
          <AnalyticsReportPage
            title="Time Allocation Insights"
            subtitle="Breakdown of deep work vs meeting overhead across projects."
            icon={<Clock className="w-6 h-6 text-blue-400" />}
          />
        ),
      },
      {
        path: 'analytics/ai',
        element: (
          <AnalyticsReportPage
            title="AI Recommendations"
            subtitle="Smart suggestions for workflow optimization and automated task delegation."
            icon={<Bot className="w-6 h-6 text-amber-400" />}
          />
        ),
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