import { useAuthStore } from './authStore';
import { useAIStore } from './aiStore';
import { useProjectStore } from './projectStore';
import { useKnowledgeStore } from './knowledgeStore';
import { useWorkspaceStore } from './workspaceStore';
import { useAutomationStore } from './automationStore';
import { useNotificationStore } from './notificationStore';
import { useSettingsStore } from './settingsStore';

export const useStore = () => ({
  auth: useAuthStore(),
  ai: useAIStore(),
  project: useProjectStore(),
  knowledge: useKnowledgeStore(),
  workspace: useWorkspaceStore(),
  automation: useAutomationStore(),
  notification: useNotificationStore(),
  settings: useSettingsStore(),
});