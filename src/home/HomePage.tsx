import React, { useEffect, useState } from 'react';
import { HomeHeader } from './HomeHeader';
import { Dashboard } from './dashboard/Dashboard';
import { DailyOverview } from './dialy-overview/DailyOverview';
import { TodaysSchedule } from './todays-schedule/TodaysSchedule';
import { RecentActivity } from './recent-activity/RecentActivity';
import { QuickActions } from './quick-actions/QuickActions';
import { ContinueWorking } from './continue-working/ContinueWorking';
import { AIRecommendations } from './ai-recommendations/AIRecommendations';
import { Notifications } from './notifications/Notifications';
import { HomeWidgets } from './widgets/HomeWidgets';
import { fetchHomeMetaData, fetchGlobalHomeStats, HomeMetaData, GlobalHomeStats } from './homeService';

export const HomePage: React.FC = () => {
  const [metaData, setMetaData] = useState<HomeMetaData | null>(null);
  const [stats, setStats] = useState<GlobalHomeStats | null>(null);

  const loadData = () => {
    fetchHomeMetaData().then(setMetaData);
    fetchGlobalHomeStats().then(setStats);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <HomeHeader metaData={metaData} stats={stats} onRefresh={loadData} />

      <HomeWidgets />

      <QuickActions />

      <DailyOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Dashboard
            totalTasks={stats?.completedTasksToday ? stats.completedTasksToday + 10 : 24}
            pendingReviews={stats?.pendingReviewsCount ?? 3}
          />
          <ContinueWorking />
          <AIRecommendations />
        </div>

        <div className="space-y-6">
          <TodaysSchedule />
          <RecentActivity />
          <Notifications />
        </div>
      </div>
    </div>
  );
};

export default HomePage;