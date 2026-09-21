import { ParsedIntent } from './types';

/**
 * Natural Language Parser for AETHER OS Intake
 * Translates plain-English statements into structured intent actions
 */
export function parseNaturalLanguageInput(rawInput: string, currentDateKey: string): ParsedIntent {
  const trimmed = rawInput.trim();
  const lower = trimmed.toLowerCase();

  // Pattern 1: Fixed Block Scheduling
  // Examples: "I have college 9 to 12 today", "Math lecture from 14 to 16", "Gym at 7 to 8"
  const fixedBlockRegex = /(?:i have|scheduled|have)?\s*([a-z0-9\s]+?)\s+(?:from\s+)?(\d{1,2})(?::(\d{2}))?\s*(?:am|pm)?\s*(?:to|-|until)\s*(\d{1,2})(?::(\d{2}))?\s*(?:am|pm)?\s*(today|tomorrow)?/i;
  const fixedMatch = trimmed.match(fixedBlockRegex);

  if (fixedMatch) {
    const rawLabel = fixedMatch[1].replace(/^(i have|scheduled|have)\s+/i, '').trim();
    let startHr = parseInt(fixedMatch[2], 10);
    const startMin = fixedMatch[3] ? parseInt(fixedMatch[3], 10) : 0;
    let endHr = parseInt(fixedMatch[4], 10);
    const endMin = fixedMatch[5] ? parseInt(fixedMatch[5], 10) : 0;

    // Standardize 12-hour format if end hour is smaller than start hour or pm implied
    if (endHr < startHr && endHr < 12) {
      endHr += 12;
    }

    const startDecHour = startHr + startMin / 60;
    const endDecHour = endHr + endMin / 60;

    if (!isNaN(startDecHour) && !isNaN(endDecHour) && endDecHour > startDecHour) {
      return {
        intentType: 'addFixedBlock',
        rawText: trimmed,
        confidence: 0.92,
        extracted: {
          label: rawLabel || 'Scheduled Activity',
          subject: rawLabel,
          startHour: startDecHour,
          endHour: endDecHour,
          dateKey: currentDateKey,
          priority: 'P1',
          energy: 'medium',
        },
      };
    }
  }

  // Pattern 2: Task Completion
  // Examples: "I finished DBMS", "Completed Algorithms assignment", "Done with OS revision"
  const completeRegex = /(?:finished|completed|done with|marked|checked off)\s+(.+)/i;
  const completeMatch = trimmed.match(completeRegex);

  if (completeMatch) {
    const taskName = completeMatch[1].trim();
    return {
      intentType: 'completeTask',
      rawText: trimmed,
      confidence: 0.95,
      extracted: {
        label: taskName,
        subject: taskName,
        dateKey: currentDateKey,
      },
    };
  }

  // Pattern 3: Schedule Query
  // Examples: "what is on my schedule today", "show tasks for today"
  if (lower.includes('schedule') || lower.includes('agenda') || lower.includes('tasks for today')) {
    return {
      intentType: 'querySchedule',
      rawText: trimmed,
      confidence: 0.88,
      extracted: {
        dateKey: currentDateKey,
      },
    };
  }

  // Fallback
  return {
    intentType: 'unknown',
    rawText: trimmed,
    confidence: 0.3,
    extracted: {},
  };
}
