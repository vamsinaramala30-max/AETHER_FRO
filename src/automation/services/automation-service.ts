import { automationApi, CreateAutomationDTO, UpdateAutomationDTO } from '../automation-api';
import { AutomationRule } from '../automation-types';

export class AutomationService {
  public async fetchAutomations(): Promise<AutomationRule[]> {
    return automationApi.getAutomations();
  }

  public async fetchAutomationById(id: string): Promise<AutomationRule | null> {
    return automationApi.getAutomationById(id);
  }

  public async createAutomation(dto: CreateAutomationDTO): Promise<AutomationRule> {
    return automationApi.createAutomation(dto);
  }

  public async updateAutomation(id: string, dto: UpdateAutomationDTO): Promise<AutomationRule> {
    return automationApi.updateAutomation(id, dto);
  }

  public async toggleAutomationStatus(id: string, currentStatus: string): Promise<AutomationRule> {
    const isEnabled = currentStatus !== 'active';
    return automationApi.updateAutomation(id, { isEnabled, status: isEnabled ? 'active' : 'paused' });
  }

  public async deleteAutomation(id: string): Promise<boolean> {
    return automationApi.deleteAutomation(id);
  }

  public async duplicateAutomation(rule: AutomationRule): Promise<AutomationRule> {
    return automationApi.createAutomation({
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
