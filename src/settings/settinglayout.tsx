import React, { useState } from 'react';
import { ProfilePage } from './profile/profilepage';
import { AppearancePage } from './appearance/apperancepage';
import { NotificationsPage } from './notifications/notificationpage';
import { SecurityPage } from './security/securitypage';
import { PreferencesPage } from './preferences/preferencepage';
import { ConnectedAccountsPage } from './connected-accounts/connectedaccountpage';
import { BillingPage } from './billing/billingpage';
import { ContactPage } from './contact/contactpage';
import {
  User,
  Palette,
  Bell,
  ShieldCheck,
  Sliders,
  Link2,
  CreditCard,
  HelpCircle,
} from 'lucide-react';

type SettingsTab =
  | 'profile'
  | 'notifications'
  | 'security'
  | 'connected'
  | 'appearance'
  | 'preferences'
  | 'billing'
  | 'contact';

export const SettingsLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs: { id: SettingsTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Auth', icon: ShieldCheck },
    { id: 'connected', label: 'Connected Accounts', icon: Link2 },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'contact', label: 'Contact & Support', icon: HelpCircle },
  ];

  return (
    <div className="flex min-h-screen flex-col gap-6 lg:flex-row">
      {/* Settings Navigation */}
      <nav className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-slate-200 pb-3 dark:border-slate-800 lg:w-64 lg:flex-col lg:overflow-x-visible lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main View Area */}
      <main className="min-w-0 max-w-full flex-1">
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'notifications' && <NotificationsPage />}
        {activeTab === 'security' && <SecurityPage />}
        {activeTab === 'connected' && <ConnectedAccountsPage />}
        {activeTab === 'appearance' && <AppearancePage />}
        {activeTab === 'preferences' && <PreferencesPage />}
        {activeTab === 'billing' && <BillingPage />}
        {activeTab === 'contact' && <ContactPage />}
      </main>
    </div>
  );
};

export default SettingsLayout;
