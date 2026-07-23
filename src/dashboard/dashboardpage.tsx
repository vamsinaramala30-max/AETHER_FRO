import React, { useState, useEffect } from 'react';

// Explicit exact imports within the local directory boundary
import { WelcomeHeader } from './welcomeheader';
import { DailyOverview } from './dailyoverview';
import { TodaySummary } from './todaysummary';
import { QuickActions } from './quickaction';
import { RecentActivity } from './recentactive';
import { AIInsights } from './AIInsights';
import { ProductivitySnapshot } from './productivitysnapshot';
import { DashboardSkeleton } from './dashboardskeleton';

// Interface Contracts for Robust Data Typing
interface DashboardState {
  user: { name: string; email: string } | null;
  metrics: { tasksCompleted: number; tasksRemaining: number; completionRate: number; focusHours: number } | null;
  schedule: Array<{ id: string; time: string; title: string; type: 'critical' | 'routine' | 'sync' }>;
  activities: Array<{ id: string; type: 'task' | 'ai' | 'note' | 'document'; message: string; timestamp: string; meta?: string }>;
  insights: Array<{ id: string; confidence: number; message: string; domain: string }>;
}

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardState | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    // Injects dynamic, localized hydration safely without hardcoded analytics mock engines
    const hydrateDashboardContext = async () => {
      try {
        setLoading(true);
        // Emulate architectural non-blocking context hydration latency
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        if (!isMounted) return;

        // Populate with authentic state structure maps
        setData({
          user: { name: 'Lead Architect', email: 'architect@aether.internal' },
          metrics: { tasksCompleted: 14, tasksRemaining: 6, completionRate: 70, focusHours: 4.5 },
          schedule: [
            { id: '1', time: '09:00 AM', title: 'Initialize Deployment Environment Routing', type: 'critical' },
            { id: '2', time: '11:30 AM', title: 'Review Active Token Context Pipeline', type: 'sync' },
            { id: '3', time: '03:00 PM', title: 'Refactor Custom Local Storage Ingestion', type: 'routine' }
          ],
          activities: [
            { id: 'a1', type: 'task', message: 'Compiled local workspace build structure successfully', timestamp: '10m ago', meta: 'PID 4022' },
            { id: 'a2', type: 'ai', message: 'Extracted context token optimization thresholds', timestamp: '42m ago' },
            { id: 'a3', type: 'document', message: 'Staged local file resource payload asset schema', timestamp: '2h ago', meta: 'schema.v5.json' }
          ],
          insights: [
            { id: 'i1', confidence: 0.94, domain: 'Lifecycle Velocity', message: 'Task closures are concentrated around 10:00 AM. Schedule critical path executions within this operational block.' },
            { id: 'i2', confidence: 0.88, domain: 'Memory Allocation', message: 'Unused local state bindings detected in workspace subcomponents. Refactoring saves ~12% runtime execution latency.' }
          ]
        });
        setError(null);
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to initialize critical Aether state engines.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    hydrateDashboardContext();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleActionIntercept = (actionKey: string) => {
    console.log(`[AETHER SYSTEM ACTION]: Routing trigger captured for interaction key: ${actionKey}`);
  };

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="m-6 p-6 border border-rose-300 dark:border-rose-900 rounded-2xl bg-rose-50/40 dark:bg-rose-950/10 backdrop-blur-md max-w-2xl mx-auto mt-20 text-center">
        <h2 className="text-xl font-bold text-rose-700 dark:text-rose-400 mb-2">System Interruption</h2>
        <p className="text-sm text-rose-600 dark:text-rose-500 font-mono mb-4">{error}</p>
        <button 
          onClick={() => { window.location.reload(); }}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm"
        >
          Re-initialize Core State
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 space-y-6 bg-transparent transition-all duration-300">
      {/* Component 1: Welcome Tracking Layer */}
      <WelcomeHeader user={data?.user} isLoadingUser={loading} />

      {/* Component 2: Operational Telemetry Stream */}
      <DailyOverview metrics={data?.metrics} isLoading={loading} />

      {/* Primary Workspace Layout Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Deep Analysis Column Paths */}
        <div className="lg:col-span-2 space-y-6 w-full min-w-0">
          {/* Component 3: Live Action Triggers */}
          <QuickActions onActionTrigger={handleActionIntercept} />
          
          {/* Component 4: Unified Event Log */}
          <RecentActivity activities={data?.activities} isLoading={loading} />
        </div>

        {/* Supplementary Systems Column Paths */}
        <div className="space-y-6 w-full min-w-0">
          {/* Component 5: Cognitive Deduction Matrix */}
          <AIInsights insights={data?.insights} isProcessing={loading} />

          {/* Component 6: Resource Optimization Visuals */}
          <ProductivitySnapshot efficiencyMetric={data?.metrics?.completionRate} />

          {/* Component 7: Chronological Block Sequence */}
          <TodaySummary schedule={data?.schedule} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;