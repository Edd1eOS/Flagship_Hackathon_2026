import type {
  AppState,
  Command,
  CommandDependencies,
  DomainEvent,
  TownEngine,
  TransactionResult,
} from "@lemonade/domain";
import {
  CURRENT_SCHEMA_VERSION,
  appendUniqueEvents,
  toIsoTimestamp,
} from "@lemonade/domain";

import {
  cancelAssignment,
  confirmTownPlan,
  previewAssignment,
} from "./assignments";
import { projectBusinessEvents } from "./projector";

function ruleViolation(message: string): TransactionResult {
  return { ok: false, error: { code: "RULE_VIOLATION", message } };
}

function handleTownCommand(
  state: AppState,
  command: Command,
  deps: CommandDependencies,
): TransactionResult | null {
  switch (command.type) {
    case "PREVIEW_ASSIGNMENT": {
      const result = previewAssignment(
        state,
        command.residentId,
        command.locationId,
      );
      if (!result.ok) {
        return ruleViolation(result.reason);
      }
      // Previews are reversible UI state and intentionally emit no event;
      // replaying the same preview is naturally idempotent.
      return {
        ok: true,
        state: result.state,
        events: [],
        effects: result.effects,
        duplicateCommand: false,
      };
    }
    case "CANCEL_ASSIGNMENT": {
      const result = cancelAssignment(state, command.residentId);
      if (!result.ok) {
        return ruleViolation(result.reason);
      }
      return {
        ok: true,
        state: result.state,
        events: [],
        effects: result.effects,
        duplicateCommand: false,
      };
    }
    case "CONFIRM_TOWN_PLAN": {
      const result = confirmTownPlan(state, command.assignments);
      if (!result.ok) {
        return ruleViolation(result.reason);
      }
      const event: DomainEvent = {
        id: deps.ids.nextId("evt"),
        type: "TOWN_PLAN_CONFIRMED",
        occurredAt: toIsoTimestamp(deps.clock.now()),
        schemaVersion: CURRENT_SCHEMA_VERSION,
        commandId: command.commandId,
        assignments: command.assignments.map((assignment) => ({
          residentId: assignment.residentId,
          locationId: assignment.locationId,
        })),
      };
      return {
        ok: true,
        state: {
          ...result.state,
          events: appendUniqueEvents(result.state.events, [event]),
        },
        events: [event],
        effects: result.effects,
        duplicateCommand: false,
      };
    }
    default:
      return null;
  }
}

// The concrete TownEngine injected into domain command dependencies.
export function createTownEngine(): TownEngine {
  return {
    handleCommand: handleTownCommand,
    projectEvents: (state, events) => projectBusinessEvents(state, events),
  };
}
