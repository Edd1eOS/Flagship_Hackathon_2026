import type { AppState, LocationId, ResidentState } from "@lemonade/domain";

import type { UiEffect } from "./effects";

export type AssignmentResult =
  | { ok: true; state: AppState; effects: UiEffect[] }
  | { ok: false; reason: string };

function findResident(
  state: AppState,
  residentId: string,
): ResidentState | undefined {
  return state.town.residents.find((resident) => resident.id === residentId);
}

function findLocation(state: AppState, locationId: LocationId) {
  return state.town.locations.find((location) => location.id === locationId);
}

// Reversible preview: the location shows as assigned and the resident holds
// the project, but nothing travels or activates until the plan is confirmed.
export function previewAssignment(
  state: AppState,
  residentId: string,
  locationId: LocationId,
): AssignmentResult {
  const resident = findResident(state, residentId);
  if (!resident) {
    return { ok: false, reason: `Resident "${residentId}" does not exist` };
  }
  if (!resident.assignable) {
    return {
      ok: false,
      reason: `${resident.role} is not assignable to town projects`,
    };
  }
  const location = findLocation(state, locationId);
  if (!location) {
    return { ok: false, reason: `Location "${locationId}" does not exist` };
  }
  if (location.state !== "available") {
    return {
      ok: false,
      reason: `Location "${locationId}" is ${location.state}, not available`,
    };
  }
  const otherHolder = state.town.residents.find(
    (candidate) =>
      candidate.id !== residentId && candidate.projectId === locationId,
  );
  if (otherHolder) {
    return {
      ok: false,
      reason: `Location "${locationId}" is already previewed by ${otherHolder.role}`,
    };
  }

  // Re-previewing moves this resident's single preview; free the old spot.
  const previousProject = resident.projectId;
  const nextState: AppState = {
    ...state,
    town: {
      ...state.town,
      locations: state.town.locations.map((candidate) => {
        if (candidate.id === locationId) {
          return { ...candidate, state: "assigned" as const };
        }
        if (
          previousProject &&
          candidate.id === previousProject &&
          candidate.state === "assigned"
        ) {
          return { ...candidate, state: "available" as const };
        }
        return candidate;
      }),
      residents: state.town.residents.map((candidate) =>
        candidate.id === residentId
          ? { ...candidate, projectId: locationId }
          : candidate,
      ),
    },
  };
  return { ok: true, state: nextState, effects: [] };
}

export function cancelAssignment(
  state: AppState,
  residentId: string,
): AssignmentResult {
  const resident = findResident(state, residentId);
  if (!resident) {
    return { ok: false, reason: `Resident "${residentId}" does not exist` };
  }
  if (!resident.projectId) {
    return { ok: true, state, effects: [] };
  }

  const projectId = resident.projectId;
  const nextState: AppState = {
    ...state,
    town: {
      ...state.town,
      locations: state.town.locations.map((candidate) =>
        candidate.id === projectId && candidate.state === "assigned"
          ? { ...candidate, state: "available" as const }
          : candidate,
      ),
      residents: state.town.residents.map((candidate) =>
        candidate.id === residentId
          ? { ...candidate, projectId: null }
          : candidate,
      ),
    },
  };
  return { ok: true, state: nextState, effects: [] };
}

const RESIDENT_ACTIVITIES: Record<string, string> = {
  mender: "activity_repair",
  host: "activity_hosting",
};

// Atomic: either every assignment is valid and applied, or nothing changes.
export function confirmTownPlan(
  state: AppState,
  assignments: ReadonlyArray<{ residentId: string; locationId: LocationId }>,
): AssignmentResult {
  if (assignments.length === 0) {
    return { ok: false, reason: "A town plan needs at least one assignment" };
  }
  const residentIds = assignments.map((a) => a.residentId);
  const locationIds = assignments.map((a) => a.locationId);
  if (new Set(residentIds).size !== residentIds.length) {
    return { ok: false, reason: "A resident can only take one project" };
  }
  if (new Set(locationIds).size !== locationIds.length) {
    return { ok: false, reason: "A location can only host one resident" };
  }

  for (const assignment of assignments) {
    const resident = findResident(state, assignment.residentId);
    if (!resident) {
      return {
        ok: false,
        reason: `Resident "${assignment.residentId}" does not exist`,
      };
    }
    if (!resident.assignable) {
      return {
        ok: false,
        reason: `${resident.role} is not assignable to town projects`,
      };
    }
    const location = findLocation(state, assignment.locationId);
    if (!location) {
      return {
        ok: false,
        reason: `Location "${assignment.locationId}" does not exist`,
      };
    }
    if (location.state !== "available" && location.state !== "assigned") {
      return {
        ok: false,
        reason: `Location "${assignment.locationId}" is ${location.state} and cannot start a project`,
      };
    }
    if (location.state === "assigned") {
      const holder = state.town.residents.find(
        (candidate) => candidate.projectId === assignment.locationId,
      );
      if (holder && holder.id !== assignment.residentId) {
        return {
          ok: false,
          reason: `Location "${assignment.locationId}" is previewed by another resident`,
        };
      }
    }
  }

  const effects: UiEffect[] = [];
  const assignmentByResident = new Map(
    assignments.map((a) => [a.residentId, a.locationId]),
  );
  const assignedLocations = new Set(locationIds);

  const nextState: AppState = {
    ...state,
    town: {
      ...state.town,
      locations: state.town.locations.map((location) =>
        assignedLocations.has(location.id)
          ? { ...location, state: "active" as const }
          : location,
      ),
      residents: state.town.residents.map((resident) => {
        const target = assignmentByResident.get(resident.id);
        if (!target) {
          return resident;
        }
        return {
          ...resident,
          locationId: target,
          projectId: target,
          activityId: RESIDENT_ACTIVITIES[resident.role] ?? "activity_generic",
        };
      }),
    },
  };

  for (const assignment of assignments) {
    effects.push({
      type: "RESIDENT_TRAVELLED",
      residentId: assignment.residentId,
      locationId: assignment.locationId,
    });
    effects.push({
      type: "LOCATION_ACTIVATED",
      locationId: assignment.locationId,
    });
  }

  return { ok: true, state: nextState, effects };
}
