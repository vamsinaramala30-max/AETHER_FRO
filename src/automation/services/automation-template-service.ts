import { AUTOMATION_TEMPLATES } from '../automation-constants';
import { AutomationRule, AutomationTemplate, TemplateCategory } from '../automation-types';
import { automationService } from './automation-service';

export class AutomationTemplateService {
  public getTemplates(category?: string, query?: string): AutomationTemplate[] {
    let list = AUTOMATION_TEMPLATES;
    if (category && category !== 'ALL') {
      list = list.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }
    return list;
  }

  public getCategories(): TemplateCategory[] {
    return ['Productivity', 'Projects', 'Knowledge', 'AI'];
  }

  public async instantiateTemplate(template: AutomationTemplate): Promise<AutomationRule> {
    return automationService.createAutomation({
      name: template.preset.name,
      description: template.preset.description,
      trigger: template.preset.trigger,
      schedule: template.preset.schedule,
      steps: template.preset.steps,
      isEnabled: true,
    });
  }
}

export const automationTemplateService = new AutomationTemplateService();
