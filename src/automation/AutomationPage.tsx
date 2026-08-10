import React, { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useAutomations } from './hooks/useAutomations';
import { useAutomationActivity } from './hooks/useAutomationActivity';
import { useAutomationActions } from './hooks/useAutomationActions';
import { AutomationTab, AutomationNavigation } from './components/AutomationNavigation';
import { AutomationHeader } from './components/AutomationHeader';
import { AutomationOverview } from './pages/AutomationOverview';
import { MyAutomations } from './pages/MyAutomations';
import { AutomationTemplates } from './pages/AutomationTemplates';
import { AutomationActivity } from './pages/AutomationActivity';
import { AutomationBuilder } from './components/builder/AutomationBuilder';
import { AutomationDialog } from './components/shared/AutomationDialog';
import { ConfirmAutomationAction } from './components/shared/ConfirmAutomationAction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { automationService } from './services/automation-service';

export const AutomationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AutomationTab>('overview');
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false);
  const [isQuickAiOpen, setIsQuickAiOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // AI Quick prompt state
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiPreview, setAiPreview] = useState<{
    name: string;
    schedule: string;
    steps: string[];
    rawTrigger: string;
  } | null>(null);

  const {
    automations,
    allAutomations,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshAutomations,
  } = useAutomations();

  const { logs, refreshActivity } = useAutomationActivity();

  const { toggleStatus, runNow, duplicate, remove } = useAutomationActions(() => {
    refreshAutomations();
    refreshActivity();
  });

  const handleAnalyzePrompt = () => {
    if (!aiPrompt.trim()) return;
    setIsAiAnalyzing(true);

    setTimeout(() => {
      setAiPreview({
        name: 'Daily Planning Briefing',
        schedule: 'Every weekday at 8:00 AM',
        rawTrigger: 'SCHEDULE',
        steps: [
          'Check workspace calendar for upcoming meetings',
          'Review pending tasks and deadlines',
          'Analyze top 3 daily priorities',
          'Synthesize daily action plan',
          'Send workspace notification digest',
        ],
      });
      setIsAiAnalyzing(false);
    }, 600);
  };

  const handleSaveAiPreview = async () => {
    if (!aiPreview) return;
    try {
      await automationService.createAutomation({
        name: aiPreview.name,
        description: aiPrompt,
        trigger: aiPreview.rawTrigger,
        schedule: '0 8 * * 1-5',
        isEnabled: true,
      });
      refreshAutomations();
      setIsQuickAiOpen(false);
      setAiPrompt('');
      setAiPreview(null);
      setActiveTab('automations');
    } catch (err) {
      console.error('Failed to save AI automation', err);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6 pb-12">
        <AutomationHeader
          onOpenQuickAi={() => setIsQuickAiOpen(true)}
          onOpenBuilder={() => setIsBuilderOpen(true)}
        />

        <AutomationNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            automations: allAutomations.length,
            templates: 6,
            activity: logs.length,
          }}
        />

        {activeTab === 'overview' && (
          <AutomationOverview
            automations={allAutomations}
            logs={logs}
            onToggleStatus={toggleStatus}
            onRunNow={runNow}
            onNavigateToTab={setActiveTab}
            onOpenQuickAi={() => setIsQuickAiOpen(true)}
            onOpenBuilder={() => setIsBuilderOpen(true)}
          />
        )}

        {activeTab === 'automations' && (
          <MyAutomations
            automations={automations}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onToggleStatus={toggleStatus}
            onRunNow={runNow}
            onDuplicate={duplicate}
            onViewActivity={() => setActiveTab('activity')}
            onDelete={(id) => setDeleteId(id)}
            onOpenCreate={() => setIsQuickAiOpen(true)}
          />
        )}

        {activeTab === 'templates' && (
          <AutomationTemplates
            onTemplateInstantiated={() => {
              refreshAutomations();
              setActiveTab('automations');
            }}
          />
        )}

        {activeTab === 'activity' && <AutomationActivity />}

        {/* AI Quick Creator Dialog */}
        <AutomationDialog
          isOpen={isQuickAiOpen}
          onClose={() => {
            setIsQuickAiOpen(false);
            setAiPrompt('');
            setAiPreview(null);
          }}
          title="What would you like Aether to automate?"
          description="Describe your desired workflow in plain text. Aether AI will parse and construct a human-readable preview before activation."
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
                placeholder="e.g. Every weekday morning, review my calendar and tasks and prepare my daily plan."
                className="w-full rounded-xl border border-slate-200 p-3.5 text-sm font-medium text-slate-800 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              />
              <div className="mt-2 flex justify-end">
                <Button
                  onClick={handleAnalyzePrompt}
                  disabled={isAiAnalyzing || !aiPrompt.trim()}
                  className="bg-amber-500 text-white hover:bg-amber-600"
                >
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  {isAiAnalyzing ? 'Analyzing Request...' : 'Generate Automation Preview'}
                </Button>
              </div>
            </div>

            {aiPreview && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {aiPreview.name}
                    </h4>
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {aiPreview.schedule}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                    Preview Ready
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Aether Execution Steps:
                  </p>
                  {aiPreview.steps.map((st, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-end gap-2.5 border-t border-amber-500/20 pt-3">
                  <Button
                    variant="outline"
                    onClick={() => setAiPreview(null)}
                    className="border-slate-300 dark:border-slate-700"
                  >
                    Adjust Request
                  </Button>
                  <Button onClick={handleSaveAiPreview} className="bg-amber-500 text-white hover:bg-amber-600">
                    <Zap className="mr-1.5 h-4 w-4" />
                    Save & Activate Automation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </AutomationDialog>

        {/* Advanced Workflow Builder */}
        <AutomationBuilder
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          onSaved={() => {
            refreshAutomations();
            setActiveTab('automations');
          }}
        />

        {/* Delete Confirmation */}
        <ConfirmAutomationAction
          isOpen={Boolean(deleteId)}
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            if (deleteId) remove(deleteId);
          }}
          title="Delete Automation"
          description="Are you sure you want to permanently delete this automation rule? This action cannot be undone."
          confirmLabel="Delete Permanently"
          isDestructive={true}
        />
      </div>
    </PageWrapper>
  );
};
