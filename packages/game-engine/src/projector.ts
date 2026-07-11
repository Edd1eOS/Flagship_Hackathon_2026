import type { AppState, DomainEvent } from "@lemonade/domain";

import type { UiEffect } from "./effects";
import { PROJECT_RECIPES } from "./eligibility";

export type ProjectionResult = { state: AppState; effects: UiEffect[] };

// Idempotently converts one business event into world eligibility.
// Already-processed event IDs never change state again.
export function projectBusinessEvent(
  state: AppState,
  event: DomainEvent,
): ProjectionResult {
  if (state.processedEventIds.includes(event.id)) {
    return { state, effects: [] };
  }

  const effects: UiEffect[] = [];
  let locations = state.town.locations;

  const recipe = PROJECT_RECIPES.find((r) => r.eventType === event.type);
  if (recipe) {
    locations = locations.map((location) => {
      if (location.id === recipe.locationId && location.state === "locked") {
        effects.push({
          type: "PROJECT_AVAILABLE",
          locationId: recipe.locationId,
        });
        return { ...location, state: "available" as const };
      }
      return location;
    });
  }

  return {
    state: {
      ...state,
      town: { ...state.town, locations },
      processedEventIds: [...state.processedEventIds, event.id],
    },
    effects,
  };
}

export function projectBusinessEvents(
  state: AppState,
  events: readonly DomainEvent[],
): ProjectionResult {
  let current = state;
  const effects: UiEffect[] = [];
  for (const event of events) {
    const result = projectBusinessEvent(current, event);
    current = result.state;
    effects.push(...result.effects);
  }
  return { state: current, effects };
}
