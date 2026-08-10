import React from 'react';
import { AutomationTemplate } from '../../automation-types';
import { TemplateCard } from './TemplateCard';
import { AutomationEmptyState } from '../shared/AutomationEmptyState';

interface Props {
  templates: AutomationTemplate[];
  onUseTemplate: (template: AutomationTemplate) => void;
  onViewDetails: (template: AutomationTemplate) => void;
}

export const TemplateGrid: React.FC<Props> = ({ templates, onUseTemplate, onViewDetails }) => {
  if (templates.length === 0) {
    return (
      <AutomationEmptyState
        title="No matching templates"
        description="Try adjusting your template category filter or search terms."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onUseTemplate={onUseTemplate}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
