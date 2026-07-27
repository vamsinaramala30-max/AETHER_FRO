// frontend/src/settings/SettingsLayout.tsx
import React, { useState } from 'react';
import { ProfilePage } from './profile/profilepage';
import { AppearancePage } from './appearance/apperancepage';
import { NotificationsPage } from './notifications/notificationpage';
import { SecurityPage } from './security/securitypage';
import { PreferencesPage } from './preferences/preferencepage';
import { ConnectedAccountsPage } from './connected-accounts/connectedaccountpage';
import { BillingPage } from './billing/billingpage';

type SettingsTab =
  'profile' | 'appearance' | 'notifications' | 'security' | 'preferences' | 'connected' | 'billing';

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
    <div className="flex min-h-screen flex-col gap-8 overflow-x-hidden bg-transparent p-1 text-white sm:p-4 lg:flex-row">
      {/* Settings Navigation Stack Panel */}
      <nav className="scrollbar-none flex shrink-0 space-x-4 overflow-x-auto border-b border-slate-800 pb-2 lg:w-64 lg:flex-col lg:space-x-0 lg:space-y-1 lg:overflow-x-visible lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className={`w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-medium outline-none transition ${isActive ? 'border-b-2 border-indigo-500 bg-indigo-600/15 text-indigo-400 lg:rounded-l-none lg:rounded-r-md lg:border-b-0 lg:border-l-2 lg:border-indigo-500' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Settings Execution Tab View Container viewport rendering zone */}
      <main className="min-w-0 max-w-full flex-1 overflow-x-hidden pt-2 lg:pt-0">
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
