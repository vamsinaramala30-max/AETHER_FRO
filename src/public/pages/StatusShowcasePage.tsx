import React, { useState } from 'react';
import {
  EmptyState,
  LoadingState,
  ErrorState,
  NoInternetState,
  SlowNetworkState,
  NoSearchFoundState,
  PermissionDeniedState,
  SessionExpiredState,
  FormValidationState,
  SuccessState,
} from '../../components/feedback/AppStates';

export const StatusShowcasePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('Quantum Neural Core');

  const states = [
    {
      id: 'empty',
      label: 'Empty State',
      component: <EmptyState onAction={() => alert('Action clicked!')} />,
    },
    { id: 'loading', label: 'Loading State', component: <LoadingState /> },
    {
      id: 'error',
      label: 'Error State',
      component: (
        <ErrorState
          errorDetails="ERR_CONNECTION_REFUSED at api.aether.ai/v1/stream"
          onAction={() => alert('Retrying...')}
        />
      ),
    },
    {
      id: 'no-internet',
      label: 'No Internet',
      component: <NoInternetState onAction={() => alert('Checking connection...')} />,
    },
    {
      id: 'slow-network',
      label: 'Slow Network',
      component: <SlowNetworkState onAction={() => window.location.reload()} />,
    },
    {
      id: 'no-search',
      label: 'No Search Found',
      component: (
        <NoSearchFoundState searchQuery={searchQuery} onAction={() => setSearchQuery('')} />
      ),
    },
    {
      id: 'permission',
      label: 'Permission Denied',
      component: <PermissionDeniedState onAction={() => alert('Access requested.')} />,
    },
    {
      id: 'session',
      label: 'Session Expired',
      component: <SessionExpiredState onAction={() => alert('Redirecting to login...')} />,
    },
    {
      id: 'form-validation',
      label: 'Form Validation',
      component: (
        <FormValidationState
          errors={[
            'Email address format is invalid.',
            'Password must contain at least 8 characters and one symbol.',
            'Organization domain mismatch.',
          ]}
        />
      ),
    },
    {
      id: 'success',
      label: 'Success State',
      component: <SuccessState onAction={() => alert('Proceeding...')} />,
    },
  ];

  const filteredStates = activeTab === 'all' ? states : states.filter((s) => s.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-950 px-4 pb-16 pt-24 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            System Design System
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Application State Showcase
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-400">
            Comprehensive production status UI states designed for resilient user experience across
            edge cases and network conditions.
          </p>
        </div>

        {/* State Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800 pb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            All States ({states.length})
          </button>
          {states.map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveTab(st.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === st.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredStates.map((st) => (
            <div key={st.id} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-indigo-400">
                  {st.label}
                </span>
                <span className="font-mono text-[10px] text-slate-500">State ID: #{st.id}</span>
              </div>
              {st.component}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
