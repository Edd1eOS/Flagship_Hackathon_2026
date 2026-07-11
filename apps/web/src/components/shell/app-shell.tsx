"use client";

import type { LocationId } from "@lemonade/domain";
import { selectTownViewModel } from "@lemonade/game-engine";
import { useMemo, useState } from "react";

import { LOCATION_HOTSPOTS } from "../../assets/manifest";
import { formatAud } from "../../lib/format";
import { useMotionPreference } from "../../lib/use-motion-preference";
import { useLemonade } from "../../repositories/repository-provider";
import {
  selectCoolingDecisions,
  selectOpenMissions,
  selectReadyDecisions,
} from "../../store/selectors";
import { WorldStage } from "../world/world-stage";
import { CaptureFlow } from "../business/capture-flow";
import { ReadyReview } from "../business/ready-review";
import { DecisionsPanel } from "../business/decisions-panel";
import { MyStuffPanel } from "../business/my-stuff-panel";
import { CommandDeck, type SelectedLocationContext } from "./command-deck";
import { DecisionDock } from "./decision-dock";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileBottomSheet } from "./mobile-bottom-sheet";
import { NavRail } from "./nav-rail";
import type { NavId } from "./nav-items";
import { TopBar } from "./top-bar";
import { SceneDirector } from "../../effects/scene-director";

const PATROL_LABEL = "Extension not connected";
const ASSIGNABLE_PROJECT_LOCATIONS: readonly LocationId[] = [
  "workshop",
  "picnic_green",
  "little_station",
  "quiet_garden",
];

export function AppShell() {
  const status = useLemonade((state) => state.status);
  const appState = useLemonade((state) => state.appState);
  const loadError = useLemonade((state) => state.loadError);
  const resetDemo = useLemonade((state) => state.resetDemo);
  const dispatch = useLemonade((state) => state.dispatch);

  const [activeNav, setActiveNav] = useState<NavId>("town");
  const [selectedLocationId, setSelectedLocationId] =
    useState<LocationId | null>(null);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [reviewDecisionId, setReviewDecisionId] = useState<string | null>(null);
  const [invalidImport, setInvalidImport] = useState(() =>
    Boolean(new URLSearchParams(window.location.search).get("import")),
  );
  const [motionOverride, setMotionOverride] = useMotionPreference();

  const townViewModel = useMemo(
    () => (appState ? selectTownViewModel(appState) : null),
    [appState],
  );
  const readyDecisions = useMemo(
    () => (appState ? selectReadyDecisions(appState) : []),
    [appState],
  );
  const coolingDecisions = useMemo(
    () => (appState ? selectCoolingDecisions(appState) : []),
    [appState],
  );
  const openMissions = useMemo(
    () => (appState ? selectOpenMissions(appState) : []),
    [appState],
  );

  const goal = appState?.goals[0] ?? null;

  const selectedLocation: SelectedLocationContext | null = useMemo(() => {
    if (!selectedLocationId || !townViewModel) return null;
    const location = townViewModel.locations.find(
      (candidate) => candidate.id === selectedLocationId,
    );
    if (!location) return null;
    const hotspot = LOCATION_HOTSPOTS[selectedLocationId];
    const reason = ASSIGNABLE_PROJECT_LOCATIONS.includes(selectedLocationId)
      ? (townViewModel.eligibleProjects.find(
          (project) => project.locationId === selectedLocationId,
        )?.reason ?? null)
      : null;
    return {
      id: selectedLocationId,
      label: hotspot.label,
      blurb: hotspot.blurb,
      state: location.state,
      reason,
    };
  }, [selectedLocationId, townViewModel]);

  if (status === "loading" || !appState || !townViewModel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)]">
        <p className="text-sm font-semibold text-[var(--color-ink)]/70">
          Loading Lemonade Lane…
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-paper)] px-6 text-center">
        <p className="text-sm font-semibold text-[var(--color-coral)]">
          Lemonade Lane could not load: {loadError}
        </p>
        <button
          type="button"
          onClick={() => void resetDemo()}
          className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-bold text-white"
        >
          Reset Demo
        </button>
      </div>
    );
  }

  const worldStage = (
    <WorldStage
      locations={townViewModel.locations}
      selectedLocationId={selectedLocationId}
      onSelectLocation={setSelectedLocationId}
    />
  );

  const reviewDecision = reviewDecisionId
    ? (appState.decisions.find(
        (decision) => decision.id === reviewDecisionId,
      ) ?? null)
    : null;

  const townCommandDeck = captureOpen ? (
    <CaptureFlow
      ownedItems={appState.ownedItems}
      dispatch={dispatch}
      onClose={() => setCaptureOpen(false)}
    />
  ) : reviewDecision ? (
    <ReadyReview
      decision={reviewDecision}
      ownedItems={appState.ownedItems}
      missions={appState.missions}
      goals={appState.goals}
      dispatch={dispatch}
      onClose={() => setReviewDecisionId(null)}
    />
  ) : (
    <CommandDeck
      readyDecisions={readyDecisions}
      openMissions={openMissions}
      residents={townViewModel.residents}
      patrolLabel={PATROL_LABEL}
      selectedLocation={selectedLocation}
      onClearSelection={() => setSelectedLocationId(null)}
      onStartCapture={() => {
        setSelectedLocationId(null);
        setReviewDecisionId(null);
        setCaptureOpen(true);
      }}
      onReviewDecision={(decisionId) => {
        setSelectedLocationId(null);
        setCaptureOpen(false);
        setReviewDecisionId(decisionId);
      }}
    />
  );

  const contextualDeck =
    activeNav === "decisions" ? (
      <DecisionsPanel
        decisions={appState.decisions}
        missions={appState.missions}
        dispatch={dispatch}
        onReview={(decisionId) => {
          setReviewDecisionId(decisionId);
          setActiveNav("town");
        }}
      />
    ) : activeNav === "my-stuff" ? (
      <MyStuffPanel items={appState.ownedItems} dispatch={dispatch} />
    ) : (
      townCommandDeck
    );

  const decisionDock = (
    <DecisionDock
      readyDecisions={readyDecisions}
      coolingDecisions={coolingDecisions}
      openMissions={openMissions}
      onSelectReady={() => setActiveNav("decisions")}
      onSelectCooling={() => setActiveNav("decisions")}
      onSelectMissions={() => setActiveNav("decisions")}
    />
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-paper)]">
      {invalidImport ? (
        <div
          role="alert"
          className="absolute left-1/2 top-16 z-30 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-[var(--color-coral)] bg-[var(--color-paper)] px-4 py-3 text-sm shadow-lg"
        >
          <span>
            This import link is not valid. Manual Capture is still available.
          </span>
          <button
            type="button"
            onClick={() => setInvalidImport(false)}
            className="font-bold underline"
          >
            Dismiss
          </button>
        </div>
      ) : null}
      <TopBar
        profileName={appState.profile.displayName}
        goalName={goal?.name ?? null}
        goalDetail={
          goal
            ? `Starting balance ${formatAud(goal.startingAmount)} of ${formatAud(
                goal.targetAmount,
              )} · ${formatAud(goal.plannedAllocationTotal)} planned so far`
            : null
        }
        patrolLabel={PATROL_LABEL}
        motionOverride={motionOverride}
        onMotionOverrideChange={setMotionOverride}
      />
      <SceneDirector />

      <div className="flex min-h-0 flex-1">
        <NavRail
          active={activeNav}
          onSelect={setActiveNav}
          patrolLabel={PATROL_LABEL}
        />

        <div className="flex min-h-0 flex-1 flex-col">
          {activeNav !== "goal" ? (
            <>
              <div className="hidden min-h-0 flex-1 lg:flex">
                <div className="relative min-h-0 flex-1">{worldStage}</div>
                {contextualDeck}
              </div>
              <div className="hidden lg:block">{decisionDock}</div>

              <div className="flex min-h-0 flex-1 flex-col lg:hidden">
                <div className="relative h-[42vh] min-h-[240px] shrink-0">
                  {worldStage}
                </div>
                <MobileBottomSheet header={decisionDock}>
                  {contextualDeck}
                </MobileBottomSheet>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center px-6 text-center">
              <p className="text-sm text-[var(--color-ink)]/60">
                This section opens later in the build.
              </p>
            </div>
          )}
        </div>
      </div>

      <MobileBottomNav active={activeNav} onSelect={setActiveNav} />
    </div>
  );
}
