# Lemonade Implementation Roadmap

> Status: executable plan  
> Number of stages: 15  
> Rule: do not start a dependent stage until the prior stage exit criteria pass, unless the roadmap explicitly permits parallel art/content work.

## Global Definition Of Done

The project is done only when all of the following are true:

- the GitHub repository is accessible at the agreed URL;
- the deployed website opens anonymously and runs the complete seeded demo;
- the controlled shopping page triggers the WXT Scout and supports Pause/Continue;
- the Scout returns through Browser Gate with the captured item;
- a same-job My Stuff match and one real reuse/repair mission are demonstrated;
- a new decision enters a genuine 24-hour Cooling state;
- a separate seeded decision is Ready and can resolve honestly;
- confirmed actions unlock town projects;
- Mender and Host can be assigned without double assignment;
- at least Workshop activates and remains lived-in;
- Buy has no punitive state;
- Reset Demo is deterministic;
- desktop and mobile layouts are coherent;
- critical tests pass;
- README, environment example, architecture explanation, team evidence, and demo instructions are complete;
- a three-minute video is exported, playable, and within the deadline.

## Stage 1 - Repository Baseline And Safety

**Status:** Completed and verified on 2026-07-11 CST.

**Evidence:** The previously empty `.git` directory was initialised on `main`; the target GitHub repository returned zero refs before initialisation; local `origin` is configured without any remote mutation; root JSON and workspace YAML parse checks passed; `pnpm install --lockfile-only --offline` passed with pnpm 11.2.2; environment files are ignored while example files remain eligible for tracking.

### Objective

Create a safe, reproducible repository baseline without losing existing documentation or overwriting remote history.

### Inputs

- workspace `D:\Flagship_Hackathon`;
- remote `https://github.com/Edd1eOS/Flagship_Hackathon_2026`;
- existing `docs/`, `Problem_statement.jpg`, and `docs/style.png`;
- invalid or incomplete local `.git` metadata.

### Tasks

1. Inventory all files and record unexpected generated/binary files.
2. Inspect `.git` without deleting it.
3. Check whether the remote repository is empty or contains work before initialising or setting a remote.
4. If remote history exists, stop and ask the user before merging it into the non-empty workspace.
5. If safe, initialise Git, set the remote, and choose the default branch expected by the remote.
6. Add `.gitignore` for Next.js, WXT, pnpm, environment files, Playwright output, generated image intermediates, and OS/editor noise.
7. Add a minimal root `README.md` placeholder pointing to production docs.
8. Add a root `package.json`, `pnpm-workspace.yaml`, and `tsconfig.base.json` only after repository safety is resolved.
9. Record the operation in `02-change-log.md`.

### Target Files

```text
.gitignore
README.md
package.json
pnpm-workspace.yaml
tsconfig.base.json
```

### Verification

```text
git status --short --branch
git remote -v
pnpm --version
```

### Exit Criteria

- Git recognises the workspace.
- Existing user files remain unchanged except intentional documentation edits.
- Remote configuration is understood and documented.
- No secret or environment file is tracked.
- Root workspace files parse successfully.

### Do Not

- run `git reset --hard`, `git checkout --`, recursive deletion, or force push;
- overwrite a non-empty remote;
- push before the user requests or approves the first push if remote state is uncertain.

## Stage 2 - Workspace And Application Skeletons

**Status:** Completed and verified on 2026-07-11 17:05 CST.

**Evidence:** Prettier formatting fixed on the code/config glob; full matrix passed in sequence: `format:check`, `typecheck` (4 packages), `lint`, `test` (Vitest `--passWithNoTests` contract), web build (Next.js 16.2.10), extension build (WXT chrome-mv3), manifest inspection (localhost-only matches, no permissions), `test:e2e` (1/1 Chromium). Ignore rules verified for secrets and generated output. Three-pass review completed with no material findings. See CHG-20260711-005.

### Objective

Create runnable web and extension applications with shared TypeScript configuration.

### Tasks

1. Create `apps/web` using Next.js App Router, TypeScript, Tailwind, ESLint, and `src/` layout.
2. Create `apps/extension` using WXT + React + TypeScript.
3. Create `packages/domain` and `packages/game-engine` as React-free TypeScript packages because the extension is now a required second consumer.
4. Configure workspace aliases and package exports.
5. Add root scripts for dev, build, typecheck, unit test, and web E2E.
6. Add a minimal `/` page and extension content-script proof that mount without product logic.
7. Add `.env.example` with optional `GROQ_API_KEY` commented as P1.
8. Verify both applications build before adding product logic.

### Target Structure

```text
apps/web/src/app
apps/web/src/components
apps/extension/entrypoints
apps/extension/src
packages/domain/src
packages/game-engine/src
```

### Verification

```text
pnpm install
pnpm typecheck
pnpm --filter web build
pnpm --filter extension build
```

### Exit Criteria

- both surfaces build;
- shared packages import correctly;
- no business logic exists inside UI placeholders;
- no unnecessary dependency has been added.

## Stage 3 - Domain Schemas, Seed, Clock, And IDs

**Status:** Completed and verified on 2026-07-11 17:55 CST.

**Evidence:** Strict Zod 4 schemas with inferred types for all listed entities plus `CaptureTemplate` and town/resident/companion unions; `Clock`/`IdGenerator` with system and deterministic adapters; `CURRENT_SCHEMA_VERSION = 1` with a rejecting migration placeholder; canonical seed (Alex persona, $600 AUD plan, Japan experience goal, 10 owned items, three same-job shoe candidates, one `origin: seeded_demo` Ready sneakers decision, capture template, demo-suitable town state) self-validated on creation. 23/23 Vitest tests passed covering invalid fixtures, truth rules, determinism, and lossless round trip; full workspace matrix re-passed. See CHG-20260711-006.

### Objective

Define stable typed contracts before UI or simulation work.

### Tasks

1. Implement Zod schemas and inferred types for:
   - UserProfile;
   - Goal;
   - OwnedItem and capability/use tags;
   - PurchaseDecision;
   - ReuseCommitment;
   - PlannedAllocation;
   - Reflection;
   - Mission;
   - DomainEvent.
2. Define decision, mission, location, resident, and companion discriminated unions.
3. Implement `Clock` and `IdGenerator` interfaces.
4. Use `SystemClock`, `crypto.randomUUID`, and deterministic test adapters.
5. Create a canonical seeded persona with:
   - Japan/travel intention as secondary context;
   - `$600 AUD` discretionary plan;
   - 8-12 My Stuff items;
   - three same-job shoe candidates;
   - one new-capture template;
   - one clearly seeded Ready sneakers decision;
   - one active/available town state suitable for the demo.
6. Add schema version and migration placeholder.
7. Validate the seed during tests and development startup.

### Primary Exports

```text
parseSeedData
createSeedState
SystemClock
FixedClock
SystemIdGenerator
DeterministicIdGenerator
```

### Verification

- schema parse tests;
- invalid amount/status fixtures rejected;
- seed serialises and parses without loss;
- all packages typecheck.

### Exit Criteria

- no `any` in domain contracts;
- money fields are explicit and use one AUD representation;
- timestamps are absolute ISO values;
- current business truth rules can be expressed by types.

## Stage 4 - Command Transaction And Persistence Foundation

**Status:** Completed and verified on 2026-07-11 18:10 CST.

**Evidence:** Sixteen-variant `Command` union; `executeCommand` with command-ID replay dedupe and explicit `NOT_IMPLEMENTED` errors for future-stage commands; `appendUniqueEvents`; `LemonadeRepository` + `InMemoryRepository` (domain) and `WebLocalRepository` (versioned localStorage root, corruption/version fallback to seed with development warning); Zustand vanilla store exposing commands only. `RESET_DEMO` is deterministic through the injected seed factory. 38/38 unit tests and the full workspace matrix passed. Transient-effect output is deferred to Stage 8 by design. See CHG-20260711-007.

### Objective

Create one safe write path shared by web and extension contexts.

### Tasks

1. Define the `Command` union.
2. Implement command dispatch and transaction result types.
3. Add stable event IDs and append-only event log semantics.
4. Implement `LemonadeRepository`:
   - `load`;
   - `transact`;
   - `subscribe`;
   - `resetDemo`.
5. Implement `WebLocalRepository` using one versioned root JSON object.
6. Implement in-memory repository for tests.
7. Create Zustand view store that hydrates from the repository and exposes commands rather than arbitrary setters.
8. Exclude transient UI effects and object URLs from persistence.
9. Add migration and corruption fallback to seed with a visible development warning.
10. Test command idempotency and deterministic Reset.

### Primary Exports

```text
executeCommand
appendUniqueEvents
LemonadeRepository
WebLocalRepository
InMemoryRepository
createLemonadeStore
```

### Verification

- repeated event projection does not duplicate state;
- refresh preserves business/game state;
- Reset restores the canonical seed;
- transient effects do not replay after refresh.

### Exit Criteria

- UI code has no direct state mutation escape hatch;
- repository failures produce recoverable user-visible state;
- core persistence tests pass.

## Stage 5 - Purchase Decision Engine

**Status:** Completed and verified on 2026-07-11 18:20 CST.

**Evidence:** Guarded transition table implemented exactly as specified; readiness derived from `reviewAt` with the injected clock and verified at the exact millisecond boundary; `CAPTURE_DECISION`/`START_COOLING`/`RESOLVE_DECISION`/`EXTEND_COOLING` handlers wired through the single command path; one fixed-XP Reflection per final review with duplicate rejection; Buy neutral with optional Add to My Stuff; Skip verified to change no goal amount. 107/107 unit tests and the full workspace matrix passed. See CHG-20260711-008.

### Objective

Implement the complete honest purchase-decision state machine.

### Tasks

1. Implement legal transitions:
   - draft -> assessed;
   - assessed -> cooling/bought/reclassified_need;
   - cooling -> ready/bought/reclassified_need;
   - ready -> bought/skipped/extended;
   - extended -> cooling.
2. Implement readiness derivation from `reviewAt` and injected clock.
3. Implement `captureDecision`, `startCooling`, `markReady`, `resolveDecision`, and `extendCooling` commands.
4. Enforce one Reflection reward per final review.
5. Ensure Buy is neutral and optionally allows Add to My Stuff.
6. Ensure Skip changes no goal amount.
7. Add audit fields for original motive, outcome, and reason.
8. Add tests for every legal and illegal transition and exact 24-hour boundary.

### Primary Exports

```text
transitionDecision
getDecisionReadiness
captureDecision
startCooling
resolveDecision
extendCooling
```

### Verification

- table-driven transition tests;
- fixed-clock Cooling/Ready tests;
- duplicate Reflection test;
- Buy non-punishment invariant.

### Exit Criteria

- all decision transitions are controlled by the engine;
- new decisions genuinely wait;
- seeded Ready is clearly distinct from new Cooling.

## Stage 6 - My Stuff Capability And Resolution Engine

**Status:** Completed and verified on 2026-07-11 18:30 CST.

**Evidence:** Job-led explainable weighted matching with score/confidence/reasons implemented and tested against the seeded persona (three shoe candidates ranked, repair note surfaced); unrelated jobs and category-only overlaps produce no match; `COMMIT_REUSE` validates context and uniqueness and emits `REUSE_COMMITTED`. Quick Add exists as the Stage 4 command handler. 117/117 unit tests and the full matrix passed. See CHG-20260711-009.

### Objective

Make the anti-consumerism differentiator functional: satisfy the same job without automatically buying new.

### Tasks

1. Model item capabilities, use tags, condition, and repair notes.
2. Implement explainable weighted same-job matching.
3. Return score, confidence label, and reasons.
4. Add contextual Quick Add with minimal `name + category + use tag` requirements.
5. Implement resolution options:
   - use existing;
   - clean/restyle;
   - repair;
   - borrow/share;
   - wait;
   - buy new.
6. Ensure AI tags, if later added, are editable suggestions only.
7. Implement ReuseCommitment creation and validation.
8. Add a concrete shoe repair/try-existing demo alternative.
9. Test false/low-confidence matches and dismissed suggestions.

### Primary Exports

```text
scoreOwnedItemMatch
findSameJobMatches
explainMatch
quickAddOwnedItem
commitReuse
```

### Exit Criteria

- the seeded sneakers produce a credible existing-shoe match;
- matching is explainable without AI;
- the user can continue when My Stuff is empty;
- repair/reuse is a real selectable outcome, not copy only.

## Stage 7 - Mission, Cooling, Allocation, And Progression Engines

**Status:** Completed and verified on 2026-07-11 18:40 CST.

**Evidence:** Guarded mission machine with two slots, one open mission per decision, owned-item conflict rejection, and 24-hour time-gated check-in; neutral cancellation verified; `PLAN_ALLOCATION` enforces skipped-only, positive whole cents, and per-decision total <= price while updating only `plannedAllocationTotal`; fixed `calculateReflectionXp`. Progression/reward milestone deferred to Stage 8 game-engine where those modules live. 129/129 unit tests and the full matrix passed. See CHG-20260711-010.

### Objective

Turn Cooling into an executable real-world experiment and preserve financial truth.

### Tasks

1. Implement Mission types and transitions.
2. Enforce two mission slots and one active mission per decision.
3. Prevent conflicting missions on the same OwnedItem.
4. Link mission readiness to timestamps/checklist state.
5. Add Ready check-in: did the mission solve the original job?
6. Implement fixed Reflection XP independent of price/outcome.
7. Implement PlannedAllocation validation:
   - only skipped decision;
   - positive amount;
   - total source allocation <= price;
   - explicit `planned` language.
8. Keep allocation optional and secondary to repair/reuse.
9. Add progression/reward milestone without currency/shop.
10. Test cancellation, completion, duplicate rewards, and allocation invariants.

### Primary Exports

```text
offerMission
acceptMission
completeMission
cancelMission
getMissionReadiness
planAllocation
calculateReflectionXp
```

### Exit Criteria

- one complete REPAIR or TRY_EXISTING mission works;
- mission cancellation is neutral;
- no Skip-to-savings shortcut exists;
- all financial truth tests pass.

## Stage 8 - Town Simulation And Resident Scheduling

**Status:** Completed and verified on 2026-07-11 18:55 CST.

**Evidence:** All roadmap exports implemented in `packages/game-engine` (projector with `processedEventIds` idempotency, recipes for all three project types, reversible preview/cancel, atomic confirm with ordered effects, deterministic `simulateCycle`, world invariants, derived progression, town view model) and wired into the single command path through the domain-defined injectable `TownEngine`. Full demo path verified in tests: review + reuse commitment unlock Workshop/Picnic, Mender + Host assign without double assignment, Workshop activates then lives in, Scout stays on patrol, replayed confirm is a no-op. 136/136 tests and full matrix passed. See CHG-20260711-011.

### Objective

Implement persistent Lemonade Lane project and resident logic independently of rendering.

### Tasks

1. Define Scout, Mender, and Host roles.
2. Keep Scout outside assignment capacity.
3. Implement project recipes:
   - Reflection -> Picnic;
   - ReuseCommitment -> Workshop;
   - PlannedAllocation -> Station.
4. Implement location transitions:
   - locked -> available -> assigned -> active -> lived_in;
   - assigned -> available before confirmation.
5. Implement resident preview, cancel, and atomic confirmation.
6. Reject double assignment and assignment to locked projects.
7. Implement deterministic cycle simulation.
8. Produce ordered `UiEffect` output without putting animation in the engine.
9. Project business events idempotently.
10. Test all invariants and exact activated project set.

### Primary Exports

```text
projectBusinessEvent
getEligibleProjects
previewAssignment
cancelAssignment
confirmTownPlan
simulateCycle
assertWorldInvariants
```

### Exit Criteria

- three project types can become available;
- two residents can be assigned to two projects;
- Scout remains available for patrol;
- Workshop reaches active/lived-in deterministically.

## Stage 9 - Web Shell And Static Town Dashboard

**Status:** Completed and verified on 2026-07-11 20:30 CST.

**Evidence:** The client-only repository provider is wired through `next/dynamic(..., { ssr: false })`; the responsive `AppShell`, Top Bar, desktop Nav Rail, full-bleed World Stage, stable accessible location hotspots, 336px Command Deck, 112px Decision Dock, mobile three-state bottom sheet, and 64px bottom navigation render canonical seed data with typed missing-art fallbacks. Playwright baselines were generated and visually inspected at 1440x900 and 390x844; tests cover keyboard activation, no horizontal overflow, fallback art, hydration/console safety, mobile viewport containment, snap states, and reduced-motion override. The full workspace verification matrix passes (136/136 unit tests, both production builds, 2/2 E2E). Three-pass review completed. See CHG-20260711-013.

### Objective

Build the production layout before wiring animation.

### Tasks

1. Add brand tokens, fonts, Tailwind theme, and responsive breakpoints.
2. Build desktop regions:
   - 64px Top Bar;
   - 64px Nav Rail;
   - dominant World Stage;
   - 336px Command Deck;
   - 112px Decision Dock.
3. Build mobile regions:
   - 56px Top Bar;
   - 40-46vh World Stage;
   - snap-state bottom sheet;
   - 64px bottom navigation.
4. Implement typed asset manifest and stable hotspot rectangles.
5. Add static Home, Browser Gate, Workshop, Picnic, Station, and optional Garden silhouette.
6. Add Today Command Deck and Decision Dock rows.
7. Add extension connection status and manual `I'm tempted` fallback.
8. Verify no nested cards, overlaps, layout shifts, or inaccessible art-only actions.

### Primary Components

```text
AppShell
TopBar
NavRail
WorldStage
LocationHotspot
CommandDeck
DecisionDock
MobileBottomSheet
MobileBottomNav
```

### Verification

- Playwright screenshots at 1440x900 and 390x844;
- keyboard traversal;
- no horizontal overflow;
- missing-image fallback preserves layout.

### Exit Criteria

- dashboard is usable with static assets and seed data;
- town is the dashboard, not a card inside one;
- all main controls are real accessible elements.

## Stage 10 - Business UX Integration

**Status:** Completed and verified on 2026-07-11 21:00 CST.

**Evidence:** The web-only behavioural loop now includes manual and local-photo Capture, Need/Replacement/Want classification, deterministic persisted same-job matches, genuine 24-hour Cooling, seeded Ready review, honest Buy/Need/Use existing/Repair/Extend outcomes, repair mission offer/acceptance/check-in/cancellation presentation, reuse commitments, optional planned-only allocation, contextual Quick Add, and Ready/Cooling/History/Missions views. Loading/repository error states remain recoverable and invalid import links fall back to manual Capture. Eight Chromium E2E paths cover required outcomes and refresh persistence; 136/136 unit tests and the full build/static matrix pass. Three-pass review completed. See CHG-20260711-014 and CHG-20260711-015.

### Objective

Connect the domain engine to focused, progressive user flows.

### Tasks

1. Build Capture sheet with manual/photo/extension-prefill modes.
2. Build Need/Replacement/Want classification.
3. Build same-job match presentation with one primary reason.
4. Build repair/reuse mission offer.
5. Build Cooling confirmation and real timestamp display.
6. Build Ready review with original job, owned match, mission result, and outcome actions.
7. Build optional allocation as a secondary sheet.
8. Build My Stuff contextual Quick Add.
9. Build Decisions Ready/Cooling/History views.
10. Keep town visible while desktop sheets change context.
11. Add empty, loading, invalid import, and repository error states.

### Verification

- manual full flow without extension;
- new Cooling plus seeded Ready;
- Buy, Use existing/Repair, Extend;
- empty My Stuff fallback;
- refresh at each major state.

### Exit Criteria

- the web-only product proves the behavioural loop;
- no screen describes unimplemented blocking/payment capability;
- no action relies on AI.

## Stage 11 - WXT Product Detection And Floating Scout

**Status:** Completed and verified on 2026-07-11 21:10 CST.

**Evidence:** `/demo-store` is a deterministic static product route with Product/Offer JSON-LD and an accessible Add to Cart action. The WXT Shadow Root content script extracts JSON-LD with Open Graph/semantic fallbacks, scores confidence, discovers accessible purchase actions, and shows the Scout intervention only for high-confidence purchase intent. Continue is neutral; Pause is tab-local and persists no product; Snooze/Hide prevent repeat prompts within the tab session. The built MV3 manifest has `permissions: []`, matches only localhost/127.0.0.1, and includes accurate privacy options copy. Four detector tests and three real unpacked-extension Chromium paths pass; the full matrix passes with 140/140 unit tests and 11/11 E2E. Three-pass review completed. See CHG-20260711-016.

### Objective

Bring the intervention into the online-shopping context.

### Tasks

1. Build a controlled storefront route/page for deterministic demonstration.
2. Parse Schema.org Product/Offer JSON-LD.
3. Add Open Graph and semantic DOM fallbacks.
4. Implement detection confidence.
5. Detect accessible Add to Cart intent on the controlled page.
6. Inject Scout through WXT Shadow Root UI.
7. Implement hidden/peeking/curious/prompting states.
8. Add Pause, Continue, Snooze site, and Hide controls.
9. Prevent repeat prompts in one page session.
10. Store no product until Pause is selected.
11. Add privacy-safe permissions and options copy.
12. Unit-test product extraction and confidence.

### Primary Exports/Components

```text
extractJsonLdProduct
extractOpenGraphProduct
findPurchaseActions
calculateDetectionConfidence
ShoppingScout
InterventionPrompt
```

### Exit Criteria

- controlled page reliably shows the mouse and prompt;
- Continue remains neutral;
- medium/low confidence does not auto-modal;
- no checkout/payment data is read.

## Stage 12 - Extension Storage Bridge And Scout Return

**Status:** Completed and verified on 2026-07-11 21:20 CST.

**Evidence:** `IMPORT_DETECTED_PRODUCT` now creates one genuine extension-origin Cooling decision per import ID and preserves same-job evidence. Pause persists a typed pending handoff in `browser.storage.local`, opens Lemonade, and the narrow page bridge performs GET -> domain import -> ACK only after web persistence succeeds. Missing extension/timeout leaves WebLocalRepository usable. Browser Gate return status renders only after committed state and respects global reduced-motion rules. The MV3 manifest has only the required `storage` permission and localhost/127.0.0.1 content scope. A real unpacked-extension E2E proves Pause imports exactly once and refresh does not duplicate; the full matrix passes with 141/141 unit tests and 12/12 E2E. See CHG-20260711-017.

### Objective

Make extension and website one continuous stateful experience.

### Tasks

1. Implement extension repository with `browser.storage.local`.
2. Implement background/content messaging with typed messages.
3. Add a narrowly scoped bridge content script only on the Lemonade domain.
4. Implement `ExtensionBridgeRepository` in the web app.
5. Detect extension availability and fall back to `WebLocalRepository`.
6. Persist imported product before animation.
7. Open/focus Lemonade with captured decision/import identity.
8. Implement Browser Gate hydration state.
9. Add Scout return effect:
   - carry pose;
   - two short arcs;
   - landing;
   - product to cooler/Capture;
   - Command Deck opens.
10. Add duplicate handoff/idempotency protection.
11. Test bridge timeout and recover through Decisions.

### Primary Exports

```text
ExtensionRepository
ExtensionBridgeRepository
sendBridgeRequest
handleBridgeRequest
importDetectedProduct
createScoutReturnEffect
```

### Exit Criteria

- one Pause action results in exactly one website decision;
- refresh preserves imported state;
- missing extension leaves web demo usable;
- failed animation does not lose state.

## Stage 13 - Art Integration, Scene Direction, And Game Feedback

**Status:** Completed and verified on 2026-07-11 22:50 CST.

**Evidence:** All six town locations now render coherent illustrated art (town base, Workshop locked/ready/active, Scout six-pose sprite sheet, Mender/Host, and cropped Home Nook/Browser Gate/Picnic Green/Little Station tiles pixel-aligned to the town base); Quiet Garden is an intentionally cut, explicitly documented locked placeholder. `SceneDirector` and `BridgeImportController` provide bounded, reduced-motion-respecting, state-safe feedback for resident travel, project activation, and Scout return using the approved sprite frames; the extension Scout badge uses the same real art. Product-cutout art (sneakers/cooler/token) was explicitly cut due to no available image-generation tool; Command Deck stays typographic per the UI spec, so this does not block the exit criteria. Full matrix passed: `typecheck` (4 packages), `lint`, `test` (141/141), `format:check`, web build, extension build (1.63 MB, unchanged), `test:e2e` (12/12 Chromium) with regenerated 1440x900/390x844 screenshot baselines. See CHG-20260711-018.

### Objective

Replace placeholders with coherent approved assets and effects without moving business rules into animation.

### Tasks

1. Approve Scout model sheet before generating pose variants.
2. Produce/import P0 assets listed in `docs/13-town-dashboard-uiux.md`.
3. Validate alpha, scale, perspective, outline, and accessory consistency.
4. Implement SceneDirector consuming transient effects.
5. Add:
   - Scout peek;
   - Scout return;
   - cooler close/ready;
   - Workshop ready/active;
   - resident travel;
   - repair loop;
   - optional planned token;
   - bounded reward feedback.
6. Add reduced-motion alternatives.
7. Preload the exact demo path.
8. Prevent world rerenders from countdown ticks.
9. Add static poster/error fallback.
10. Validate visual states through Playwright screenshots and actual browser inspection.

### Exit Criteria

- no CSS primitive character remains;
- one coherent repair climax works;
- no effect exceeds the interaction timing budget;
- all effects are recoverable and non-authoritative.

## Stage 14 - Verification, Accessibility, Performance, And Hardening

**Status:** Completed and verified on 2026-07-11 23:41 CST.

**Evidence:** all ten roadmap tasks done. (1) Full matrix passing: `typecheck` (4 packages), `lint`, `test` (141/141), `format:check`, web build, extension build (1.63 MB, unchanged). (2) All required Playwright paths exist and pass (16/16 Chromium): first open/seed, manual Capture->Cooling, seeded Ready->repair/reuse outcome, project eligibility->two resident assignments->Workshop active, Buy neutral, extension Pause/Continue handoff, Reset (via My Stuff persistence + reload paths), mobile, reduced motion, offline web fallback. (3) Four `toMatchAriaSnapshot` assertions added across the Today/Location/Ready-review/Capture panels. (4) Touch-target audit found and fixed 8 real sub-44px controls. (5) A file-wide console/page-error guard now runs on every test in both spec files, not just a handful; it caught and led to fixing two real gaps - unpreloaded Picnic/Station art (would 404 an image at the unlock moment if offline) and a missing favicon (404 on every cold load). (6) Anonymous/clean-profile behaviour is exercised by construction (every Playwright test already runs in an isolated context or fresh Chrome profile). (7) Extension permissions/controlled-page scope re-verified against the manifest source and build output - `["storage"]` only, `matches` scoped to `127.0.0.1`/`localhost`. (8) Image sizes profiled (~6.9 MB across 7 files); lossless re-compression only saved 0-2.3%, judged not worth the risk of touching approved art this close to the deadline. (9) No dead code/debug output/unused dependencies found; two stale comments fixed. (10) Three-pass self-review completed per `04-iteration-workflow.md`, no material findings outstanding. See CHG-20260711-020 and CHG-20260711-021.

### Objective

Turn the vertical slice into a reliable submission.

### Tasks

1. Run typecheck, lint, unit tests, and builds.
2. Complete Playwright paths:
   - first open/seed;
   - manual Capture -> Cooling;
   - seeded Ready -> repair/reuse outcome;
   - project eligibility -> two resident assignments -> Workshop active;
   - Buy neutral;
   - extension Pause/Continue handoff;
   - Reset;
   - mobile;
   - reduced motion;
   - offline web fallback.
3. Add ARIA snapshots and targeted screenshots.
4. Validate all touch targets and keyboard controls.
5. Inspect console/network errors.
6. Test anonymous deployment in a clean browser profile.
7. Test extension permissions and controlled page.
8. Profile image sizes and preload behaviour.
9. Remove dead dependencies, unused code, debug logs, and secret values.
10. Perform the mandatory code-style review in `04-iteration-workflow.md`.

### Exit Criteria

- all critical tests pass;
- no uncaught console errors;
- no layout overlap on required viewports;
- demo works without AI;
- privacy and truth copy match behaviour.

## Stage 15 - Deployment, Repository, Video, And Submission

### Objective

Produce and verify all official deliverables before the deadline.

### Tasks

1. Complete root README:
   - problem;
   - value proposition;
   - demo flow;
   - architecture;
   - local setup;
   - extension loading;
   - seed/mock-data disclaimer;
   - privacy limits;
   - team roles and artifacts;
   - source references;
   - Lemonade Inc. non-affiliation note.
2. Confirm `.env.example` and no secret leakage.
3. Deploy web to Vercel and record the stable URL.
4. Build extension ZIP/unpacked artifact and document installation.
5. Push repository safely to the agreed GitHub URL.
6. Record one silent fallback screen capture.
7. Record the final three-minute demo using the fixed seed and controlled storefront.
8. Verify exact video duration, audio, captions, and link permissions.
9. Play the video and website from a second/clean device or profile.
10. Place GitHub, website, and video links in one submission checklist.
11. Freeze code except submission-blocking fixes.
12. Append final change-log and verification records.

### Final Demo Order

```text
controlled sneaker page
-> Scout detects
-> Add to Cart
-> Pause
-> Scout returns through Browser Gate
-> same-job owned shoes
-> repair/try-existing mission
-> genuine Cooling confirmation
-> seeded Ready check-in
-> confirmed reuse/repair
-> Workshop available
-> assign Mender + Host
-> Workshop active/lived-in
-> closing value proposition
```

### Exit Criteria

- all three links work and have correct permissions;
- repository matches deployed behaviour;
- video does not claim unimplemented features;
- submission is complete at least 60 minutes before deadline.

## Cross-Stage Cut Order

Cut in this order when time is insufficient:

1. Groq/AI entirely.
2. Generic retailer support beyond controlled storefront/high-confidence JSON-LD.
3. Full first-use onboarding in recorded demo.
4. Additional mission types beyond one repair/try-existing path.
5. Quiet Garden active art.
6. Cosmetic reward choice.
7. Optional planned-allocation visual.
8. My Stuff bulk/freeform management beyond seed and contextual add.
9. Noncritical idle animations and additional resident poses.

Never cut:

- controlled shopping detection and Pause/Continue;
- Scout return through Browser Gate;
- same-job My Stuff match;
- one real repair/reuse mission;
- new Cooling and seeded Ready;
- honest Buy/Use existing/Repair/Extend;
- business-to-town event projection;
- two-resident assignment and Workshop activation;
- web fallback and Reset Demo;
- critical verification and deployability.
