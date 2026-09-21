import { describe, it, expect, beforeEach } from 'vitest';
import { ruleEngine } from '../RuleEngine';
import { parseNaturalLanguageInput } from '../nlParser';

describe('AETHER OS Rule Engine', () => {
  beforeEach(() => {
    // Reset simulated time
    ruleEngine.setSimulatedTime(8.5);
  });

  it('evaluates initial state cleanly with default rules', () => {
    const state = ruleEngine.getState();
    expect(state.simulatedTime).toBe(8.5);
    expect(ruleEngine.getRules().length).toBe(6);
  });

  it('parses natural language inputs into fixed blocks and tasks', () => {
    const today = new Date().toISOString().split('T')[0];
    const parsedFixed = parseNaturalLanguageInput('I have college 9 to 12 today', today);
    expect(parsedFixed.intentType).toBe('addFixedBlock');
    expect(parsedFixed.extracted.startHour).toBe(9);
    expect(parsedFixed.extracted.endHour).toBe(12);

    const parsedComplete = parseNaturalLanguageInput('I finished DBMS', today);
    expect(parsedComplete.intentType).toBe('completeTask');
    expect(parsedComplete.extracted.label).toBe('DBMS');
  });

  it('triggers 1-4-7 auto-chaining patches when completing Stage 1 task', () => {
    const stateBefore = ruleEngine.getState();
    const todayBlocks = stateBefore.daysSchedule[stateBefore.simulatedDate]?.blocks || [];
    const stage1Task = todayBlocks.find((b) => b.revision?.stage === 1);
    expect(stage1Task).toBeDefined();

    if (stage1Task) {
      ruleEngine.completeTaskWithConfidence(stage1Task.id, 5);
      const stateAfter = ruleEngine.getState();
      const auditLog = stateAfter.auditLogs;
      const chainingPatches = auditLog.filter((p) => p.ruleId === 'rule-147-chaining');
      expect(chainingPatches.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('dispatches natural language input patch and supports one-click Undo', () => {
    const today = new Date().toISOString().split('T')[0];
    ruleEngine.dispatchNaturalLanguageInput('I have college 9 to 12 today');

    const stateAfterNl = ruleEngine.getState();
    const nlPatch = stateAfterNl.auditLogs.find((p) => p.ruleId === 'rule-nl-intake');
    expect(nlPatch).toBeDefined();

    if (nlPatch) {
      const taskCountBeforeUndo = stateAfterNl.daysSchedule[today].blocks.length;
      ruleEngine.undoPatch(nlPatch.id);
      const stateAfterUndo = ruleEngine.getState();
      expect(stateAfterUndo.daysSchedule[today].blocks.length).toBe(taskCountBeforeUndo - 1);
    }
  });
});
