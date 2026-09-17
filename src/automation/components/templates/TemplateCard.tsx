import React from 'react';
import { Calendar, Sparkles, Clock, Folder, BookOpen, Bot } from 'lucide-react';
import { AutomationTemplate } from '../../automation-types';
import { Button } from '@/components/ui/button';

interface Props {
  template: AutomationTemplate;
  onUseTemplate: (template: AutomationTemplate) => void;
  onViewDetails: (template: AutomationTemplate) => void;
}

export const TemplateCard: React.FC<Props> = ({ template, onUseTemplate, onViewDetails }) => {
  const getIcon = () => {
    switch (template.iconName) {
      case 'Calendar':
        return Calendar;
      case 'Sparkles':
        return Sparkles;
      case 'Clock':
        return Clock;
      case 'Folder':
        return Folder;
      case 'BookOpen':
        return BookOpen;
      case 'Bot':
        return Bot;
      default:
        return Sparkles;
    }
  };

  const Icon = getIcon();

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-amber-500/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <Icon className="h-5 w-5" />
          </div>
          {template.badge && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {template.badge}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
          {template.title}
        </h3>
        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {template.description}
        </p>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Saves {template.estimatedTimeSaved}</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            {template.popularity}% match
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(template)}
            className="flex-1 text-xs"
          >
            Preview
          </Button>
          <Button
            size="sm"
            onClick={() => onUseTemplate(template)}
            className="flex-1 bg-amber-500 text-xs text-white hover:bg-amber-600"
          >
            Use Template
          </Button>
        </div>
      </div>
    </div>
  );
};
