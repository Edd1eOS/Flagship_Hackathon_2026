import type { AppState } from "@lemonade/domain";

import type { UiEffect } from "./effects";

// Deterministic world cycle: active projects settle into lived-in life.
// Locations are processed in their stored order, so output is stable.
export function simulateCycle(state: AppState): {
  state: AppState;
  effects: UiEffect[];
} {
  const effects: UiEffect[] = [];
  const locations = state.town.locations.map((location) => {
    if (location.state === "active") {
      effects.push({ type: "LOCATION_LIVED_IN", locationId: location.id });
      return { ...location, state: "lived_in" as const };
    }
    return location;
  });

  if (effects.length === 0) {
    return { state, effects };
  }
  return {
    state: { ...state, town: { ...state.town, locations } },
    effects,
  };
}
