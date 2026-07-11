import { toIsoTimestamp } from "./clock";
import type { Mission, MissionStatus } from "./schemas/mission";

export const MISSION_CHECK_IN_HOURS = 24;

export type MissionTransitionEvent =
  | { type: "ACCEPT"; acceptedAt: string; checkInAt: string }
  | { type: "START" }
  | { type: "MARK_READY_FOR_CHECKIN" }
  | { type: "COMPLETE"; completedAt: string }
  | { type: "CANCEL" };

export type MissionTransitionResult =
  { ok: true; mission: Mission } | { ok: false; reason: string };

const LEGAL_TRANSITIONS: Record<
  MissionTransitionEvent["type"],
  ReadonlyArray<MissionStatus>
> = {
  ACCEPT: ["offered"],
  START: ["accepted"],
  MARK_READY_FOR_CHECKIN: ["active"],
  COMPLETE: ["ready_for_checkin"],
  CANCEL: ["offered", "accepted", "active", "ready_for_checkin"],
};

export const NON_TERMINAL_MISSION_STATUSES: ReadonlySet<MissionStatus> =
  new Set(["offered", "accepted", "active", "ready_for_checkin"]);

export function computeCheckInAt(acceptedAt: Date): string {
  return toIsoTimestamp(
    new Date(acceptedAt.getTime() + MISSION_CHECK_IN_HOURS * 3_600_000),
  );
}

export function getMissionReadiness(
  mission: Mission,
  now: Date,
): "waiting" | "ready_for_checkin" {
  if (
    mission.status === "active" &&
    mission.checkInAt &&
    now.getTime() >= Date.parse(mission.checkInAt)
  ) {
    return "ready_for_checkin";
  }
  return mission.status === "ready_for_checkin"
    ? "ready_for_checkin"
    : "waiting";
}

export function transitionMission(
  mission: Mission,
  event: MissionTransitionEvent,
): MissionTransitionResult {
  if (!LEGAL_TRANSITIONS[event.type].includes(mission.status)) {
    return {
      ok: false,
      reason: `Mission transition "${event.type}" is not legal from status "${mission.status}"`,
    };
  }

  switch (event.type) {
    case "ACCEPT":
      return {
        ok: true,
        mission: {
          ...mission,
          status: "accepted",
          acceptedAt: event.acceptedAt,
          checkInAt: event.checkInAt,
        },
      };
    case "START":
      return { ok: true, mission: { ...mission, status: "active" } };
    case "MARK_READY_FOR_CHECKIN":
      return {
        ok: true,
        mission: { ...mission, status: "ready_for_checkin" },
      };
    case "COMPLETE":
      return {
        ok: true,
        mission: {
          ...mission,
          status: "completed",
          completedAt: event.completedAt,
        },
      };
    case "CANCEL":
      return { ok: true, mission: { ...mission, status: "cancelled" } };
  }
}
