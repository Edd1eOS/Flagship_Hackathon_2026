import type { Clock } from "./clock";
import { toIsoTimestamp } from "./clock";
import type {
  AcceptMissionCommand,
  CancelMissionCommand,
  CaptureDecisionCommand,
  Command,
  CommitReuseCommand,
  CompleteMissionCommand,
  ExtendCoolingCommand,
  ImportDetectedProductCommand,
  OfferMissionCommand,
  PlanAllocationCommand,
  QuickAddOwnedItemCommand,
  ResolveDecisionCommand,
  StartCoolingCommand,
} from "./commands/command";
import {
  NON_TERMINAL_MISSION_STATUSES,
  computeCheckInAt,
  getMissionReadiness,
  transitionMission,
  type MissionTransitionEvent,
} from "./mission-machine";
import type { Mission } from "./schemas/mission";
import {
  computeReviewAt,
  transitionDecision,
  type DecisionTransitionEvent,
} from "./decision-machine";
import { findSameJobMatches } from "./overlap";
import type { DomainEvent } from "./events/domain-event";
import type { IdGenerator } from "./ids";
import type { AppState } from "./schemas/app-state";
import { CURRENT_SCHEMA_VERSION } from "./schemas/primitives";
import type { PurchaseDecision } from "./schemas/purchase-decision";
import { REFLECTION_XP } from "./schemas/reflection";

// Transient UI effect base. Effects are never persisted and never carry
// authority; the game engine defines the concrete union.
export type TransientEffect = { readonly type: string };

// Implemented by the game engine and injected by the app so domain never
// imports game-engine (forbidden reverse dependency).
export type TownEngine = {
  handleCommand(
    state: AppState,
    command: Command,
    deps: CommandDependencies,
  ): TransactionResult | null;
  projectEvents(
    state: AppState,
    events: readonly DomainEvent[],
  ): { state: AppState; effects: TransientEffect[] };
};

export type CommandDependencies = {
  clock: Clock;
  ids: IdGenerator;
  // Canonical seed factory; RESET_DEMO delegates here so tests can make
  // reset fully deterministic.
  createSeed: () => AppState;
  town?: TownEngine;
};

export type TransactionError = {
  code: "NOT_IMPLEMENTED" | "NOT_FOUND" | "RULE_VIOLATION";
  message: string;
};

export type TransactionResult =
  | {
      ok: true;
      state: AppState;
      events: DomainEvent[];
      effects: TransientEffect[];
      duplicateCommand: boolean;
    }
  | { ok: false; error: TransactionError };

export function appendUniqueEvents(
  existing: readonly DomainEvent[],
  incoming: readonly DomainEvent[],
): DomainEvent[] {
  const seen = new Set(existing.map((event) => event.id));
  const result = [...existing];
  for (const event of incoming) {
    if (!seen.has(event.id)) {
      seen.add(event.id);
      result.push(event);
    }
  }
  return result;
}

function ok(
  state: AppState,
  events: DomainEvent[],
  duplicateCommand = false,
): TransactionResult {
  return { ok: true, state, events, effects: [], duplicateCommand };
}

function handleQuickAddOwnedItem(
  state: AppState,
  command: QuickAddOwnedItemCommand,
  deps: CommandDependencies,
): TransactionResult {
  const item = {
    id: deps.ids.nextId("item"),
    name: command.name,
    category: command.category,
    useTags: [command.useTag],
    condition: command.condition ?? "unknown",
  };
  const event: DomainEvent = {
    id: deps.ids.nextId("evt"),
    type: "OWNED_ITEM_ADDED",
    occurredAt: toIsoTimestamp(deps.clock.now()),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    commandId: command.commandId,
    ownedItemId: item.id,
  };
  const nextState: AppState = {
    ...state,
    ownedItems: [...state.ownedItems, item],
    events: appendUniqueEvents(state.events, [event]),
  };
  return ok(nextState, [event]);
}

function ruleViolation(message: string): TransactionResult {
  return { ok: false, error: { code: "RULE_VIOLATION", message } };
}

function notFound(message: string): TransactionResult {
  return { ok: false, error: { code: "NOT_FOUND", message } };
}

function findDecision(
  state: AppState,
  decisionId: string,
): PurchaseDecision | undefined {
  return state.decisions.find((decision) => decision.id === decisionId);
}

function replaceDecision(
  state: AppState,
  next: PurchaseDecision,
): PurchaseDecision[] {
  return state.decisions.map((decision) =>
    decision.id === next.id ? next : decision,
  );
}

function applyTransitions(
  decision: PurchaseDecision,
  events: readonly DecisionTransitionEvent[],
  deps: CommandDependencies,
): { ok: true; decision: PurchaseDecision } | { ok: false; reason: string } {
  let current = decision;
  for (const event of events) {
    const result = transitionDecision(current, event, deps.clock);
    if (!result.ok) {
      return result;
    }
    current = result.decision;
  }
  return { ok: true, decision: current };
}

function handleCaptureDecision(
  state: AppState,
  command: CaptureDecisionCommand,
  deps: CommandDependencies,
): TransactionResult {
  const now = deps.clock.now();
  const overlapItemIds = findSameJobMatches(
    {
      name: command.draft.name,
      category: command.draft.category,
      job: command.draft.job,
    },
    state.ownedItems,
  ).map((match) => match.item.id);
  const decision: PurchaseDecision = {
    id: deps.ids.nextId("dec"),
    ...command.draft,
    status: "draft",
    createdAt: toIsoTimestamp(now),
    overlapItemIds,
  };
  const event: DomainEvent = {
    id: deps.ids.nextId("evt"),
    type: "DECISION_CAPTURED",
    occurredAt: toIsoTimestamp(now),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    commandId: command.commandId,
    decisionId: decision.id,
  };
  return ok(
    {
      ...state,
      decisions: [...state.decisions, decision],
      events: appendUniqueEvents(state.events, [event]),
    },
    [event],
  );
}

function handleImportDetectedProduct(
  state: AppState,
  command: ImportDetectedProductCommand,
  deps: CommandDependencies,
): TransactionResult {
  const existing = state.events.find(
    (event) =>
      event.type === "PRODUCT_IMPORTED_FROM_EXTENSION" &&
      event.importId === command.importId,
  );
  if (existing) return ok(state, [], true);

  const now = deps.clock.now();
  const reviewAt = computeReviewAt(now);
  const candidate = {
    name: command.product.name,
    category: command.product.category ?? "unclassified",
    job: command.product.job ?? "needs review",
  };
  const decision: PurchaseDecision = {
    id: deps.ids.nextId("dec"),
    name: candidate.name,
    price: command.product.price ?? 0,
    currency: command.product.currency ?? "AUD",
    category: candidate.category,
    job: candidate.job,
    motive: "mood",
    status: "cooling",
    origin: "extension_import",
    createdAt: toIsoTimestamp(now),
    reviewAt,
    sourceUrl: command.product.sourceUrl,
    merchant: command.product.merchant,
    imageRef: command.product.imageUrl,
    overlapItemIds: findSameJobMatches(candidate, state.ownedItems).map(
      (match) => match.item.id,
    ),
  };
  const event: DomainEvent = {
    id: deps.ids.nextId("evt"),
    type: "PRODUCT_IMPORTED_FROM_EXTENSION",
    occurredAt: toIsoTimestamp(now),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    commandId: command.commandId,
    decisionId: decision.id,
    importId: command.importId,
  };
  return ok(
    {
      ...state,
      decisions: [...state.decisions, decision],
      events: appendUniqueEvents(state.events, [event]),
    },
    [event],
  );
}

function handleStartCooling(
  state: AppState,
  command: StartCoolingCommand,
  deps: CommandDependencies,
): TransactionResult {
  const decision = findDecision(state, command.decisionId);
  if (!decision) {
    return notFound(`Decision "${command.decisionId}" does not exist`);
  }

  const reviewAt = computeReviewAt(deps.clock.now());
  // Draft decisions are assessed (overlap check acknowledged) on the way in.
  const steps: DecisionTransitionEvent[] =
    decision.status === "draft"
      ? [
          { type: "ASSESS", overlapItemIds: decision.overlapItemIds },
          { type: "START_COOLING", reviewAt },
        ]
      : [{ type: "START_COOLING", reviewAt }];

  const transitioned = applyTransitions(decision, steps, deps);
  if (!transitioned.ok) {
    return ruleViolation(transitioned.reason);
  }

  const event: DomainEvent = {
    id: deps.ids.nextId("evt"),
    type: "COOLING_STARTED",
    occurredAt: toIsoTimestamp(deps.clock.now()),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    commandId: command.commandId,
    decisionId: decision.id,
    reviewAt,
  };
  return ok(
    {
      ...state,
      decisions: replaceDecision(state, transitioned.decision),
      events: appendUniqueEvents(state.events, [event]),
    },
    [event],
  );
}

const OUTCOME_TRANSITION: Record<
  ResolveDecisionCommand["outcome"],
  "BUY" | "SKIP" | "RECLASSIFY_NEED"
> = {
  bought: "BUY",
  skipped: "SKIP",
  reused_existing: "SKIP",
  repaired: "SKIP",
  reclassified_need: "RECLASSIFY_NEED",
};

function handleResolveDecision(
  state: AppState,
  command: ResolveDecisionCommand,
  deps: CommandDependencies,
): TransactionResult {
  const decision = findDecision(state, command.decisionId);
  if (!decision) {
    return notFound(`Decision "${command.decisionId}" does not exist`);
  }

  const wasFinalReview = decision.status === "ready";
  const transitioned = transitionDecision(
    decision,
    { type: OUTCOME_TRANSITION[command.outcome], reason: command.reason },
    deps.clock,
  );
  if (!transitioned.ok) {
    return ruleViolation(transitioned.reason);
  }

  const now = deps.clock.now();
  const events: DomainEvent[] = [
    {
      id: deps.ids.nextId("evt"),
      type: "DECISION_REVIEWED",
      occurredAt: toIsoTimestamp(now),
      schemaVersion: CURRENT_SCHEMA_VERSION,
      commandId: command.commandId,
      decisionId: decision.id,
      outcome: command.outcome,
    },
  ];

  // One fixed-XP reflection per final review; duplicates are impossible
  // because terminal statuses reject further resolution, but stay defensive.
  const reflections = [...state.reflections];
  if (
    wasFinalReview &&
    !reflections.some((reflection) => reflection.decisionId === decision.id)
  ) {
    reflections.push({
      id: deps.ids.nextId("ref"),
      decisionId: decision.id,
      outcome: command.outcome,
      reason: command.reason,
      xpAwarded: REFLECTION_XP,
      createdAt: toIsoTimestamp(now),
    });
  }

  // Buy stays neutral; optionally record the purchase as an owned item.
  const ownedItems = [...state.ownedItems];
  if (command.outcome === "bought" && command.addToMyStuff) {
    const item = {
      id: deps.ids.nextId("item"),
      name: decision.name,
      category: decision.category,
      useTags: [decision.job],
      condition: "good" as const,
      imageRef: decision.imageRef,
    };
    ownedItems.push(item);
    events.push({
      id: deps.ids.nextId("evt"),
      type: "OWNED_ITEM_ADDED",
      occurredAt: toIsoTimestamp(now),
      schemaVersion: CURRENT_SCHEMA_VERSION,
      commandId: command.commandId,
      ownedItemId: item.id,
    });
  }

  return ok(
    {
      ...state,
      decisions: replaceDecision(state, transitioned.decision),
      reflections,
      ownedItems,
      events: appendUniqueEvents(state.events, events),
    },
    events,
  );
}

function handleExtendCooling(
  state: AppState,
  command: ExtendCoolingCommand,
  deps: CommandDependencies,
): TransactionResult {
  const decision = findDecision(state, command.decisionId);
  if (!decision) {
    return notFound(`Decision "${command.decisionId}" does not exist`);
  }

  const reviewAt = computeReviewAt(deps.clock.now());
  const transitioned = applyTransitions(
    decision,
    [{ type: "EXTEND", reviewAt }, { type: "RESUME_COOLING" }],
    deps,
  );
  if (!transitioned.ok) {
    return ruleViolation(transitioned.reason);
  }

  const event: DomainEvent = {
    id: deps.ids.nextId("evt"),
    type: "COOLING_STARTED",
    occurredAt: toIsoTimestamp(deps.clock.now()),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    commandId: command.commandId,
    decisionId: decision.id,
    reviewAt,
  };
  return ok(
    {
      ...state,
      decisions: replaceDecision(state, transitioned.decision),
      events: appendUniqueEvents(state.events, [event]),
    },
    [event],
  );
}

// Reuse commitments require an honest context: either the user is reviewing
// a ready decision or has already skipped the purchase.
const COMMITTABLE_STATUSES: ReadonlySet<PurchaseDecision["status"]> = new Set([
  "ready",
  "skipped",
]);

function handleCommitReuse(
  state: AppState,
  command: CommitReuseCommand,
  deps: CommandDependencies,
): TransactionResult {
  const decision = findDecision(state, command.decisionId);
  if (!decision) {
    return notFound(`Decision "${command.decisionId}" does not exist`);
  }
  const item = state.ownedItems.find(
    (owned) => owned.id === command.ownedItemId,
  );
  if (!item) {
    return notFound(`Owned item "${command.ownedItemId}" does not exist`);
  }
  if (!COMMITTABLE_STATUSES.has(decision.status)) {
    return ruleViolation(
      `Reuse can only be committed from a ready or skipped decision, not "${decision.status}"`,
    );
  }
  if (
    state.reuseCommitments.some(
      (commitment) => commitment.decisionId === decision.id,
    )
  ) {
    return ruleViolation(
      `Decision "${decision.id}" already has a reuse commitment`,
    );
  }

  const now = deps.clock.now();
  const commitment = {
    id: deps.ids.nextId("reuse"),
    decisionId: decision.id,
    ownedItemId: item.id,
    action: command.action,
    note: command.note,
    createdAt: toIsoTimestamp(now),
  };
  const event: DomainEvent = {
    id: deps.ids.nextId("evt"),
    type: "REUSE_COMMITTED",
    occurredAt: toIsoTimestamp(now),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    commandId: command.commandId,
    reuseCommitmentId: commitment.id,
    decisionId: decision.id,
    ownedItemId: item.id,
  };
  return ok(
    {
      ...state,
      reuseCommitments: [...state.reuseCommitments, commitment],
      events: appendUniqueEvents(state.events, [event]),
    },
    [event],
  );
}

export const MISSION_SLOTS = 2;

function findMission(state: AppState, missionId: string): Mission | undefined {
  return state.missions.find((mission) => mission.id === missionId);
}

function replaceMission(state: AppState, next: Mission): Mission[] {
  return state.missions.map((mission) =>
    mission.id === next.id ? next : mission,
  );
}

function applyMissionTransitions(
  mission: Mission,
  events: readonly MissionTransitionEvent[],
): { ok: true; mission: Mission } | { ok: false; reason: string } {
  let current = mission;
  for (const event of events) {
    const result = transitionMission(current, event);
    if (!result.ok) {
      return result;
    }
    current = result.mission;
  }
  return { ok: true, mission: current };
}

const MISSION_OFFERABLE_DECISION_STATUSES: ReadonlySet<
  PurchaseDecision["status"]
> = new Set(["assessed", "cooling", "ready"]);

function handleOfferMission(
  state: AppState,
  command: OfferMissionCommand,
  deps: CommandDependencies,
): TransactionResult {
  const decision = findDecision(state, command.decisionId);
  if (!decision) {
    return notFound(`Decision "${command.decisionId}" does not exist`);
  }
  if (!MISSION_OFFERABLE_DECISION_STATUSES.has(decision.status)) {
    return ruleViolation(
      `Missions cannot be offered for a "${decision.status}" decision`,
    );
  }
  if (command.ownedItemId) {
    const item = state.ownedItems.find(
      (owned) => owned.id === command.ownedItemId,
    );
    if (!item) {
      return notFound(`Owned item "${command.ownedItemId}" does not exist`);
    }
  }

  const openMissions = state.missions.filter((mission) =>
    NON_TERMINAL_MISSION_STATUSES.has(mission.status),
  );
  if (openMissions.length >= MISSION_SLOTS) {
    return ruleViolation(
      `Both mission slots are in use (${MISSION_SLOTS} maximum)`,
    );
  }
  if (openMissions.some((mission) => mission.decisionId === decision.id)) {
    return ruleViolation(
      `Decision "${decision.id}" already has an open mission`,
    );
  }
  if (
    command.ownedItemId &&
    openMissions.some((mission) => mission.ownedItemId === command.ownedItemId)
  ) {
    return ruleViolation(
      `Owned item "${command.ownedItemId}" is already used by an open mission`,
    );
  }

  const now = deps.clock.now();
  const mission: Mission = {
    id: deps.ids.nextId("mis"),
    decisionId: decision.id,
    ownedItemId: command.ownedItemId,
    type: command.missionType,
    status: "offered",
  };
  const event: DomainEvent = {
    id: deps.ids.nextId("evt"),
    type: "MISSION_OFFERED",
    occurredAt: toIsoTimestamp(now),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    commandId: command.commandId,
    missionId: mission.id,
    decisionId: decision.id,
  };
  return ok(
    {
      ...state,
      missions: [...state.missions, mission],
      events: appendUniqueEvents(state.events, [event]),
    },
    [event],
  );
}

function handleAcceptMission(
  state: AppState,
  command: AcceptMissionCommand,
  deps: CommandDependencies,
): TransactionResult {
  const mission = findMission(state, command.missionId);
  if (!mission) {
    return notFound(`Mission "${command.missionId}" does not exist`);
  }

  const now = deps.clock.now();
  const transitioned = applyMissionTransitions(mission, [
    {
      type: "ACCEPT",
      acceptedAt: toIsoTimestamp(now),
      checkInAt: computeCheckInAt(now),
    },
    { type: "START" },
  ]);
  if (!transitioned.ok) {
    return ruleViolation(transitioned.reason);
  }

  const event: DomainEvent = {
    id: deps.ids.nextId("evt"),
    type: "MISSION_ACCEPTED",
    occurredAt: toIsoTimestamp(now),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    commandId: command.commandId,
    missionId: mission.id,
    decisionId: mission.decisionId,
  };
  return ok(
    {
      ...state,
      missions: replaceMission(state, transitioned.mission),
      events: appendUniqueEvents(state.events, [event]),
    },
    [event],
  );
}

function handleCompleteMission(
  state: AppState,
  command: CompleteMissionCommand,
  deps: CommandDependencies,
): TransactionResult {
  const mission = findMission(state, command.missionId);
  if (!mission) {
    return notFound(`Mission "${command.missionId}" does not exist`);
  }

  const now = deps.clock.now();
  const steps: MissionTransitionEvent[] = [];
  if (
    mission.status === "active" &&
    getMissionReadiness(mission, now) === "ready_for_checkin"
  ) {
    steps.push({ type: "MARK_READY_FOR_CHECKIN" });
  }
  steps.push({ type: "COMPLETE", completedAt: toIsoTimestamp(now) });

  const transitioned = applyMissionTransitions(mission, steps);
  if (!transitioned.ok) {
    return ruleViolation(transitioned.reason);
  }

  const event: DomainEvent = {
    id: deps.ids.nextId("evt"),
    type: "MISSION_COMPLETED",
    occurredAt: toIsoTimestamp(now),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    commandId: command.commandId,
    missionId: mission.id,
    decisionId: mission.decisionId,
  };
  return ok(
    {
      ...state,
      missions: replaceMission(state, transitioned.mission),
      events: appendUniqueEvents(state.events, [event]),
    },
    [event],
  );
}

function handleCancelMission(
  state: AppState,
  command: CancelMissionCommand,
  deps: CommandDependencies,
): TransactionResult {
  const mission = findMission(state, command.missionId);
  if (!mission) {
    return notFound(`Mission "${command.missionId}" does not exist`);
  }

  const transitioned = transitionMission(mission, { type: "CANCEL" });
  if (!transitioned.ok) {
    return ruleViolation(transitioned.reason);
  }

  // Cancellation is neutral: no XP, allocation, or town change of any kind.
  const event: DomainEvent = {
    id: deps.ids.nextId("evt"),
    type: "MISSION_CANCELLED",
    occurredAt: toIsoTimestamp(deps.clock.now()),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    commandId: command.commandId,
    missionId: mission.id,
    decisionId: mission.decisionId,
  };
  return ok(
    {
      ...state,
      missions: replaceMission(state, transitioned.mission),
      events: appendUniqueEvents(state.events, [event]),
    },
    [event],
  );
}

function isWholeCents(amount: number): boolean {
  return (
    Number.isFinite(amount) &&
    Math.abs(amount * 100 - Math.round(amount * 100)) < 1e-6
  );
}

function handlePlanAllocation(
  state: AppState,
  command: PlanAllocationCommand,
  deps: CommandDependencies,
): TransactionResult {
  const decision = findDecision(state, command.decisionId);
  if (!decision) {
    return notFound(`Decision "${command.decisionId}" does not exist`);
  }
  const goal = state.goals.find((candidate) => candidate.id === command.goalId);
  if (!goal) {
    return notFound(`Goal "${command.goalId}" does not exist`);
  }
  if (decision.status !== "skipped") {
    return ruleViolation(
      "Planned allocations require an explicitly skipped decision",
    );
  }
  if (command.amount <= 0 || !isWholeCents(command.amount)) {
    return ruleViolation(
      "Planned amount must be positive and resolve to whole cents",
    );
  }
  const alreadyPlanned = state.plannedAllocations
    .filter((allocation) => allocation.decisionId === decision.id)
    .reduce((total, allocation) => total + allocation.amount, 0);
  if (alreadyPlanned + command.amount > decision.price + 1e-6) {
    return ruleViolation(
      "Total planned allocation cannot exceed the skipped price",
    );
  }

  const now = deps.clock.now();
  const allocation = {
    id: deps.ids.nextId("alloc"),
    decisionId: decision.id,
    goalId: goal.id,
    amount: command.amount,
    kind: "planned" as const,
    createdAt: toIsoTimestamp(now),
  };
  const event: DomainEvent = {
    id: deps.ids.nextId("evt"),
    type: "ALLOCATION_PLANNED",
    occurredAt: toIsoTimestamp(now),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    commandId: command.commandId,
    allocationId: allocation.id,
    decisionId: decision.id,
    goalId: goal.id,
    amount: command.amount,
  };
  return ok(
    {
      ...state,
      plannedAllocations: [...state.plannedAllocations, allocation],
      goals: state.goals.map((candidate) =>
        candidate.id === goal.id
          ? {
              ...candidate,
              plannedAllocationTotal:
                candidate.plannedAllocationTotal + command.amount,
            }
          : candidate,
      ),
      events: appendUniqueEvents(state.events, [event]),
    },
    [event],
  );
}

function runCoreCommand(
  state: AppState,
  command: Command,
  deps: CommandDependencies,
): TransactionResult {
  switch (command.type) {
    case "CAPTURE_DECISION":
      return handleCaptureDecision(state, command, deps);
    case "IMPORT_DETECTED_PRODUCT":
      return handleImportDetectedProduct(state, command, deps);
    case "START_COOLING":
      return handleStartCooling(state, command, deps);
    case "RESOLVE_DECISION":
      return handleResolveDecision(state, command, deps);
    case "EXTEND_COOLING":
      return handleExtendCooling(state, command, deps);
    case "COMMIT_REUSE":
      return handleCommitReuse(state, command, deps);
    case "OFFER_MISSION":
      return handleOfferMission(state, command, deps);
    case "ACCEPT_MISSION":
      return handleAcceptMission(state, command, deps);
    case "COMPLETE_MISSION":
      return handleCompleteMission(state, command, deps);
    case "CANCEL_MISSION":
      return handleCancelMission(state, command, deps);
    case "PLAN_ALLOCATION":
      return handlePlanAllocation(state, command, deps);
    case "QUICK_ADD_OWNED_ITEM":
      return handleQuickAddOwnedItem(state, command, deps);
    case "RESET_DEMO":
      return ok(deps.createSeed(), []);
    default: {
      const townResult = deps.town?.handleCommand(state, command, deps);
      if (townResult) {
        return townResult;
      }
      return {
        ok: false,
        error: {
          code: "NOT_IMPLEMENTED",
          message: `Command "${command.type}" is not implemented yet`,
        },
      };
    }
  }
}

export function executeCommand(
  state: AppState,
  command: Command,
  deps: CommandDependencies,
): TransactionResult {
  const alreadyProcessed = state.events.some(
    (event) => event.commandId === command.commandId,
  );
  if (alreadyProcessed) {
    return ok(state, [], true);
  }

  const result = runCoreCommand(state, command, deps);
  if (!result.ok || !deps.town || command.type === "RESET_DEMO") {
    return result;
  }

  // Idempotently convert confirmed business events into town eligibility.
  const projected = deps.town.projectEvents(result.state, result.events);
  return {
    ...result,
    state: projected.state,
    effects: [...result.effects, ...projected.effects],
  };
}
