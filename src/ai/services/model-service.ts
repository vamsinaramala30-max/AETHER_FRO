// ============================================================================
// AETHER AI — Model Service
// ============================================================================

import type { AIModelInfo, AIResult } from '../ai-types';
import { modelManager } from '../llm/model-manager';

/**
 * ModelService isolates all model backend operations from UI components.
 */
export class ModelService {
  async listModels(): Promise<AIResult<AIModelInfo[]>> {
    return modelManager.listModels();
  }

  async getModel(id: string): Promise<AIResult<AIModelInfo>> {
    return modelManager.getModel(id);
  }

  async loadModel(id: string): Promise<AIResult<AIModelInfo>> {
    return modelManager.loadModel(id);
  }

  async unloadModel(id: string): Promise<AIResult<void>> {
    return modelManager.unloadModel(id);
  }

  selectBestModel(models: AIModelInfo[]): AIModelInfo | null {
    return modelManager.selectActive(models);
  }
}

export const modelService = new ModelService();
