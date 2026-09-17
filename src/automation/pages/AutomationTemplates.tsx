import React, { useState } from 'react';
import { AutomationTemplate } from '../automation-types';
import { useAutomationTemplates } from '../hooks/useAutomationTemplates';
import { TemplateGrid } from '../components/templates/TemplateGrid';
import { TemplateCategories } from '../components/templates/TemplateCategories';
import { TemplateSearch } from '../components/templates/TemplateSearch';
import { TemplateDetails } from '../components/templates/TemplateDetails';

interface Props {
  onTemplateInstantiated?: () => void;
}

export const AutomationTemplates: React.FC<Props> = ({ onTemplateInstantiated }) => {
  const {
    templates,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    instantiateTemplate,
  } = useAutomationTemplates();

  const [activePreview, setActivePreview] = useState<AutomationTemplate | null>(null);

  const handleUseTemplate = async (template: AutomationTemplate) => {
    try {
      await instantiateTemplate(template);
      if (onTemplateInstantiated) onTemplateInstantiated();
    } catch (err) {
      console.error('Failed to use template', err);
    }
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TemplateSearch value={searchQuery} onChange={setSearchQuery} />
        <TemplateCategories
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <TemplateGrid
        templates={templates}
        onUseTemplate={handleUseTemplate}
        onViewDetails={setActivePreview}
      />

      <TemplateDetails
        template={activePreview}
        isOpen={Boolean(activePreview)}
        onClose={() => setActivePreview(null)}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
};
