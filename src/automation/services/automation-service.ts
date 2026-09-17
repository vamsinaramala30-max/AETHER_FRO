import { automationApi, CreateAutomationDTO, UpdateAutomationDTO } from '../automation-api';
import { AutomationRule } from '../automation-types';
import { triggerActivityUpdate } from '@/shared/activityEvents';

export class AutomationService {
  public async fetchAutomations(): Promise<AutomationRule[]> {
    return automationApi.getAutomations();
  }

  public async fetchAutomationById(id: string): Promise<AutomationRule | null> {
    return automationApi.getAutomationById(id);
  }

  public async createAutomation(dto: CreateAutomationDTO): Promise<AutomationRule> {
    const res = await automationApi.createAutomation(dto);
    triggerActivityUpdate();
    return res;
  }

  public async updateAutomation(id: string, dto: UpdateAutomationDTO): Promise<AutomationRule> {
    const res = await automationApi.updateAutomation(id, dto);
    triggerActivityUpdate();
    return res;
  }

  public async toggleAutomationStatus(id: string, currentStatus: string): Promise<AutomationRule> {
    const isEnabled = currentStatus !== 'active';
    const res = await automationApi.updateAutomation(id, {
      isEnabled,
      status: isEnabled ? 'active' : 'paused',
    });
    triggerActivityUpdate();
    return res;
  }

  public async deleteAutomation(id: string): Promise<boolean> {
    const res = await automationApi.deleteAutomation(id);
    triggerActivityUpdate();
    return res;
  }

  public async duplicateAutomation(rule: AutomationRule): Promise<AutomationRule> {
    return this.createAutomation({
      name: `${rule.name} (Copy)`,
      description: rule.description,
      trigger: rule.trigger,
      schedule: rule.schedule,
      steps: rule.steps,
      isEnabled: true,
    });
  }
}

export const automationService = new AutomationService();
