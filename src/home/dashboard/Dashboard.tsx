import React from 'react';
import { DashboardStats } from './DashboardStats';
import { DashboardWidgets } from './DashboardWidgets';

interface DashboardProps {
  totalTasks?: number;
  pendingReviews?: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ totalTasks = 24, pendingReviews = 3 }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-wide">Main Dashboard Summary</h2>
      </div>
      <DashboardStats totalTasks={totalTasks} pendingReviews={pendingReviews} systemUptime="99.98%" />
      <DashboardWidgets />
    </section>
  );
};