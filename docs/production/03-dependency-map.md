# Lemonade Dependency Map

> Status: target implementation contract  
> Update rule: any change to a file boundary, public symbol, package, environment variable, permission, schema, or asset identity must update this document and the change log in the same iteration.

## 1. Package Graph

### Implemented repository baseline

The Stage 1 baseline currently provides:

```text
package.json
  -> declares the private pnpm workspace and toolchain versions
pnpm-workspace.yaml
  -> discovers apps/* and packages/*
tsconfig.base.json
  -> supplies strict shared TypeScript compiler defaults
pnpm-lock.yaml
  -> records the pnpm 11 lockfile format before runtime dependencies are added
```

No runtime package dependency is installed at Stage 1. The application package graph below is introduced beginning in Stage 2.

### Implemented Stage 2 baseline

The current implementation now includes `apps/web`, `apps/extension`, `packages/domain`, `packages/game-engine`, `tests/e2e`, `playwright.config.ts`, and `vitest.config.ts`. Source-package exports point to TypeScript source and are consumed directly by Next.js/WXT; both shared packages are React-free.

Pinned dependencies are:

```text
root: TypeScript 6.0.3, Vitest 4.1.10, Playwright Test 1.61.1, Prettier 3.9.5
web: Next.js 16.2.10, React 19.2.7, Tailwind CSS 4.3.2, ESLint 9.39.4
extension: WXT 0.20.27, @wxt-dev/module-react 1.2.2, React 19.2.7
```

The Stage 2 extension manifest has no explicit permissions and matches only localhost/127.0.0.1 development pages. Detection, storage, and bridge permissions remain future-stage contracts.

### Implemented Stage 11 controlled detection and Scout

`apps/web/src/app/demo-store/page.tsx` is the deterministic Product/Offer JSON-LD storefront. `apps/extension/src/detection/product-detection.ts` exports `extractJsonLdProduct`, `extractOpenGraphProduct`, `extractSemanticProduct`, `calculateDetectionConfidence`, `detectProduct`, and `findPurchaseActions`; these read only public metadata and accessible purchase controls. `entrypoints/shopping.content.tsx` injects `ShoppingScout` through WXT Shadow Root UI. `shopping-scout.tsx` implements hidden/peeking/curious/prompting/paused states plus Pause/Continue/Snooze/Hide with session-scoped repeat suppression; no product is persisted in Stage 11. `entrypoints/options/index.html` documents actual privacy limits. The MV3 manifest explicitly has no permissions and remains localhost/127.0.0.1-only. Detector unit tests and unpacked-extension Chromium E2E live beside the implementation and in `tests/e2e/extension-scout.spec.ts`.

### Implemented Stage 12 exact-once bridge

Domain `IMPORT_DETECTED_PRODUCT` is implemented and import-ID idempotent; it creates a new extension-origin Cooling decision and `PRODUCT_IMPORTED_FROM_EXTENSION` event. `apps/extension/src/bridge/messages.ts` defines the pending handoff and STORE/GET/ACK protocol. The WXT background service worker is the only owner of `browser.storage.local`; `lemonade-bridge.content.ts` exposes only GET/ACK to the matching Lemonade page through request-ID-correlated `postMessage`. `apps/web/src/bridge/extension-bridge-client.ts` applies a bounded timeout, while `BridgeImportController` imports through the existing store command path, ACKs only after success, and then renders the non-authoritative Browser Gate return status. The manifest adds only `storage`; no tabs/history/account/payment scope exists.

### Implemented Stage 3 baseline

`packages/domain` now ships its first runtime dependency, `zod@4.4.3` (exact), and declares `"sideEffects": false` so unused schema modules tree-shake out of consumers. Implemented modules: `clock.ts` (`Clock`, `SystemClock`, `FixedClock`, `toIsoTimestamp`), `ids.ts` (`IdGenerator`, `SystemIdGenerator`, `DeterministicIdGenerator`), `schemas/` (primitives with `CURRENT_SCHEMA_VERSION = 1`, user-profile, goal, owned-item, purchase-decision, mission, reuse-commitment, planned-allocation, reflection with fixed `REFLECTION_XP = 10`, capture-template, town, app-state with `migrateAppState`), `events/domain-event.ts` (eleven-variant discriminated union), and `seed.ts` (`createSeedState`, `parseSeedData`). All exports flow through the `index.ts` barrel. Unit tests live in `packages/domain/src/*.test.ts`.

### Implemented Stage 4 baseline

Domain now also exports `commands/command.ts` (sixteen-variant `Command` union, `DetectedProduct`), `transaction.ts` (`executeCommand` with command-ID replay dedupe, `appendUniqueEvents`, `TransactionResult`, `TransactionError`, `CommandDependencies` with `createSeed`), and `repository.ts` (`LemonadeRepository`, `StateListener`, `RepositoryOptions`, `createCommandDependencies`, `InMemoryRepository`). Implemented handlers: `QUICK_ADD_OWNED_ITEM`, `RESET_DEMO`; the remaining commands return explicit `NOT_IMPLEMENTED` until Stages 5-8. `TransactionResult` intentionally omits an `effects` channel until Stage 8 introduces the first consumer.

`apps/web` adds `zustand@5.0.14` (exact), `src/repositories/web-local-repository.ts` (`WebLocalRepository`, `APP_STATE_STORAGE_KEY = "lemonade.app-state.v1"`, injectable `KeyValueStorage`), and `src/store/lemonade-store.ts` (`createLemonadeStore` exposing `status/appState/loadError/dispatch/resetDemo` only).

### Implemented Stage 5 baseline

`packages/domain/src/decision-machine.ts` implements `COOLING_HOURS = 24`, `DecisionTransitionEvent`, `transitionDecision` (explicit legal-transition table), `getDecisionReadiness` (ready exactly at `reviewAt`), `computeReviewAt`, and `markReady`. Transaction handlers implemented: `CAPTURE_DECISION`, `START_COOLING`, `RESOLVE_DECISION` (one fixed-XP Reflection per final review; optional Buy `addToMyStuff`), `EXTEND_COOLING`. `PurchaseDecision` gained optional `resolvedAt`; `ResolveDecisionCommand` gained optional `addToMyStuff`. `markReady` is an engine helper rather than a `Command`; Ready display state is derived through `getDecisionReadiness` until the Stage 10 review flow.

### Implemented Stage 9 web shell

`apps/web/src/app/page.tsx` dynamically loads the client-only `RepositoryProvider` with SSR disabled and renders `AppShell`; `next.config.ts` disables the development indicator so it cannot cover required mobile controls during browser verification. `apps/web/src/app/globals.css` defines the Tailwind 4 design tokens, global focus treatment, and system/manual reduced-motion rules. `assets/manifest.ts` supplies typed, layout-stable fallbacks and hotspot rectangles until Stage 13 art lands. `components/shell/` implements `AppShell`, `TopBar`, `NavRail`, `MobileBottomNav`, `CommandDeck`, `DecisionDock`, and the keyboard-operable three-state `MobileBottomSheet`. `components/world/` implements fallback-first `AssetTile`, `WorldStage`, and real-button `LocationHotspot`. Components consume `useLemonade`, `selectTownViewModel`, and web selectors without directly mutating domain/game truth. `tests/e2e/town-dashboard.spec.ts` and its two Chromium screenshot baselines cover the Stage 9 frontend contract.

### Implemented Stage 10 slice 1 (partial)

`apps/web/src/components/business/capture-flow.tsx` implements the manual Capture mode, Need/Replacement/Want classification, live deterministic same-job evidence, and `CAPTURE_DECISION` -> `START_COOLING` command sequence with an explicit real `reviewAt`. `AppShell` owns only the transient open/closed panel state; `CommandDeck` opens the flow. `handleCaptureDecision` now calls the existing domain `findSameJobMatches` rule and persists ranked `overlapItemIds`, keeping match truth out of React. Photo and Scout/extension modes are visible but disabled with truthful future-stage descriptions. E2E verifies the new Cooling decision survives refresh beside the separate seeded Ready decision.

### Implemented Stage 10 complete web business UX

`components/business/ready-review.tsx` orchestrates existing commands for Buy, reclassified Need, Use existing, Repair, Extend, repair mission offer/acceptance, reuse commitment, and optional `PLAN_ALLOCATION`; allocation is shown only after a skipped outcome and explicitly states that no money moves. `decisions-panel.tsx` renders Ready/Cooling/History and mission status/check-in/neutral cancellation. `my-stuff-panel.tsx` provides contextual `QUICK_ADD_OWNED_ITEM` plus the empty-state contract. Capture also supports a local-only Photo mode; files are neither uploaded nor persisted, while Scout prefill remains truthfully disabled until Stage 12. `AppShell` keeps the World Stage visible while business panels replace only the contextual deck and provides an invalid-import recovery alert. The Decision Dock and navigation select these contexts without bypassing the repository.

### Implemented Stage 8 baseline

Domain `transaction.ts` gained the injectable `TownEngine` interface plus the `TransientEffect` base type, and `TransactionResult` now includes `effects` (transient, never persisted). `createCommandDependencies(clock, ids, seedFactory?, townEngine?)` and `RepositoryOptions.townEngine` wire the engine in; `executeCommand` delegates town commands and idempotently projects events after every successful command. `packages/game-engine` implements `effects.ts` (`UiEffect`), `eligibility.ts` (`PROJECT_RECIPES`, `getEligibleProjects`), `projector.ts` (`projectBusinessEvent(s)`), `assignments.ts` (`previewAssignment`, `cancelAssignment`, `confirmTownPlan`), `simulate-cycle.ts` (`simulateCycle`), `invariants.ts` (`assertWorldInvariants`), `progression.ts` (`getProgression`, `XP_PER_LEVEL`), `selectors.ts` (`selectTownViewModel`), `town-engine.ts` (`createTownEngine`), with `"sideEffects": false`.

### Implemented Stage 7 baseline

`packages/domain/src/mission-machine.ts` implements the guarded mission machine (`transitionMission`, `getMissionReadiness`, `computeCheckInAt`, `MISSION_CHECK_IN_HOURS = 24`, `NON_TERMINAL_MISSION_STATUSES`). Transaction adds `MISSION_SLOTS = 2` plus handlers `OFFER_MISSION`, `ACCEPT_MISSION`, `COMPLETE_MISSION`, `CANCEL_MISSION`, `PLAN_ALLOCATION`. The `DomainEvent` union gained `MISSION_OFFERED` and `MISSION_CANCELLED` (every mutating command now emits an event carrying its `commandId` for replay dedupe). `calculateReflectionXp()` is exported from the reflection schema module and takes no inputs by design.

### Implemented Stage 6 baseline

`packages/domain/src/overlap.ts` implements job-led explainable matching: `scoreOwnedItemMatch` (job gate, weights job 0.55 / category 0.25 / condition <= 0.15), `getMatchConfidence` (0.35/0.6/0.8 thresholds), `findSameJobMatches` (ranked), `explainMatch`, with `MatchCandidate`/`MatchConfidence`/`OwnedItemMatch` types. Transaction adds the `COMMIT_REUSE` handler (ready/skipped decisions only; one commitment per decision; emits `REUSE_COMMITTED`).

```text
apps/web
  -> packages/domain
  -> packages/game-engine
  -> React / Next.js / Zustand / Motion / Zod / UI primitives

apps/extension
  -> packages/domain
  -> React / WXT / Zod

packages/game-engine
  -> packages/domain

packages/domain
  -> Zod
```

Forbidden reverse dependencies:

- `domain` must not import `game-engine`, React, Next.js, WXT, Zustand, Motion, DOM, or Node-only APIs.
- `game-engine` must not import React, Next.js, WXT, Zustand, Motion, DOM, or UI assets.
- extension detection must not import web components or web Zustand store.
- UI components must not become the source of business/game truth.

## 2. Target Repository Tree

```text
apps/
  web/
    public/
      world/
      characters/
      products/
      effects/
    src/
      app/
        page.tsx
        capture/page.tsx
        decisions/page.tsx
        decisions/[id]/page.tsx
        my-stuff/page.tsx
        goal/page.tsx
        shop-demo/page.tsx
        api/ai/extract-item/route.ts       # P1 only
      components/
        shell/
        world/
        companion/
        decisions/
        missions/
        my-stuff/
        town/
        ui/
      repositories/
        web-local-repository.ts
        extension-bridge-repository.ts
        repository-provider.tsx
      store/
        lemonade-store.ts
        selectors.ts
        hydration.ts
      effects/
        scene-director.tsx
        effect-runner.ts
      assets/
        manifest.ts
      lib/
        image-processing.ts
        format.ts
        env.ts
      styles/
        globals.css
        world.css
  extension/
    entrypoints/
      shopping.content.tsx
      lemonade-site.content.ts
      background.ts
      options.html
    src/
      detect/
      companion/
      bridge/
      repository/
      preferences/
packages/
  domain/
    src/
      schemas/
      commands/
      events/
      decision-machine.ts
      mission-machine.ts
      overlap.ts
      opportunity-cost.ts
      allocation.ts
      repository.ts
      transaction.ts
      clock.ts
      ids.ts
      seed.ts
      index.ts
  game-engine/
    src/
      state.ts
      projector.ts
      projects.ts
      eligibility.ts
      residents.ts
      assignments.ts
      simulate-cycle.ts
      progression.ts
      rewards.ts
      effects.ts
      invariants.ts
      selectors.ts
      index.ts
tests/
  e2e/
  fixtures/
docs/
  production/
```

## 3. Runtime Technology Dependencies

### Web

| Dependency | Purpose | Allowed scope | Must not own |
|---|---|---|---|
| Next.js App Router | routes, layouts, deployment, optional API route | `apps/web` | local domain mutations |
| React | UI composition | `apps/web`, `apps/extension` | financial/game rules |
| TypeScript strict | compile-time contracts | all code | runtime validation alone |
| Tailwind CSS | responsive layout and tokens | web/extension UI | game state |
| shadcn/Radix | accessible UI primitives | selected web controls | world art or business rules |
| Lucide React | standard icons | controls/navigation | custom character art |
| Zustand persist | hydrated web view/store | `apps/web` | independent business logic |
| Zod 4 | external-boundary validation | domain/web/extension | semantic correctness alone |
| Motion | visual effects and transitions | `apps/web`, extension companion | state mutation/progression |
| date-fns | display and date helpers | web/domain helper boundary | readiness without injected clock |
| React Hook Form | multi-step forms | web | domain validation replacement |
| Sonner | concise operational toasts | web | game celebration |

### Extension

| Dependency | Purpose | Allowed scope |
|---|---|---|
| WXT | content scripts, background, build, Shadow Root UI | `apps/extension` |
| browser/WXT storage | canonical local state when extension installed | extension repository |
| WXT/browser messaging | typed cross-context communication | extension bridge/background |

### Development

| Dependency | Purpose |
|---|---|
| Vitest | pure domain/game unit tests |
| Playwright Test | web E2E, screenshots, ARIA, controlled storefront |
| ESLint | correctness/style checks |
| Prettier | deterministic formatting |

### Optional P1

| Dependency | Purpose | Gate |
|---|---|---|
| groq-sdk | product image attribute suggestions | only after all P0 gates pass |

## 4. Core Domain Types

### User And Goal

```ts
type UserProfile = {
  id: string;
  displayName: string;
  currency: 'AUD';
  monthlyDiscretionaryPlan: number;
  coachingTone: 'gentle' | 'direct' | 'funny';
};

type Goal = {
  id: string;
  type: 'experience' | 'savings' | 'debt';
  name: string;
  targetAmount: number;
  startingAmount: number;
  plannedAllocationTotal: number;
};
```

### Owned Items

```ts
type OwnedItem = {
  id: string;
  name: string;
  imageRef?: string;
  category: string;
  colour?: string;
  useTags: string[];
  condition: 'good' | 'worn' | 'repairable' | 'broken' | 'unknown';
  repairNote?: string;
};
```

### Purchase Decision

```ts
type DecisionStatus =
  | 'draft'
  | 'assessed'
  | 'cooling'
  | 'ready'
  | 'bought'
  | 'skipped'
  | 'extended'
  | 'reclassified_need';

type DecisionOrigin = 'manual' | 'extension_import' | 'seeded_demo';

type PurchaseDecision = {
  id: string;
  name: string;
  imageRef?: string;
  sourceUrl?: string;
  merchant?: string;
  price: number;
  currency: 'AUD';
  category: string;
  job: string;
  motive: 'need' | 'replacement' | 'occasion' | 'mood' | 'sale' | 'trend';
  status: DecisionStatus;
  origin: DecisionOrigin; // keeps new Cooling visibly distinct from seeded Ready
  createdAt: string;
  reviewAt?: string; // required by schema when status is cooling/ready/extended
  overlapItemIds: string[];
  outcomeReason?: string;
};
```

### Mission

```ts
type MissionType =
  | 'TRY_EXISTING'
  | 'CLEAN_OR_RESTYLE'
  | 'REPAIR'
  | 'BORROW_OR_SHARE'
  | 'WAIT_AND_REFLECT';

type MissionStatus =
  | 'offered'
  | 'accepted'
  | 'active'
  | 'ready_for_checkin'
  | 'completed'
  | 'cancelled';

type Mission = {
  id: string;
  decisionId: string;
  ownedItemId?: string;
  type: MissionType;
  status: MissionStatus;
  acceptedAt?: string;
  checkInAt?: string;
  completedAt?: string;
};
```

### Financial Truth

```ts
type PlannedAllocation = {
  id: string;
  decisionId: string;
  goalId: string;
  amount: number;
  kind: 'planned';
  createdAt: string;
};
```

### Town And Residents

```ts
type LocationState = 'locked' | 'available' | 'assigned' | 'active' | 'lived_in';
type ResidentRole = 'scout' | 'mender' | 'host';

type ResidentState = {
  id: string;
  role: ResidentRole;
  assignable: boolean;
  locationId: string;
  projectId: string | null;
  activityId: string | null;
};
```

Scout must always have `assignable: false`.

## 5. Command Contracts

```ts
type Command =
  | CaptureDecisionCommand
  | StartCoolingCommand
  | ResolveDecisionCommand
  | ExtendCoolingCommand
  | QuickAddOwnedItemCommand
  | CommitReuseCommand
  | OfferMissionCommand
  | AcceptMissionCommand
  | CompleteMissionCommand
  | CancelMissionCommand
  | PlanAllocationCommand
  | ImportDetectedProductCommand
  | PreviewAssignmentCommand
  | CancelAssignmentCommand
  | ConfirmTownPlanCommand
  | SelectRewardCommand
  | ResetDemoCommand;
```

Only command handlers may produce persisted state changes.

## 6. Event Contracts

```ts
type DomainEvent =
  | DecisionCaptured
  | CoolingStarted
  | DecisionReviewed
  | OwnedItemAdded
  | ReuseCommitted
  | MissionAccepted
  | MissionCompleted
  | AllocationPlanned
  | ProductImportedFromExtension
  | TownPlanConfirmed
  | RewardSelected;
```

Every event requires:

- stable ID;
- timestamp;
- schema version;
- originating command ID where relevant.

## 7. Public Function Map

### Domain

| File | Function | Inputs | Output | Main callers |
|---|---|---|---|---|
| `decision-machine.ts` | `transitionDecision` | decision, transition event, clock | next decision | transaction handler, tests |
| `decision-machine.ts` | `getDecisionReadiness` | reviewAt, now | cooling/ready | selectors, tests |
| `mission-machine.ts` | `transitionMission` | mission, event, clock | next mission | command handler |
| `overlap.ts` | `scoreOwnedItemMatch` | candidate, owned item | score + reasons | Capture UX |
| `overlap.ts` | `findSameJobMatches` | candidate, owned items | ranked matches | Capture/Review |
| `allocation.ts` | `planAllocation` | decision, allocations, goal, amount | allocation + event | command handler |
| `transaction.ts` | `executeCommand` | state, command, dependencies | state/events/effects | repositories |
| `seed.ts` | `createSeedState` | clock/IDs | app seed | Reset/startup/tests |

### Game Engine

| File | Function | Purpose |
|---|---|---|
| `projector.ts` | `projectBusinessEvent` | idempotently convert business event into world eligibility/XP |
| `eligibility.ts` | `getEligibleProjects` | derive available projects from confirmed signals |
| `assignments.ts` | `previewAssignment` | reversible resident placement |
| `assignments.ts` | `confirmTownPlan` | validate and commit all assignments atomically |
| `simulate-cycle.ts` | `simulateCycle` | advance project/location/resident state and create effects |
| `invariants.ts` | `assertWorldInvariants` | reject illegal world state |
| `selectors.ts` | `selectTownViewModel` | produce UI-ready read model without mutation |

### Extension Detection

| File | Function | Purpose |
|---|---|---|
| `json-ld.ts` | `extractJsonLdProduct` | parse Product/Offer structured data |
| `open-graph.ts` | `extractOpenGraphProduct` | metadata fallback |
| `purchase-actions.ts` | `findPurchaseActions` | locate accessible Add to Cart intent |
| `confidence.ts` | `calculateDetectionConfidence` | none/low/medium/high gating |
| `handoff.ts` | `importDetectedProduct` | idempotent extension-to-web import |

## 8. Repository And Storage Dependencies

```ts
interface LemonadeRepository {
  load(): Promise<PersistedAppState>;
  transact(command: Command): Promise<TransactionResult>;
  subscribe(listener: StateListener): () => void;
  resetDemo(): Promise<PersistedAppState>;
}
```

Implementations:

- `WebLocalRepository`: one versioned localStorage root;
- `ExtensionRepository`: one versioned browser.storage root;
- `ExtensionBridgeRepository`: web adapter that uses typed extension bridge;
- `InMemoryRepository`: deterministic tests.

Persistence includes:

- business state;
- mission state;
- world state;
- processed event IDs;
- event log;
- schema version.

Persistence excludes:

- animation/effect queue;
- object URLs;
- open/closed sheets;
- hover/selection preview not yet confirmed;
- countdown display ticks.

## 9. UI Component Dependencies

### Shell

```text
AppShell
  -> TopBar
  -> NavRail / MobileBottomNav
  -> WorldStage
  -> CommandDeck / MobileBottomSheet
  -> DecisionDock
```

### World

```text
WorldStage
  -> AssetManifest
  -> LocationSprite
  -> ResidentSprite
  -> ScoutSprite
  -> LocationHotspot
  -> EffectLayer
  -> SceneDirector
```

### Business UI

```text
CaptureFlow
  -> ProductInput
  -> ClassificationStep
  -> SameJobMatchStep
  -> MissionOfferStep
  -> CoolingConfirmation

ReadyReview
  -> OriginalJob
  -> OwnedItemMatch
  -> MissionCheckIn
  -> OutcomeActions
  -> OptionalAllocationSheet
```

### Town UI

```text
TownPlanningPanel
  -> ResidentSelector(Mender, Host)
  -> EligibleLocationHotspots
  -> AssignmentPreview
  -> ConfirmTownPlan
```

## 10. Extension Message Dependencies

Use a typed discriminated message protocol:

```ts
type BridgeMessage =
  | { type: 'PING' }
  | { type: 'LOAD_STATE' }
  | { type: 'TRANSACT'; command: Command }
  | { type: 'SUBSCRIBE' }
  | { type: 'IMPORT_PRODUCT'; product: DetectedProduct };
```

Rules:

- only the Lemonade site bridge may expose state calls to the website;
- validate message origin and payload;
- time out and fall back safely;
- never expose arbitrary browser APIs to page JavaScript;
- deduplicate `IMPORT_PRODUCT` by import/command ID.

## 11. Asset Dependencies

### Required P0 Asset IDs

```text
world.town.base
world.home.active
world.browser-gate
world.workshop.locked
world.workshop.ready
world.workshop.active
world.picnic.ready
world.picnic.active-or-static
world.station.ready
world.station.active-or-static
character.scout.idle
character.scout.peek
character.scout.carry
character.scout.cooler
character.scout.acknowledge
character.mender.idle
character.mender.repair
character.host.idle
character.host.activity
product.sneakers.candidate
product.sneakers.owned
effect.paper-dust
effect.project-ready
effect.small-spark
```

Every asset entry requires:

- source path;
- intrinsic dimensions;
- anchor point;
- visual state;
- preload flag;
- meaningful/decorative alt policy;
- fallback ID.

## 12. Environment Variables

### P0

None required for the judged loop.

### P1

```text
GROQ_API_KEY=              # server only, never NEXT_PUBLIC
```

Do not add an environment variable without documenting:

- owner;
- runtime surface;
- required/optional status;
- local fallback;
- secret handling.

## 13. Browser Permissions

Minimum target:

- storage;
- controlled demo storefront host permission;
- Lemonade deployed-domain permission for the bridge;
- optional high-confidence generic sites only after user/site permission.

Do not request:

- history;
- downloads;
- clipboard by default;
- broad checkout/payment access;
- all URLs unless explicitly justified and approved.

## 14. Test Dependency Map

| Behaviour | Unit | E2E | Visual/manual |
|---|---:|---:|---:|
| decision transitions | required | seeded path | no |
| 24-hour boundary | required | one display path | timezone check |
| same-job overlap | required | sneakers flow | copy review |
| mission slots/conflict | required | one mission | no |
| allocation invariants | required | optional path | truth copy |
| event idempotency | required | refresh/import | no |
| resident scheduling | required | Workshop path | visual placement |
| extension extraction | required | controlled store | real browser |
| bridge import | required where possible | required | refresh/recovery |
| Scout return | no business unit | required state | screenshot/motion |
| mobile layout | no | required | screenshot |
| reduced motion | no | required | manual observation |
| Reset Demo | required seed equality | required | no |

## 15. Change Impact Checklist

Before changing any public type/function/file boundary, identify:

1. callers;
2. tests;
3. persisted schema/migration;
4. extension message compatibility;
5. seed fixtures;
6. UI selectors;
7. visual effects;
8. docs/change log;
9. deployment/runtime implications;
10. demo script impact.
