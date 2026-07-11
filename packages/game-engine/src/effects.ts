import type { LocationId } from "@lemonade/domain";

// Transient, ordered UI effects. The engine emits them; it never animates.
// Effects are advisory only and are never persisted or replayed.
export type UiEffect =
  | { type: "PROJECT_AVAILABLE"; locationId: LocationId }
  | { type: "RESIDENT_TRAVELLED"; residentId: string; locationId: LocationId }
  | { type: "LOCATION_ACTIVATED"; locationId: LocationId }
  | { type: "LOCATION_LIVED_IN"; locationId: LocationId };
