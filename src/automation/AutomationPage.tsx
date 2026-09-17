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
import {
  Sparkles,
  CheckCircle2,
  Zap,
  AlertCircle,
  ShieldCheck,
  Database,
  Target,
  Clock,
} from 'lucide-react';
import { automationService } from './services/automation-service';
import { automationApi } from './automation-api';
import { AUTOMATION_TEMPLATES } from './automation-constants';
import { formatScheduleText } from './automation-utils';

export const AutomationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AutomationTab>('overview');
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false);
  const [isQuickAiOpen, setIsQuickAiOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // AI Quick prompt state
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [unsupportedError, setUnsupportedError] = useState<string | null>(null);
  const [aiPreview, setAiPreview] = useState<{
    name: string;
    description: string;
    rawTrigger: string;
    schedule: string | null;
    scheduleText: string;
    rawConditions: any;
    rawActions: any[];
    targetData: string;
    expectedResult: string;
    requiredPermissions: string[];
    steps: string[];
  } | null>(null);

  const {
    automations,
    allAutomations,
    isLoading,
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

  const handleAnalyzePrompt = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiAnalyzing(true);
    setUnsupportedError(null);
    setAiPreview(null);

    try {
      const parsed = await automationApi.parseIntent(aiPrompt);

      if (parsed && parsed.supported) {
        setAiPreview({
          name: parsed.name || 'Custom Automation',
          description: parsed.description || aiPrompt,
          rawTrigger: parsed.trigger || 'MANUAL',
          schedule: parsed.schedule || null,
          scheduleText: parsed.schedule ? formatScheduleText(parsed.schedule) : 'Manual Trigger',
          rawConditions: parsed.conditions || null,
          rawActions: parsed.actions || [],
          targetData: parsed.targetData || 'Workspace Data',
          expectedResult: parsed.expectedResult || 'Execute automated action sequence',
          requiredPermissions: parsed.requiredPermissions || ['Read Workspace', 'Write Workspace'],
          steps: parsed.steps || [],
        });
      } else {
        setUnsupportedError(
          parsed?.unsupportedReason ||
            'This automation request is currently unsupported. AETHER Automation supports Tasks, Projects, Calendar, Files, Knowledge Base, Notifications, and Scheduled Digests.',
        );
      }
    } catch (err: any) {
      setUnsupportedError(err?.message || 'Failed to parse automation request.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSaveAiPreview = async () => {
    if (!aiPreview) return;
    try {
      await automationService.createAutomation({
        name: aiPreview.name,
        description: aiPreview.description,
        trigger: aiPreview.rawTrigger,
        schedule: aiPreview.schedule || undefined,
        conditions: aiPreview.rawConditions,
        steps: aiPreview.rawActions,
        isEnabled: true,
      });
      refreshAutomations();
      refreshActivity();
      setIsQuickAiOpen(false);
      setAiPrompt('');
      setAiPreview(null);
      setUnsupportedError(null);
      setActiveTab('overview');
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
            templates: AUTOMATION_TEMPLATES.length,
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
            setUnsupportedError(null);
          }}
          title="What would you like Aether to automate?"
          description="Describe your desired workflow in plain text. Aether AI will parse and construct a human-readable preview before activation."
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div>
              <textarea
                value={aiPrompt}
                onChange={(e) => {
                  setAiPrompt(e.target.value);
                  if (unsupportedError) setUnsupportedError(null);
                }}
                rows={3}
                placeholder="e.g. Complete all my tasks and make them done"
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

            {unsupportedError && (
              <div className="animate-in fade-in flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-700 duration-200 dark:text-rose-300">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                <div>
                  <h5 className="text-sm font-bold">Unsupported Automation Request</h5>
                  <p className="mt-1 leading-relaxed">{unsupportedError}</p>
                </div>
              </div>
            )}

            {aiPreview && (
              <div className="animate-in fade-in space-y-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 duration-200">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {aiPreview.name}
                    </h4>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      <Clock className="h-3.5 w-3.5" />
                      Trigger: {aiPreview.rawTrigger} ({aiPreview.scheduleText})
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                    Preview Plan Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200/80 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="flex items-center gap-1 font-bold uppercase tracking-wider text-slate-400">
                      <Database className="h-3.5 w-3.5 text-amber-500" />
                      Target Data
                    </p>
                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {aiPreview.targetData}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="flex items-center gap-1 font-bold uppercase tracking-wider text-slate-400">
                      <Target className="h-3.5 w-3.5 text-emerald-500" />
                      Expected Result
                    </p>
                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                      {aiPreview.expectedResult}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Workflow Actions Sequence:
                  </p>
                  {aiPreview.steps.map((st, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 rounded-lg border border-slate-200/50 bg-white/40 p-2 text-xs font-medium text-slate-700 dark:border-slate-800/50 dark:bg-slate-900/40 dark:text-slate-200"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span>
                        {i + 1}. {st}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 border-t border-amber-500/20 pt-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>Required Permissions: {aiPreview.requiredPermissions.join(', ')}</span>
                </div>

                <div className="flex justify-end gap-2.5 border-t border-amber-500/20 pt-3">
                  <Button
                    variant="outline"
                    onClick={() => setAiPreview(null)}
                    className="border-slate-300 dark:border-slate-700"
                  >
                    Adjust Request
                  </Button>
                  <Button
                    onClick={handleSaveAiPreview}
                    className="bg-amber-500 text-white hover:bg-amber-600"
                  >
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
