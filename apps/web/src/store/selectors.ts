import {
  NON_TERMINAL_MISSION_STATUSES,
  type AppState,
  type Mission,
  type PurchaseDecision,
} from "@lemonade/domain";

export function selectReadyDecisions(state: AppState): PurchaseDecision[] {
  return state.decisions.filter((decision) => decision.status === "ready");
}

export function selectCoolingDecisions(state: AppState): PurchaseDecision[] {
  return state.decisions
    .filter((decision) => decision.status === "cooling")
    .sort((a, b) => (a.reviewAt ?? "").localeCompare(b.reviewAt ?? ""));
}

export function selectOpenMissions(state: AppState): Mission[] {
  return state.missions.filter((mission) =>
    NON_TERMINAL_MISSION_STATUSES.has(mission.status),
  );
}
