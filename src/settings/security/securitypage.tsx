import React from 'react';
import { SecuritySettings } from './securitysetting';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ShieldCheck } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
          <ShieldCheck className="h-7 w-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Security & Authentication
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure passkeys, authentication credentials, and security rules.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SecuritySettings />
        </div>
      </div>
    </PageWrapper>
  );
};
