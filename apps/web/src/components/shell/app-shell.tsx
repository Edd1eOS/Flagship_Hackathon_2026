"use client";

import type { LocationId } from "@lemonade/domain";
import {
  getProgression,
  selectTownViewModel,
  XP_PER_LEVEL,
} from "@lemonade/game-engine";
import { useEffect, useMemo, useState } from "react";

import { LOCATION_HOTSPOTS } from "../../assets/manifest";
import { formatAud } from "../../lib/format";
import { preloadWorldImages } from "../../lib/preload-assets";
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
import { GoalPanel } from "../business/goal-panel";
import { MyStuffPanel } from "../business/my-stuff-panel";
import {
  CommandDeck,
  type ResidentRow,
  type SelectedLocationContext,
} from "./command-deck";
import { DecisionDock } from "./decision-dock";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileBottomSheet } from "./mobile-bottom-sheet";
import { NavRail } from "./nav-rail";
import { OnboardingModal } from "./onboarding-modal";
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

// What unlocks each still-locked location, shown so a first-time visitor
// isn't left guessing why tapping a locked building does nothing.
const LOCKED_UNLOCK_HINTS: Partial<Record<LocationId, string>> = {
  workshop:
    'Repair or reuse something you already own from a "Ready" decision to unlock this.',
  picnic_green: 'Complete an honest "Ready" decision review to unlock this.',
  little_station:
    "Plan part of a skipped purchase toward your goal to unlock this.",
  quiet_garden: "Not part of this build yet.",
};

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
  const [onboardingOpen, setOnboardingOpen] = useState(
    () =>
      window.localStorage.getItem("lemonade.onboarding-dismissed") !== "true",
  );
  const [motionOverride, setMotionOverride] = useMotionPreference();
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(
    null,
  );
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [assignmentWorking, setAssignmentWorking] = useState(false);

  useEffect(() => {
    preloadWorldImages();
  }, []);

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
  const progression = useMemo(
    () => (appState ? getProgression(appState) : { totalXp: 0, level: 1 }),
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
    const lockedHint =
      location.state === "locked"
        ? (LOCKED_UNLOCK_HINTS[selectedLocationId] ?? null)
        : null;
    return {
      id: selectedLocationId,
      label: hotspot.label,
      blurb: hotspot.blurb,
      state: location.state,
      reason,
      lockedHint,
    };
  }, [selectedLocationId, townViewModel]);

  const residentRows: ResidentRow[] = useMemo(() => {
    if (!townViewModel) return [];
    return townViewModel.residents
      .filter((resident) => resident.role !== "scout")
      .map((resident) => {
        const location = resident.projectId
          ? townViewModel.locations.find(
              (candidate) => candidate.id === resident.projectId,
            )
          : null;
        return {
          id: resident.id,
          role: resident.role,
          locationLabel: location ? LOCATION_HOTSPOTS[location.id].label : null,
          isPreview: location?.state === "assigned",
          isActive:
            location?.state === "active" || location?.state === "lived_in",
        };
      });
  }, [townViewModel]);

  const eligibleLocationIds: readonly LocationId[] = useMemo(() => {
    if (!selectedResidentId || !townViewModel) return [];
    return townViewModel.locations
      .filter((location) => ASSIGNABLE_PROJECT_LOCATIONS.includes(location.id))
      .filter((location) => {
        if (location.state === "available") return true;
        if (location.state === "assigned") {
          const holder = townViewModel.residents.find(
            (resident) => resident.projectId === location.id,
          );
          return holder?.id === selectedResidentId;
        }
        return false;
      })
      .map((location) => location.id);
  }, [selectedResidentId, townViewModel]);

  const previewedAssignments = useMemo(() => {
    if (!townViewModel) return [];
    return townViewModel.residents
      .filter((resident) => resident.role !== "scout" && resident.projectId)
      .filter(
        (resident) =>
          townViewModel.locations.find(
            (candidate) => candidate.id === resident.projectId,
          )?.state === "assigned",
      )
      .map((resident) => ({
        residentId: resident.id,
        locationId: resident.projectId as LocationId,
      }));
  }, [townViewModel]);

  function handleSelectResident(residentId: string) {
    setAssignmentError(null);
    setSelectedLocationId(null);
    setSelectedResidentId((current) =>
      current === residentId ? null : residentId,
    );
  }

  async function handleCancelAssignment(residentId: string) {
    setAssignmentWorking(true);
    setAssignmentError(null);
    const result = await dispatch({
      type: "CANCEL_ASSIGNMENT",
      commandId: crypto.randomUUID(),
      residentId,
    });
    setAssignmentWorking(false);
    if (!result.ok) {
      setAssignmentError(result.error.message);
      return;
    }
    setSelectedResidentId((current) =>
      current === residentId ? null : current,
    );
  }

  async function handleConfirmPlan() {
    if (previewedAssignments.length === 0) return;
    setAssignmentWorking(true);
    setAssignmentError(null);
    const result = await dispatch({
      type: "CONFIRM_TOWN_PLAN",
      commandId: crypto.randomUUID(),
      assignments: previewedAssignments,
    });
    setAssignmentWorking(false);
    if (!result.ok) setAssignmentError(result.error.message);
  }

  async function handleSelectLocation(locationId: LocationId) {
    if (selectedResidentId) {
      if (!eligibleLocationIds.includes(locationId)) return;
      setAssignmentWorking(true);
      setAssignmentError(null);
      const result = await dispatch({
        type: "PREVIEW_ASSIGNMENT",
        commandId: crypto.randomUUID(),
        residentId: selectedResidentId,
        locationId,
      });
      setAssignmentWorking(false);
      if (!result.ok) {
        setAssignmentError(result.error.message);
        return;
      }
      setSelectedResidentId(null);
      return;
    }
    setSelectedLocationId(locationId);
  }

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
          className="min-h-11 rounded-full bg-[var(--color-ink)] px-4 text-sm font-bold text-white"
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
      eligibleLocationIds={eligibleLocationIds}
      onSelectLocation={(locationId) => void handleSelectLocation(locationId)}
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
      residentRows={residentRows}
      selectedResidentId={selectedResidentId}
      canConfirmPlan={previewedAssignments.length > 0}
      assignmentWorking={assignmentWorking}
      assignmentError={assignmentError}
      patrolLabel={PATROL_LABEL}
      selectedLocation={selectedLocation}
      onClearSelection={() => setSelectedLocationId(null)}
      onStartCapture={() => {
        setSelectedLocationId(null);
        setSelectedResidentId(null);
        setReviewDecisionId(null);
        setCaptureOpen(true);
      }}
      onReviewDecision={(decisionId) => {
        setSelectedLocationId(null);
        setSelectedResidentId(null);
        setCaptureOpen(false);
        setReviewDecisionId(decisionId);
      }}
      onSelectResident={handleSelectResident}
      onCancelAssignment={(residentId) =>
        void handleCancelAssignment(residentId)
      }
      onConfirmPlan={() => void handleConfirmPlan()}
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
    ) : activeNav === "goal" ? (
      <GoalPanel
        goal={goal}
        plannedAllocations={appState.plannedAllocations}
        decisions={appState.decisions}
      />
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
            className="flex min-h-11 items-center font-bold underline"
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
        level={progression.level}
        totalXp={progression.totalXp}
        xpPerLevel={XP_PER_LEVEL}
        patrolLabel={PATROL_LABEL}
        motionOverride={motionOverride}
        onMotionOverrideChange={setMotionOverride}
        onShowHelp={() => setOnboardingOpen(true)}
        onResetDemo={() => void resetDemo()}
      />
      {onboardingOpen ? (
        <OnboardingModal
          onClose={() => {
            window.localStorage.setItem(
              "lemonade.onboarding-dismissed",
              "true",
            );
            setOnboardingOpen(false);
          }}
        />
      ) : null}
      <SceneDirector />

      <div className="flex min-h-0 flex-1">
        <NavRail
          active={activeNav}
          onSelect={setActiveNav}
          patrolLabel={PATROL_LABEL}
        />

        <div className="flex min-h-0 flex-1 flex-col">
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
        </div>
      </div>

      <MobileBottomNav active={activeNav} onSelect={setActiveNav} />
    </div>
  );
}
