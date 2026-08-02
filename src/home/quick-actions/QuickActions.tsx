import React, { useEffect, useState } from 'react';
import { QuickActionItem, fetchQuickActions } from './quickActionsService';
import { ActionCard } from './ActionCard';

export const QuickActions: React.FC = () => {
  const [actions, setActions] = useState<QuickActionItem[]>([]);

  useEffect(() => {
    fetchQuickActions().then(setActions);
  }, []);

  const handleSelectAction = (action: QuickActionItem) => {
    if (action.targetUrl) {
      window.location.href = action.targetUrl;
    } else {
      alert(`Triggered quick action: ${action.label}`);
    }
  };

  return (
    <section className="space-y-3">
      <h3 className="text-base font-bold text-white">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((act) => (
          <ActionCard key={act.id} action={act} onSelect={handleSelectAction} />
        ))}
      </div>
    </section>
  );
};
