import type { AppState, DomainEvent, LocationId } from "@lemonade/domain";

// Confirmed business signals unlock town projects. AI never decides this.
export const PROJECT_RECIPES: ReadonlyArray<{
  eventType: DomainEvent["type"];
  locationId: LocationId;
  reason: string;
}> = [
  {
    eventType: "DECISION_REVIEWED",
    locationId: "picnic_green",
    reason: "You completed an honest decision review",
  },
  {
    eventType: "REUSE_COMMITTED",
    locationId: "workshop",
    reason: "You committed to reusing or repairing something you own",
  },
  {
    eventType: "ALLOCATION_PLANNED",
    locationId: "little_station",
    reason: "You planned money toward an experience goal",
  },
];

export type EligibleProject = {
  locationId: LocationId;
  state: "available" | "assigned";
  reason: string;
};

export function getEligibleProjects(state: AppState): EligibleProject[] {
  return state.town.locations
    .filter(
      (location) =>
        location.state === "available" || location.state === "assigned",
    )
    .map((location) => ({
      locationId: location.id,
      state: location.state as "available" | "assigned",
      reason:
        PROJECT_RECIPES.find((recipe) => recipe.locationId === location.id)
          ?.reason ?? "Ready for a resident",
    }));
}
