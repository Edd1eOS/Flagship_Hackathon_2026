import type { AppState } from "@lemonade/domain";

// Rejects illegal world state. Called by tests and after projections.
export function assertWorldInvariants(state: AppState): void {
  const { locations, residents } = state.town;
  const locationIds = new Set<string>(locations.map((location) => location.id));

  for (const resident of residents) {
    if (resident.role === "scout" && resident.assignable) {
      throw new Error("World invariant violated: Scout must not be assignable");
    }
    if (resident.role === "scout" && resident.projectId !== null) {
      throw new Error(
        "World invariant violated: Scout must never hold a project",
      );
    }
    if (!locationIds.has(resident.locationId)) {
      throw new Error(
        `World invariant violated: resident "${resident.id}" is at unknown location "${resident.locationId}"`,
      );
    }
    if (resident.projectId && !locationIds.has(resident.projectId)) {
      throw new Error(
        `World invariant violated: resident "${resident.id}" holds unknown project "${resident.projectId}"`,
      );
    }
  }

  const holders = residents.filter((resident) => resident.projectId !== null);
  const heldProjects = holders.map((resident) => resident.projectId);
  if (new Set(heldProjects).size !== heldProjects.length) {
    throw new Error(
      "World invariant violated: two residents hold the same project",
    );
  }

  for (const holder of holders) {
    const location = locations.find((l) => l.id === holder.projectId);
    if (location && location.state === "locked") {
      throw new Error(
        `World invariant violated: resident "${holder.id}" is assigned to locked location "${location.id}"`,
      );
    }
  }
}
