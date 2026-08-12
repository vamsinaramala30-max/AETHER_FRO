import React, { useState, useEffect } from 'react';
import { AutomationTemplate } from '../../automation-types';
import { AutomationDialog } from '../shared/AutomationDialog';
import { Button } from '@/components/ui/button';
import { Zap, Sparkles, CheckCircle2, Clock, ShieldCheck, Database, Target, ArrowRight } from 'lucide-react';
import { formatScheduleText } from '../../automation-utils';

interface Props {
  template: AutomationTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (configuredTemplate: AutomationTemplate) => void;
}

export const TemplateDetails: React.FC<Props> = ({ template, isOpen, onClose, onUseTemplate }) => {
  const [step, setStep] = useState<'configure' | 'preview'>('configure');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (template) {
      setName(template.preset.name || template.title);
      setDescription(template.preset.description || template.description);
      setStep('configure');
    }
  }, [template]);

  if (!template) return null;

  const handleNextToPreview = () => {
    setStep('preview');
  };

  const handleConfirmSave = () => {
    const configuredTemplate: AutomationTemplate = {
      ...template,
      preset: {
        ...template.preset,
        name,
        description,
      },
    };
    onUseTemplate(configuredTemplate);
    onClose();
  };

  return (
    <AutomationDialog
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'configure' ? `Configure: ${template.title}` : `Preview Workflow: ${name}`}
      description={
        step === 'configure'
          ? 'Customize rule parameters before generating your executable preview plan.'
          : 'Review the generated workflow action sequence before saving and activating.'
      }
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {step === 'configure' ? (
          <>
            <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  Trigger: {template.preset.trigger} {template.preset.schedule ? `(${formatScheduleText(template.preset.schedule)})` : ''}
                </span>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-amber-700 dark:text-amber-300 font-bold">
                  {template.category}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Automation Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
              Configured Execution Steps ({template.preset.steps.length}):
            </h4>
            <div className="space-y-2">
              {template.preset.steps.map((st, i) => (
                <div
                  key={st.id || i}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-bold text-amber-600 dark:text-amber-400">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{st.title}</p>
                    {st.subtitle && <p className="text-[11px] text-slate-500">{st.subtitle}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleNextToPreview} className="bg-amber-500 text-white hover:bg-amber-600">
                <span>Preview Workflow Plan</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3.5">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{name}</h4>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                    Trigger: {template.preset.trigger} {template.preset.schedule ? `(${formatScheduleText(template.preset.schedule)})` : ''}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Ready to Activate
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-2.5">
                  <p className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 text-[10px]">
                    <Database className="h-3 w-3 text-amber-500" />
                    Target Data
                  </p>
                  <p className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200 text-xs">AETHER Workspace Repository</p>
                </div>
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-2.5">
                  <p className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 text-[10px]">
                    <Target className="h-3 w-3 text-emerald-500" />
                    Expected Result
                  </p>
                  <p className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200 text-xs">Execute real backend action pipeline</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Executable Action Sequence:
                </p>
                {template.preset.steps.map((st, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{i + 1}. {st.title}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-amber-500/20 text-[11px] flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Enforces backend user ownership & security policies</span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setStep('configure')}>
                Back to Configure
              </Button>
              <Button onClick={handleConfirmSave} className="bg-amber-500 text-white hover:bg-amber-600">
                <Zap className="mr-1.5 h-4 w-4" />
                Save & Activate Automation
              </Button>
            </div>
          </>
        )}
      </div>
    </AutomationDialog>
  );
};
