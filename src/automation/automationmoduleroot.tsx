// frontend/src/automation/AutomationModuleRoot.tsx
import React, { useState } from 'react';
import { WorkflowCenterPage } from './workflow-center/workflowcenterpage';
import { IntegrationsPage } from './integrations/integrationpage';
import { ScheduledAutomationPage } from './scheduled-automation/scheduleautomationpage';
import { FutureAIFeaturesPage } from './future-ai-features/futureAIfeaturespage';

type AutomationTab = 'workflows' | 'integrations' | 'scheduler' | 'labs';

export const AutomationModuleRoot: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AutomationTab>('workflows');

  const tabs: { id: AutomationTab; label: string }[] = [
    { id: 'workflows', label: 'Workflow Matrix' },
    { id: 'integrations', label: 'Integration Links' },
    { id: 'scheduler', label: 'Daemon Scheduler' },
    { id: 'labs', label: 'Next-Gen Labs (Preview)' },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 text-slate-200 md:p-6">
      <div className="border-b border-slate-800">
        <nav
          className="scrollbar-none flex space-x-6 overflow-x-auto"
          aria-label="Automation Engine Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className={`whitespace-nowrap border-b-2 pb-3 text-xs font-semibold uppercase tracking-wider transition-all focus:outline-none ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="transition-opacity duration-150 ease-in-out">
        {activeTab === 'workflows' && <WorkflowCenterPage />}
        {activeTab === 'integrations' && <IntegrationsPage />}
        {activeTab === 'scheduler' && <ScheduledAutomationPage />}
        {activeTab === 'labs' && <FutureAIFeaturesPage />}
      </div>
    </div>
  );
};

export default AutomationModuleRoot;
