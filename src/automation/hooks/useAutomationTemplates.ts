import { useState, useMemo } from 'react';
import { AutomationTemplate } from '../automation-types';
import { automationTemplateService } from '../services/automation-template-service';

export function useAutomationTemplates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => ['ALL', ...automationTemplateService.getCategories()], []);

  const templates: AutomationTemplate[] = useMemo(() => {
    return automationTemplateService.getTemplates(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  return {
    templates,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    instantiateTemplate: automationTemplateService.instantiateTemplate.bind(automationTemplateService),
  };
}
