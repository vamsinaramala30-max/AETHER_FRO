import React, { useState } from 'react';
import { Star, ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';
import { AutomationDialog } from './shared/AutomationDialog';
import { Button } from '@/components/ui/button';
import { ruleEngine } from '../engine/RuleEngine';
import { TaskBlock } from '../engine/types';

interface Props {
  task: TaskBlock | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ConfidenceModal: React.FC<Props> = ({ task, isOpen, onClose }) => {
  const [confidence, setConfidence] = useState<number>(3);

  if (!task) return null;

  const handleConfirm = () => {
    ruleEngine.completeTaskWithConfidence(task.id, confidence);
    onClose();
  };

  const getLabel = (score: number) => {
    switch (score) {
      case 1:
        return '1 - Struggling / Extremely Low (Triggers 🔴 Critical Weak Topic)';
      case 2:
        return '2 - Low Confidence (Triggers Extra 45m Revision within 48h)';
      case 3:
        return '3 - Moderate / Normal Retention';
      case 4:
        return '4 - Confident';
      case 5:
        return '5 - Mastered Topic';
      default:
        return '';
    }
  };

  return (
    <AutomationDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Task Completion Confidence Check"
      description={`How confident do you feel after completing "${task.label}"?`}
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject</p>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{task.subject || 'General Study'}</p>
        </div>

        {/* 1-5 Rating Selector */}
        <div className="space-y-2 text-center">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Rate your mastery (1 to 5):</p>
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => setConfidence(score)}
                className={`flex h-12 w-12 items-center justify-center rounded-xl font-black text-lg transition-all ${
                  confidence === score
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-110'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {score}
              </button>
            ))}
          </div>

          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 pt-2">{getLabel(confidence)}</p>
        </div>

        {confidence <= 2 && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
            <span>
              Rule Engine will generate non-mutating state patch to schedule an extra 45m reinforcement session!
            </span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="border-slate-300 dark:border-slate-700">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-amber-500 text-white hover:bg-amber-600 font-bold">
            <CheckCircle2 className="mr-1.5 h-4 w-4" /> Save Mastery & Complete
          </Button>
        </div>
      </div>
    </AutomationDialog>
  );
};
