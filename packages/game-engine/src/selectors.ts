import type { AppState, CompanionMode, TownLocation } from "@lemonade/domain";

import { getEligibleProjects, type EligibleProject } from "./eligibility";
import { getProgression } from "./progression";

export type TownResidentView = {
  id: string;
  role: string;
  assignable: boolean;
  locationId: string;
  projectId: string | null;
  activityId: string | null;
};

export type TownViewModel = {
  locations: TownLocation[];
  residents: TownResidentView[];
  scoutMode: CompanionMode;
  eligibleProjects: EligibleProject[];
  progression: { totalXp: number; level: number };
};

// Read model only; never mutates or persists anything.
export function selectTownViewModel(state: AppState): TownViewModel {
  return {
    locations: state.town.locations,
    residents: state.town.residents,
    scoutMode: state.town.scoutMode,
    eligibleProjects: getEligibleProjects(state),
    progression: getProgression(state),
  };
}
