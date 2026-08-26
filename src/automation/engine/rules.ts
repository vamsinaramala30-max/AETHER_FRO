import { Rule, ApplicationState, EngineEvent, Patch, TaskBlock } from './types';

/**
 * Helper to calculate helper dates in YYYY-MM-DD format
 */
function getOffsetDateKey(currentDateStr: string, offsetDays: number): string {
  const date = new Date(currentDateStr);
  if (isNaN(date.getTime())) {
    const today = new Date();
    today.setDate(today.getDate() + offsetDays);
    return today.toISOString().split('T')[0];
  }
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
}

/**
 * Helper to find the first open schedule slot (duration in minutes) between 08:00 and 22:00
 */
function findNextFreeSlot(
  blocks: TaskBlock[],
  sleepStart: number = 23,
  sleepEnd: number = 7,
  durationMinutes: number = 45,
  afterHour: number = 8
): { start: number; duration: number } | null {
  const durationDecHours = durationMinutes / 60;
  const dayStart = Math.max(sleepEnd, afterHour);
  const dayEnd = sleepStart;

  // Sort existing blocks by start time
  const sorted = [...blocks].sort((a, b) => a.start - b.start);

  let currentPointer = dayStart;

  for (const block of sorted) {
    const blockEnd = block.start + block.duration / 60;
    // Check if space between currentPointer and block.start is enough
    if (block.start - currentPointer >= durationDecHours) {
      if (currentPointer + durationDecHours <= dayEnd) {
        return { start: currentPointer, duration: durationMinutes };
      }
    }
    currentPointer = Math.max(currentPointer, blockEnd);
  }

  // Check space after last block
  if (dayEnd - currentPointer >= durationDecHours) {
    return { start: currentPointer, duration: durationMinutes };
  }

  return null;
}

/**
 * 1. 1-4-7 Auto-Chaining Spaced Repetition Rule
 */
export const autoChainingRule: Rule = {
  id: 'rule-147-chaining',
  name: '1-4-7 Spaced Repetition Auto-Chaining',
  description: 'Completing Stage 1 auto-schedules Day 4 & Day 7 revision. Completing Stage 4 auto-ensures Day 7 exists.',
  category: 'Spaced Repetition',
  trigger: 'task.completed',
  isEnabled: true,
  runCount: 0,
  condition: (event: EngineEvent) => {
    const task = event.payload.task as TaskBlock | undefined;
    return Boolean(task && task.completed && task.revision && (task.revision.stage === 1 || task.revision.stage === 4));
  },
  action: (event: EngineEvent, state: ApplicationState): Patch[] => {
    const task = event.payload.task as TaskBlock;
    const patches: Patch[] = [];
    const currentDate = state.simulatedDate;

    if (task.revision?.stage === 1) {
      const day4Date = getOffsetDateKey(currentDate, 3); // +3 days = Day 4
      const day7Date = getOffsetDateKey(currentDate, 6); // +6 days = Day 7

      const day4Schedule = state.daysSchedule[day4Date]?.blocks || [];
      const day7Schedule = state.daysSchedule[day7Date]?.blocks || [];

      const day4Slot = findNextFreeSlot(day4Schedule, 23, 7, task.duration || 45, 9);
      const day7Slot = findNextFreeSlot(day7Schedule, 23, 7, task.duration || 45, 10);

      patches.push({
        id: `patch-147-d4-${Date.now()}`,
        ruleId: 'rule-147-chaining',
        ruleName: '1-4-7 Spaced Repetition Auto-Chaining',
        type: 'CREATE_TASK',
        dateKey: day4Date,
        description: `Auto-scheduled Day 4 revision for "${task.label}"`,
        reason: `Completed Stage 1 task "${task.label}". Spaced repetition triggers Stage 4 schedule.`,
        timestamp: new Date().toISOString(),
        status: 'applied',
        payload: {
          id: `task-d4-${Date.now()}`,
          label: `${task.label} (Day 4 Revision)`,
          start: day4Slot ? day4Slot.start : 14,
          duration: task.duration || 45,
          bucket: 'study',
          kind: 'flexible',
          subject: task.subject,
          priority: task.priority || 'P1',
          energy: task.energy || 'high',
          revision: { stage: 4 },
          groupId: task.groupId || `group-${task.id}`,
          completed: false,
        },
      });

      patches.push({
        id: `patch-147-d7-${Date.now()}`,
        ruleId: 'rule-147-chaining',
        ruleName: '1-4-7 Spaced Repetition Auto-Chaining',
        type: 'CREATE_TASK',
        dateKey: day7Date,
        description: `Auto-scheduled Day 7 revision for "${task.label}"`,
        reason: `Completed Stage 1 task "${task.label}". Spaced repetition triggers Stage 7 schedule.`,
        timestamp: new Date().toISOString(),
        status: 'applied',
        payload: {
          id: `task-d7-${Date.now()}`,
          label: `${task.label} (Day 7 Master Revision)`,
          start: day7Slot ? day7Slot.start : 16,
          duration: task.duration || 45,
          bucket: 'study',
          kind: 'flexible',
          subject: task.subject,
          priority: task.priority || 'P1',
          energy: task.energy || 'medium',
          revision: { stage: 7 },
          groupId: task.groupId || `group-${task.id}`,
          completed: false,
        },
      });
    } else if (task.revision?.stage === 4) {
      const day7Date = getOffsetDateKey(currentDate, 3); // +3 days from stage 4 = Day 7
      const day7Schedule = state.daysSchedule[day7Date]?.blocks || [];

      // Check if Day 7 already exists in group
      const exists = day7Schedule.some((b) => b.groupId === task.groupId && b.revision?.stage === 7);
      if (!exists) {
        const day7Slot = findNextFreeSlot(day7Schedule, 23, 7, task.duration || 45, 15);
        patches.push({
          id: `patch-147-d7-stage4-${Date.now()}`,
          ruleId: 'rule-147-chaining',
          ruleName: '1-4-7 Spaced Repetition Auto-Chaining',
          type: 'CREATE_TASK',
          dateKey: day7Date,
          description: `Auto-ensured Day 7 master revision for "${task.label}"`,
          reason: `Completed Stage 4 revision for "${task.label}". Ensured final Stage 7 revision block.`,
          timestamp: new Date().toISOString(),
          status: 'applied',
          payload: {
            id: `task-d7-st4-${Date.now()}`,
            label: `${task.label} (Day 7 Final Review)`,
            start: day7Slot ? day7Slot.start : 17,
            duration: task.duration || 45,
            bucket: 'study',
            kind: 'flexible',
            subject: task.subject,
            priority: task.priority || 'P1',
            energy: task.energy || 'medium',
            revision: { stage: 7 },
            groupId: task.groupId || `group-${task.id}`,
            completed: false,
          },
        });
      }
    }

    return patches;
  },
};

/**
 * 2. Missed-Session Detector + Rebuild Proposal Rule
 */
export const missedSessionRebuildRule: Rule = {
  id: 'rule-missed-rebuild',
  name: 'Missed-Session Detector + Smart Rebuild Proposal',
  description: 'Detects incomplete sessions past simulated end time and creates a rebuild proposal card with Accept/Undo options.',
  category: 'Schedule Rebuild',
  trigger: 'time.tick',
  isEnabled: true,
  runCount: 0,
  condition: (_event: EngineEvent, state: ApplicationState) => {
    const todayBlocks = state.daysSchedule[state.simulatedDate]?.blocks || [];
    const simTime = state.simulatedTime;

    return todayBlocks.some((b) => {
      const blockEndTime = b.start + b.duration / 60;
      return simTime > blockEndTime + 0.05 && !b.completed && !b.missed;
    });
  },
  action: (_event: EngineEvent, state: ApplicationState): Patch[] => {
    const todayBlocks = state.daysSchedule[state.simulatedDate]?.blocks || [];
    const simTime = state.simulatedTime;
    const patches: Patch[] = [];

    const missedBlocks = todayBlocks.filter((b) => {
      const blockEndTime = b.start + b.duration / 60;
      return simTime > blockEndTime + 0.05 && !b.completed && !b.missed;
    });

    for (const block of missedBlocks) {
      // Find next free slot today after current simulated time
      const openSlot = findNextFreeSlot(todayBlocks, 23, 7, block.duration, Math.ceil(simTime));

      const rescheduledStart = openSlot ? openSlot.start : Math.min(21, Math.ceil(simTime) + 0.5);

      patches.push({
        id: `patch-missed-${block.id}-${Date.now()}`,
        ruleId: 'rule-missed-rebuild',
        ruleName: 'Missed-Session Detector + Smart Rebuild Proposal',
        type: 'REBUILD_SCHEDULE',
        targetId: block.id,
        dateKey: state.simulatedDate,
        description: `Proposed rescheduling missed session "${block.label}" to ${Math.floor(rescheduledStart)}:${Math.round((rescheduledStart % 1) * 60).toString().padStart(2, '0')}`,
        reason: `Session end time (${Math.floor(block.start + block.duration / 60)}:${Math.round(((block.start + block.duration / 60) % 1) * 60).toString().padStart(2, '0')}) passed without completion.`,
        timestamp: new Date().toISOString(),
        status: 'pending',
        requiresAcceptance: true,
        payload: {
          originalBlockId: block.id,
          newStart: rescheduledStart,
          updatedBlock: {
            ...block,
            start: rescheduledStart,
            missed: false,
          },
        },
        undoPayload: {
          originalBlockId: block.id,
          originalStart: block.start,
        },
      });
    }

    return patches;
  },
};

/**
 * 3. In-Tab Reminder Escalation Rule (T-15m, T-0m, T+20m)
 */
export const inTabReminderRule: Rule = {
  id: 'rule-intab-reminders',
  name: 'In-Tab Reminder Escalation (T-15m, T-0m, T+20m)',
  description: 'Triggers active in-tab toasts and notification pings as tasks approach start, trigger start, or drift 20m overdue.',
  category: 'Reminders',
  trigger: 'time.tick',
  isEnabled: true,
  runCount: 0,
  condition: (_event: EngineEvent, state: ApplicationState) => {
    const todayBlocks = state.daysSchedule[state.simulatedDate]?.blocks || [];
    const simTime = state.simulatedTime;
    const existingLogs = state.reminderLogs;

    return todayBlocks.some((b) => {
      if (b.completed) return false;
      const startDec = b.start;
      const startInMinutes = startDec * 60;
      const currentInMinutes = simTime * 60;
      const diffMinutes = startInMinutes - currentInMinutes;

      // Check T-15m (diff between 10 and 16 mins)
      const needsT15 = diffMinutes >= 10 && diffMinutes <= 16 && !existingLogs.some((l) => l.taskId === b.id && l.type === 'T-15m');
      // Check T-0m (diff between -2 and 4 mins)
      const needsT0 = diffMinutes >= -2 && diffMinutes <= 4 && !existingLogs.some((l) => l.taskId === b.id && l.type === 'T-0m');
      // Check T+20m (diff between -25 and -18 mins)
      const needsT20 = diffMinutes <= -18 && diffMinutes >= -25 && !existingLogs.some((l) => l.taskId === b.id && l.type === 'T+20m');

      return needsT15 || needsT0 || needsT20;
    });
  },
  action: (_event: EngineEvent, state: ApplicationState): Patch[] => {
    const todayBlocks = state.daysSchedule[state.simulatedDate]?.blocks || [];
    const simTime = state.simulatedTime;
    const existingLogs = state.reminderLogs;
    const patches: Patch[] = [];

    const simTimeFormatted = `${Math.floor(simTime).toString().padStart(2, '0')}:${Math.round((simTime % 1) * 60).toString().padStart(2, '0')}`;

    for (const b of todayBlocks) {
      if (b.completed) continue;
      const startInMinutes = b.start * 60;
      const currentInMinutes = simTime * 60;
      const diffMinutes = startInMinutes - currentInMinutes;

      // T-15m
      if (diffMinutes >= 10 && diffMinutes <= 16 && !existingLogs.some((l) => l.taskId === b.id && l.type === 'T-15m')) {
        patches.push({
          id: `patch-ping-t15-${b.id}-${Date.now()}`,
          ruleId: 'rule-intab-reminders',
          ruleName: 'In-Tab Reminder Escalation',
          type: 'ADD_NOTIFICATION',
          targetId: b.id,
          description: `Reminder: "${b.label}" starts in 15 minutes`,
          reason: `Task scheduled at ${Math.floor(b.start)}:${Math.round((b.start % 1) * 60).toString().padStart(2, '0')}`,
          timestamp: new Date().toISOString(),
          status: 'applied',
          payload: {
            id: `ping-t15-${b.id}-${Date.now()}`,
            taskId: b.id,
            taskLabel: b.label,
            type: 'T-15m',
            message: `⏰ Upcoming Task: "${b.label}" starting in 15 minutes!`,
            timestamp: new Date().toISOString(),
            simulatedTime: simTimeFormatted,
            read: false,
          },
        });
      }

      // T-0m
      if (diffMinutes >= -2 && diffMinutes <= 4 && !existingLogs.some((l) => l.taskId === b.id && l.type === 'T-0m')) {
        patches.push({
          id: `patch-ping-t0-${b.id}-${Date.now()}`,
          ruleId: 'rule-intab-reminders',
          ruleName: 'In-Tab Reminder Escalation',
          type: 'ADD_NOTIFICATION',
          targetId: b.id,
          description: `Starting Now: "${b.label}"`,
          reason: `Task start time reached`,
          timestamp: new Date().toISOString(),
          status: 'applied',
          payload: {
            id: `ping-t0-${b.id}-${Date.now()}`,
            taskId: b.id,
            taskLabel: b.label,
            type: 'T-0m',
            message: `🚀 Task Starting: "${b.label}" is scheduled right now!`,
            timestamp: new Date().toISOString(),
            simulatedTime: simTimeFormatted,
            read: false,
          },
        });
      }

      // T+20m
      if (diffMinutes <= -18 && diffMinutes >= -25 && !existingLogs.some((l) => l.taskId === b.id && l.type === 'T+20m')) {
        patches.push({
          id: `patch-ping-t20-${b.id}-${Date.now()}`,
          ruleId: 'rule-intab-reminders',
          ruleName: 'In-Tab Reminder Escalation',
          type: 'ADD_NOTIFICATION',
          targetId: b.id,
          description: `Overdue Escalation: "${b.label}" is 20m overdue`,
          reason: `Session not marked completed after 20 minutes`,
          timestamp: new Date().toISOString(),
          status: 'applied',
          payload: {
            id: `ping-t20-${b.id}-${Date.now()}`,
            taskId: b.id,
            taskLabel: b.label,
            type: 'T+20m',
            message: `⚠️ Overdue Ping: "${b.label}" started 20 minutes ago. Still in progress?`,
            timestamp: new Date().toISOString(),
            simulatedTime: simTimeFormatted,
            read: false,
          },
        });
      }
    }

    return patches;
  },
};

/**
 * 4. Morning / Evening / Night Daily Briefs Rule
 */
export const dailyBriefsRule: Rule = {
  id: 'rule-daily-briefs',
  name: 'Morning / Evening / Night Briefing Cards',
  description: 'Generates structured summary cards at 07:00 (Morning balance), 21:00 (Evening review), and 23:00 (Tomorrow preview).',
  category: 'Daily Briefs',
  trigger: 'time.tick',
  isEnabled: true,
  runCount: 0,
  condition: (_event: EngineEvent, state: ApplicationState) => {
    const simTime = state.simulatedTime;
    const currentDateKey = state.simulatedDate;
    const existingBriefs = state.activeBriefs.filter((b) => b.dateKey === currentDateKey);

    const hasMorning = existingBriefs.some((b) => b.type === 'morning');
    const hasEvening = existingBriefs.some((b) => b.type === 'evening');
    const hasNight = existingBriefs.some((b) => b.type === 'night');

    const isMorningTime = simTime >= 7.0 && simTime < 7.5 && !hasMorning;
    const isEveningTime = simTime >= 21.0 && simTime < 21.5 && !hasEvening;
    const isNightTime = simTime >= 23.0 && simTime < 23.5 && !hasNight;

    return isMorningTime || isEveningTime || isNightTime;
  },
  action: (_event: EngineEvent, state: ApplicationState): Patch[] => {
    const simTime = state.simulatedTime;
    const dateKey = state.simulatedDate;
    const todaySchedule = state.daysSchedule[dateKey] || { blocks: [], sleepStart: 23, sleepEnd: 7 };
    const blocks = todaySchedule.blocks;
    const patches: Patch[] = [];

    const completed = blocks.filter((b) => b.completed).length;
    const pending = blocks.filter((b) => !b.completed).length;
    const studyHours = blocks.reduce((acc, b) => acc + (b.bucket === 'study' ? b.duration / 60 : 0), 0);

    // Morning Brief (07:00)
    if (simTime >= 7.0 && simTime < 7.5 && !state.activeBriefs.some((b) => b.dateKey === dateKey && b.type === 'morning')) {
      patches.push({
        id: `patch-brief-morning-${dateKey}-${Date.now()}`,
        ruleId: 'rule-daily-briefs',
        ruleName: 'Morning / Evening / Night Daily Briefs',
        type: 'CREATE_BRIEF',
        dateKey,
        description: 'Generated Morning Kickoff Brief',
        reason: '7:00 AM simulated morning trigger reached',
        timestamp: new Date().toISOString(),
        status: 'applied',
        payload: {
          id: `brief-morning-${dateKey}`,
          type: 'morning',
          title: '🌅 Good Morning! AETHER Day Plan',
          subtitle: `You have ${blocks.length} sessions scheduled today (${studyHours.toFixed(1)} hrs study time).`,
          dateKey,
          timestamp: new Date().toISOString(),
          dismissed: false,
          highlights: [
            `Top focus: ${blocks[0]?.label || 'Deep work'}`,
            `Planned study hours: ${studyHours.toFixed(1)} hrs`,
            `Critical subjects monitored: ${state.criticalSubjects.length}`,
          ],
          metrics: {
            plannedStudyHours: studyHours,
            completedTasks: 0,
            pendingTasks: blocks.length,
            sleepHours: 8,
            criticalCount: state.criticalSubjects.length,
          },
        },
      });
    }

    // Evening Brief (21:00)
    if (simTime >= 21.0 && simTime < 21.5 && !state.activeBriefs.some((b) => b.dateKey === dateKey && b.type === 'evening')) {
      patches.push({
        id: `patch-brief-evening-${dateKey}-${Date.now()}`,
        ruleId: 'rule-daily-briefs',
        ruleName: 'Morning / Evening / Night Daily Briefs',
        type: 'CREATE_BRIEF',
        dateKey,
        description: 'Generated Evening Daily Review Brief',
        reason: '9:00 PM simulated evening review trigger reached',
        timestamp: new Date().toISOString(),
        status: 'applied',
        payload: {
          id: `brief-evening-${dateKey}`,
          type: 'evening',
          title: '🌆 Daily Review & Accomplishments',
          subtitle: `Completed ${completed} of ${blocks.length} scheduled tasks today.`,
          dateKey,
          timestamp: new Date().toISOString(),
          dismissed: false,
          highlights: [
            `Completed tasks: ${completed} sessions`,
            `Pending / rescheduled: ${pending} sessions`,
            `Focus adherence rate: ${blocks.length ? Math.round((completed / blocks.length) * 100) : 100}%`,
          ],
          metrics: {
            plannedStudyHours: studyHours,
            completedTasks: completed,
            pendingTasks: pending,
            sleepHours: 8,
            criticalCount: state.criticalSubjects.length,
          },
        },
      });
    }

    // Night Brief (23:00)
    if (simTime >= 23.0 && simTime < 23.5 && !state.activeBriefs.some((b) => b.dateKey === dateKey && b.type === 'night')) {
      const tomorrowKey = getOffsetDateKey(dateKey, 1);
      const tomorrowBlocks = state.daysSchedule[tomorrowKey]?.blocks || [];
      patches.push({
        id: `patch-brief-night-${dateKey}-${Date.now()}`,
        ruleId: 'rule-daily-briefs',
        ruleName: 'Morning / Evening / Night Daily Briefs',
        type: 'CREATE_BRIEF',
        dateKey,
        description: 'Generated Night Tomorrow Preview Brief',
        reason: '11:00 PM simulated night wind-down trigger reached',
        timestamp: new Date().toISOString(),
        status: 'applied',
        payload: {
          id: `brief-night-${dateKey}`,
          type: 'night',
          title: '🌙 Tomorrow Preview & Rest Recommendation',
          subtitle: `Tomorrow has ${tomorrowBlocks.length} planned sessions. Time to wind down.`,
          dateKey,
          timestamp: new Date().toISOString(),
          dismissed: false,
          highlights: [
            `Tomorrow start: ${tomorrowBlocks[0]?.start ? `${Math.floor(tomorrowBlocks[0].start)}:00` : '09:00 AM'}`,
            `Tomorrow planned tasks: ${tomorrowBlocks.length}`,
            `Recommended sleep duration: 7.5 - 8.0 hours`,
          ],
          metrics: {
            plannedStudyHours: studyHours,
            completedTasks: completed,
            pendingTasks: pending,
            sleepHours: 8,
            criticalCount: state.criticalSubjects.length,
          },
        },
      });
    }

    return patches;
  },
};

/**
 * 5. Confidence-Driven Extra Revision Rule
 */
export const confidenceRevisionRule: Rule = {
  id: 'rule-confidence-revision',
  name: 'Confidence-Driven Revision & Critical Topic Tagging',
  description: 'If task completion confidence <= 2, schedules an extra 45m revision within 48h. If confidence = 1, flags 🔴 Critical Weak Topic.',
  category: 'Knowledge',
  trigger: 'task.completed',
  isEnabled: true,
  runCount: 0,
  condition: (event: EngineEvent) => {
    const task = event.payload.task as TaskBlock | undefined;
    const confidence = event.payload.confidence as number | undefined;
    return Boolean(task && task.completed && typeof confidence === 'number');
  },
  action: (event: EngineEvent, state: ApplicationState): Patch[] => {
    const task = event.payload.task as TaskBlock;
    const confidence = event.payload.confidence as number;
    const patches: Patch[] = [];
    const currentDate = state.simulatedDate;

    if (confidence <= 2) {
      // Schedule extra 45-min revision within 48 hours
      const revisionDate = getOffsetDateKey(currentDate, 1);
      const revisionSchedule = state.daysSchedule[revisionDate]?.blocks || [];
      const openSlot = findNextFreeSlot(revisionSchedule, 23, 7, 45, 11);

      patches.push({
        id: `patch-conf-rev-${Date.now()}`,
        ruleId: 'rule-confidence-revision',
        ruleName: 'Confidence-Driven Revision',
        type: 'CREATE_TASK',
        dateKey: revisionDate,
        description: `Scheduled extra 45m revision for "${task.label}" (Low confidence: ${confidence}/5)`,
        reason: `Task completed with low confidence rating (${confidence}/5). Automatic reinforcement triggered.`,
        timestamp: new Date().toISOString(),
        status: 'applied',
        payload: {
          id: `task-extra-rev-${Date.now()}`,
          label: `Extra Revision: ${task.label}`,
          start: openSlot ? openSlot.start : 15,
          duration: 45,
          bucket: 'study',
          kind: 'flexible',
          subject: task.subject,
          priority: 'P0',
          energy: 'high',
          revision: null,
          groupId: task.groupId || `group-${task.id}`,
          completed: false,
        },
      });
    }

    if (confidence === 1 && task.subject) {
      patches.push({
        id: `patch-conf-critical-${Date.now()}`,
        ruleId: 'rule-confidence-revision',
        ruleName: 'Critical Weak Topic Tagging',
        type: 'FLAG_CRITICAL_SUBJECT',
        description: `Flagged subject "${task.subject}" as 🔴 Critical Weak Topic`,
        reason: `Confidence rating 1/5 received on "${task.label}".`,
        timestamp: new Date().toISOString(),
        status: 'applied',
        payload: {
          subject: task.subject,
        },
      });
    }

    return patches;
  },
};

/**
 * 6. Natural Language Intake Rule
 */
export const naturalLanguageRule: Rule = {
  id: 'rule-nl-intake',
  name: 'Natural Language Schedule Intake Parser',
  description: 'Parses freeform English inputs like "college 9 to 12" or "finished DBMS" into schedule patches.',
  category: 'Intake',
  trigger: 'nl.input_parsed',
  isEnabled: true,
  runCount: 0,
  condition: (event: EngineEvent) => {
    return Boolean(event.payload.parsedIntent && event.payload.parsedIntent.intentType !== 'unknown');
  },
  action: (event: EngineEvent, state: ApplicationState): Patch[] => {
    const intent = event.payload.parsedIntent;
    const patches: Patch[] = [];
    const dateKey = intent.extracted.dateKey || state.simulatedDate;

    if (intent.intentType === 'addFixedBlock') {
      const start = intent.extracted.startHour || 9;
      const end = intent.extracted.endHour || 12;
      const duration = Math.round((end - start) * 60);

      patches.push({
        id: `patch-nl-add-${Date.now()}`,
        ruleId: 'rule-nl-intake',
        ruleName: 'Natural Language Schedule Intake Parser',
        type: 'CREATE_TASK',
        dateKey,
        description: `Added fixed block "${intent.extracted.label}" (${Math.floor(start)}:00 - ${Math.floor(end)}:00)`,
        reason: `Parsed natural language input: "${intent.rawText}"`,
        timestamp: new Date().toISOString(),
        status: 'applied',
        payload: {
          id: `task-nl-${Date.now()}`,
          label: intent.extracted.label || 'Fixed Block',
          start,
          duration,
          bucket: 'other',
          kind: 'fixed',
          subject: intent.extracted.subject || null,
          priority: 'P1',
          energy: 'medium',
          revision: null,
          groupId: null,
          completed: false,
        },
      });
    } else if (intent.intentType === 'completeTask') {
      const labelQuery = (intent.extracted.label || '').toLowerCase();
      const todayBlocks = state.daysSchedule[dateKey]?.blocks || [];
      const match = todayBlocks.find((b) => b.label.toLowerCase().includes(labelQuery) || (b.subject && b.subject.toLowerCase().includes(labelQuery)));

      if (match) {
        patches.push({
          id: `patch-nl-complete-${Date.now()}`,
          ruleId: 'rule-nl-intake',
          ruleName: 'Natural Language Schedule Intake Parser',
          type: 'UPDATE_TASK',
          targetId: match.id,
          dateKey,
          description: `Marked "${match.label}" completed`,
          reason: `Parsed natural language input: "${intent.rawText}"`,
          timestamp: new Date().toISOString(),
          status: 'applied',
          payload: {
            taskId: match.id,
            completed: true,
          },
        });
      }
    }

    return patches;
  },
};

export const DEFAULT_RULES: Rule[] = [
  autoChainingRule,
  missedSessionRebuildRule,
  inTabReminderRule,
  dailyBriefsRule,
  confidenceRevisionRule,
  naturalLanguageRule,
];
