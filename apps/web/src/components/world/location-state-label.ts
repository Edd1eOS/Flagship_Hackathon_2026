import type { LocationState } from "@lemonade/domain";

export const LOCATION_STATE_LABEL: Record<LocationState, string> = {
  locked: "Locked",
  available: "Available",
  assigned: "Assigned",
  active: "Active",
  lived_in: "Lived in",
};
