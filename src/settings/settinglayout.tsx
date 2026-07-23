// frontend/src/settings/SettingsLayout.tsx
import React, { useState } from 'react';
import { ProfilePage } from './profile/profilepage';
import { AppearancePage } from './appearance/apperancepage';
import { NotificationsPage } from './notifications/notificationpage';
import { SecurityPage } from './security/securitypage';
import { PreferencesPage } from './preferences/preferencepage';
import { ConnectedAccountsPage } from './connected-accounts/connectedaccountpage';
import { BillingPage } from './billing/billingpage';

type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'security' | 'preferences' | 'connected' | 'billing';

export const SettingsLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'profile', label: 'Account Profile' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security Strategy' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'connected', label: 'Connected Providers' },
    { id: 'billing', label: 'Billing Parameters' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen bg-transparent p-1 sm:p-4 text-white overflow-x-hidden">
      {/* Settings Navigation Stack Panel */}
      <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-slate-800 lg:w-64 pb-2 lg:pb-0 lg:pr-4 space-x-4 lg:space-x-0 lg:space-y-1 scrollbar-none shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); }} className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition text-left w-full outline-none ${isActive ? 'bg-indigo-600/15 text-indigo-400 border-b-2 border-indigo-500 lg:border-b-0 lg:border-l-2 lg:border-indigo-500 lg:rounded-r-md lg:rounded-l-none' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Settings Execution Tab View Container viewport rendering zone */}
      <main className="flex-1 min-w-0 max-w-full overflow-x-hidden pt-2 lg:pt-0">
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'appearance' && <AppearancePage />}
        {activeTab === 'notifications' && <NotificationsPage />}
        {activeTab === 'security' && <SecurityPage />}
        {activeTab === 'preferences' && <PreferencesPage />}
        {activeTab === 'connected' && <ConnectedAccountsPage />}
        {activeTab === 'billing' && <BillingPage />}
      </main>
    </div>
  );
};

export default SettingsLayout;