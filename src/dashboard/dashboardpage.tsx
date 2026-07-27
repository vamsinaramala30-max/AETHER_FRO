import React, { useState, useEffect, useCallback } from "react";
import WelcomeHeader, { UserProfile } from "./WelcomeHeader";
import DailyOverview, { MetricItem } from "./DailyOverview";
import TodaySummary, { Deliverable } from "./TodaySummary";
import QuickActions, { QuickActionItem } from "./QuickActions";
import RecentActivity, { ActivityItem } from "./RecentActivity";
import AIInsights, { InsightItem } from "./AIInsights";
import ProductivitySnapshot, { ProductivityData } from "./ProductivitySnapshot";
import DashboardSkeleton from "./DashboardSkeleton";

export interface DashboardDataState {
  user: UserProfile;
  metrics: MetricItem[];
  deliverables: Deliverable[];
  activities: ActivityItem[];
  insights: InsightItem[];
  productivity: ProductivityData;
}

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DashboardDataState | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = useCallback(async (isSilentRefresh = false) => {
    if (isSilentRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Async state hydration boundary
      await new Promise((resolve) => setTimeout(resolve, 600));

      setData({
        user: {
          name: "Workspace Member",
          role: "System Administrator",
        },
        metrics: [
          { id: "m1", label: "Active Tasks", value: "14", change: "+2 today", trend: "up", description: "6 remaining" },
          { id: "m2", label: "Completion Rate", value: "70%", change: "+5%", trend: "up", description: "Target: 80%" },
          { id: "m3", label: "Focus Hours", value: "4.5h", change: "-0.5h", trend: "down", description: "Daily goal: 6.0h" },
          { id: "m4", label: "System Load", value: "18%", change: "Optimal", trend: "neutral", description: "All services operational" },
        ],
        deliverables: [
          { id: "d1", title: "Initialize Deployment Routing", completed: true, category: "Infrastructure" },
          { id: "d2", title: "Review Token Context Pipeline", completed: true, category: "Security" },
          { id: "d3", title: "Refactor Local State Management", completed: false, category: "Frontend" },
        ],
        activities: [
          { id: "a1", user: "Build System", action: "compiled workspace assets", target: "main-bundle", timestamp: "10m ago", status: "success" },
          { id: "a2", user: "Security Scanner", action: "completed audit on", target: "auth-service", timestamp: "42m ago", status: "info" },
          { id: "a3", user: "Database Node", action: "generated index for", target: "user_sessions", timestamp: "2h ago", status: "success" },
        ],
        insights: [
          {
            id: "i1",
            type: "optimization",
            title: "Task Velocity Peak",
            summary: "Task completions peak around 10:00 AM. Consider scheduling heavy tasks in this window.",
            actionText: "View Schedule",
            onAction: () => {},
          },
          {
            id: "i2",
            type: "info",
            title: "Memory Allocation",
            summary: "Local state cleanup completed. Component render performance improved by ~12%.",
          },
        ],
        productivity: {
          weeklyGoalHours: 40,
          completedHours: 28.5,
          focusScore: 88,
          efficiencyRating: "Optimal",
        },
      });

      setLastUpdated(new Date());
    } catch (err: unknown) {
      const errObject = err instanceof Error ? err : new Error("Failed to load dashboard data.");
      setError(errObject);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (isMounted) {
        await fetchDashboardData(false);
      }
    };

    void init();

    return () => {
      isMounted = false;
    };
  }, [fetchDashboardData]);

  const handleManualRefresh = useCallback(() => {
    void fetchDashboardData(true);
  }, [fetchDashboardData]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto min-h-screen">
        <div className="p-6 rounded-2xl border border-red-800/50 bg-red-950/20 text-center space-y-4">
          <h2 className="text-lg font-bold text-red-300">Unable to Load Dashboard</h2>
          <p className="text-sm text-red-400 font-mono">{error.message}</p>
          <button
            type="button"
            onClick={handleManualRefresh}
            className="px-4 py-2 text-xs font-semibold text-slate-100 bg-red-900 hover:bg-red-800 border border-red-700 rounded-xl transition-colors focus:outline-none"
          >
            Retry Connection
          </button>
        </div>
      </main>
    );
  }

  const quickActions: QuickActionItem[] = [
    {
      id: "qa-1",
      label: "New Project",
      description: "Create workspace",
      onClick: () => {},
    },
    {
      id: "qa-2",
      label: "View Metrics",
      description: "Open analytics",
      onClick: () => {},
    },
    {
      id: "qa-3",
      label: "System Logs",
      description: "Inspect runtime",
      onClick: () => {},
    },
    {
      id: "qa-4",
      label: "Settings",
      description: "Manage options",
      onClick: () => {},
    },
  ];

  return (
    <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen text-slate-100">
      {/* Component 1: Welcome Header */}
      <WelcomeHeader
        user={data?.user}
        lastUpdated={lastUpdated}
        onRefresh={handleManualRefresh}
        isRefreshing={refreshing}
      />

      {/* Component 2: Operational Telemetry Stream */}
      <DailyOverview metrics={data?.metrics} isLoading={loading} />

      {/* Primary Workspace Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <TodaySummary deliverables={data?.deliverables} isLoading={loading} />
          <RecentActivity activities={data?.activities} isLoading={loading} />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6 min-w-0">
          <ProductivitySnapshot data={data?.productivity} isLoading={loading} />
          <AIInsights insights={data?.insights} isLoading={loading} />
          <QuickActions actions={quickActions} />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;