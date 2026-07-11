# Lemonade Implementation Agent Handoff

> **Current implementation handoff: 2026-07-11 22:50 CST.** This section supersedes every earlier handoff, including the Stage 2 close-out section retained further below for history. Resume from the exact state described here; do not restart product ideation or repeat Stages 1-13.

> **Interruption note:** the agent that completed Stages 1-12 and most of Stage 13's asset generation (art files, manifest wiring for Workshop/Scout/Mender/Host, `SceneDirector`, `BridgeImportController`, extension Scout art) was interrupted before writing a change-log entry or updating this handoff. A resuming agent audited the working tree against the docs, found the undocumented-but-working Stage 13 groundwork plus one real regression (Home Nook/Browser Gate/Picnic Green/Little Station rendered nothing, not even a placeholder, because `world-stage.tsx` returned `null` for them), fixed it, and closed out Stage 13. See CHG-20260711-018 for the full account.

## 0. Current Resume Point

### Stage status

- Stage 1: **completed and verified**.
- Stage 2: **completed and verified**.
- Stage 3: **completed and verified** (domain schemas, seed, clock, IDs).
- Stage 4: **completed and verified** (command transaction and persistence foundation).
- Stage 5: **completed and verified** (purchase decision engine).
- Stage 6: **completed and verified** (same-job matching and reuse commitment).
- Stage 7: **completed and verified** (mission, allocation, reflection engines).
- Stage 8: **completed and verified** (town simulation and resident scheduling).
- Stage 9: **completed and verified** (responsive static town dashboard and browser evidence).
- Stage 10: **completed and verified** (complete web-only business loop).
- Stage 11: **completed and verified** (controlled storefront, confidence-gated WXT Scout, privacy controls).
- Stage 12: **completed and verified** (exact-once storage bridge and state-safe Scout return).
- Stage 13: **completed and verified** (art integration, scene feedback; product-cutout art explicitly cut, no image-generation tool available).
- Stage 14: **completed and verified** (resident-to-project assignment UI, full required Playwright path set including first-open/seed and offline fallback, ARIA snapshots, touch-target fixes, file-wide console-error guard, preload/favicon fixes it caught, dependency/dead-code audit, three-pass self-review - see CHG-20260711-020 and CHG-20260711-021).
- Stage 15: not started.

Read `docs/production/02-change-log.md` entries `CHG-20260711-001` through `CHG-20260711-018` for the exact evidence behind every stage above. Read `docs/production/01-implementation-roadmap.md` for the per-stage Status/Evidence lines, which are kept current.

### Git and remote safety

- Working directory: `D:\Flagship_Hackathon`.
- Local Git is valid on branch `main`, tracking `origin/main`.
- Local `origin`: `https://github.com/Edd1eOS/Flagship_Hackathon_2026.git`.
- Three commits exist and are pushed to `main`: the initial Stage 1-13 commit `d73cc176af9eb580401ab616e1ad5a90efd63d36` (CHG-20260711-019), the Stage 14 assignment-UI commit (CHG-20260711-020), and the Stage 14 hardening-pass commit (CHG-20260711-021) - see `git log --oneline` for the exact current hashes, which this doc does not duplicate to avoid going stale.
- The user has established a working pattern this session: push after each verified iteration, always preceded by a fresh `git ls-remote` check. Continue that pattern for Stage 14/15 follow-up work; treat genuinely new categories of remote mutation (force push, branch changes, rewriting history) as still requiring explicit authorisation.
- Re-check the remote (`git ls-remote`) immediately before any further push because external state can change between sessions.
- Never delete `.git`, force push, rewrite history, or use destructive Git commands.

### Toolchain

```text
Corepack pnpm 11.11.0
TypeScript 6.0.3
Next.js 16.2.10 (Turbopack)
React / React DOM 19.2.7
Tailwind CSS / @tailwindcss/postcss 4.3.2
ESLint 9.39.4 / eslint-config-next 16.2.10
WXT 0.20.27 / @wxt-dev/module-react 1.2.2
Vitest 4.1.10
Playwright Test 1.61.1
Prettier 3.9.5
zod 4.4.3 (packages/domain)
zustand 5.0.14 (apps/web)
lucide-react (apps/web, exact version pinned in package.json)
```

Always invoke package scripts through `corepack pnpm ...`. Node.js `>=22`. `pnpm-workspace.yaml` keeps `verifyDepsBeforeRun: warn`, `enableGlobalVirtualStore: false`, and explicit `allowBuilds` decisions - do not change these without re-reading `docs/production/02-change-log.md` CHG-20260711-003/004 for why.

### What exists right now (by package)

**`packages/domain`** (React-free, `zod` is its only runtime dependency, `"sideEffects": false`):

- `clock.ts`: `Clock`, `SystemClock`, `FixedClock` (with `advanceByMinutes`), `toIsoTimestamp`.
- `ids.ts`: `IdGenerator`, `SystemIdGenerator`, `DeterministicIdGenerator`.
- `schemas/*`: strict Zod schemas + inferred types for `UserProfile`, `Goal`, `OwnedItem`, `PurchaseDecision` (has `origin: 'manual'|'extension_import'|'seeded_demo'` and optional `resolvedAt`), `Mission`, `ReuseCommitment`, `PlannedAllocation`, `Reflection` (fixed `REFLECTION_XP = 10`, `calculateReflectionXp()`), `CaptureTemplate`, town/resident/location unions, `AppState` root schema with cross-entity truth-rule refinements and `migrateAppState`.
- `events/domain-event.ts`: full discriminated `DomainEvent` union (13 variants) with `commandId` on every mutating event for replay dedupe.
- `commands/command.ts`: full 16-variant `Command` union.
- `decision-machine.ts`: guarded `transitionDecision`, `getDecisionReadiness`, `computeReviewAt` (`COOLING_HOURS = 24`), `markReady`.
- `mission-machine.ts`: guarded `transitionMission`, `getMissionReadiness`, `computeCheckInAt` (`MISSION_CHECK_IN_HOURS = 24`), `NON_TERMINAL_MISSION_STATUSES`.
- `overlap.ts`: job-led `scoreOwnedItemMatch`, `getMatchConfidence`, `findSameJobMatches`, `explainMatch`.
- `transaction.ts`: `executeCommand` implementing **every** command except `IMPORT_DETECTED_PRODUCT` and `SELECT_REWARD` (those two still return `NOT_IMPLEMENTED`); command-ID replay dedupe; `appendUniqueEvents`; the injectable `TownEngine` interface (`handleCommand`/`projectEvents`) so domain never imports `game-engine`; `TransientEffect`/`effects` channel on `TransactionResult`.
- `repository.ts`: `LemonadeRepository` interface, `InMemoryRepository`, `createCommandDependencies(clock, ids, seedFactory?, townEngine?)`.
- `seed.ts`: `createSeedState`, `parseSeedData` - canonical persona "Alex", AUD, $600 discretionary plan, Japan trip goal, 10 owned items (3 same-job shoe candidates), one `origin: seeded_demo` **Ready** sneakers decision (createdAt 26h ago, reviewAt 2h ago), one capture template, town with Home lived-in / Gate available / rest locked, Scout unassignable+patrol, Mender+Host assignable.
- Tests: `*.test.ts` colocated with source, 136 tests total across the whole workspace (all in `packages/domain` and `packages/game-engine`; `apps/web` has 3 more test files but they run in the same `vitest run` count - see exact split below).

**`packages/game-engine`** (`"sideEffects": false`, depends only on `@lemonade/domain`):

- `effects.ts`: `UiEffect` union (`PROJECT_AVAILABLE`, `RESIDENT_TRAVELLED`, `LOCATION_ACTIVATED`, `LOCATION_LIVED_IN`).
- `eligibility.ts`: `PROJECT_RECIPES` (`DECISION_REVIEWED` -> Picnic, `REUSE_COMMITTED` -> Workshop, `ALLOCATION_PLANNED` -> Station), `getEligibleProjects`.
- `projector.ts`: `projectBusinessEvent(s)` - idempotent via `processedEventIds`.
- `assignments.ts`: `previewAssignment`, `cancelAssignment`, `confirmTownPlan` (atomic, ordered effects, Scout rejected, locked/held locations rejected).
- `simulate-cycle.ts`: deterministic `simulateCycle` (active -> lived_in).
- `invariants.ts`: `assertWorldInvariants`.
- `progression.ts`: `getProgression`, `XP_PER_LEVEL = 30` (derived only, no currency/shop).
- `selectors.ts`: `selectTownViewModel`.
- `town-engine.ts`: `createTownEngine()` - the concrete `TownEngine` handling `PREVIEW_ASSIGNMENT`/`CANCEL_ASSIGNMENT`/`CONFIRM_TOWN_PLAN` and event projection; this is what gets passed into `createCommandDependencies`/`RepositoryOptions.townEngine`.

**`apps/web`**:

- Next.js App Router renders the production `AppShell`; `page.tsx` loads `RepositoryProvider` through `next/dynamic(..., { ssr: false })`, so its `window.localStorage` initializer never executes during server rendering.
- `src/repositories/web-local-repository.ts`: `WebLocalRepository` (versioned `localStorage` root key `lemonade.app-state.v1`, corruption/version fallback to seed with a dev `console.warn`).
- `src/repositories/repository-provider.tsx`: `RepositoryProvider` + `useLemonade` - client-only lazy singleton, exercised in Chromium without hydration or console errors.
- `src/store/lemonade-store.ts`: `createLemonadeStore` (Zustand vanilla; `status/appState/loadError/uiEffects/dispatch/resetDemo/consumeUiEffect` only, no raw setters). `dispatch` also queues `TransientEffect`s from `TransactionResult.effects` for `SceneDirector`.
- `src/store/selectors.ts`: `selectReadyDecisions`, `selectCoolingDecisions` (sorted by nearest `reviewAt`), `selectOpenMissions`.
- `src/assets/manifest.ts`: `ASSET_MANIFEST` (`WorldAssetId` -> `AssetEntry`) and `CHARACTER_MANIFEST` (`CharacterAssetId` -> sprite-sheet frame) - all P0 world/character art is wired to real files under `public/art/`; only `world.picnic.*`/`world.station.*` before unlock and Quiet Garden stay on the tinted fallback (locked, no dedicated art needed per the P0 scope). `LOCATION_HOTSPOTS` (`LocationId` -> percentage `HotspotRect` + label/blurb) - visually validated against the town-base composite via Playwright screenshots.
- `components/shell/*` and `components/world/*`: responsive Top Bar/Nav/World/Command Deck/Decision Dock/mobile sheet shell with accessible hotspots; `world/asset-tile.tsx` renders real art, sprite-sheet crops, or a tinted fallback depending on `AssetEntry.src`.
- `components/business/*`: `capture-flow.tsx`, `decisions-panel.tsx`, `my-stuff-panel.tsx`, `ready-review.tsx` - the full text-first Command Deck business loop (Capture, Review, Decisions, My Stuff); intentionally typographic per `docs/13-town-dashboard-uiux.md` sections 8/13, no illustrated product cutouts.
- `components/bridge/bridge-import-controller.tsx`: waits for repository hydration, dispatches `IMPORT_DETECTED_PRODUCT` from a pending extension handoff, ACKs it, then shows a state-safe "Scout returning / landed" status using `scout.carry` art.
- `src/effects/scene-director.tsx`: consumes `LemonadeStoreState.uiEffects` (one at a time, auto-dismiss after 1s) and renders a bounded status toast with `scout.acknowledge`/`mender.repair` art for `PROJECT_AVAILABLE`/`RESIDENT_TRAVELLED`/`LOCATION_ACTIVATED`/`LOCATION_LIVED_IN`; mounted in `app-shell.tsx`.
- `src/bridge/extension-bridge-client.ts`: typed `sendBridgeRequest` used by `BridgeImportController`.
- `src/lib/use-motion-preference.ts`: resolves system `prefers-reduced-motion` plus a manual "always reduce" override into `document.documentElement.dataset.motion`, which `globals.css` uses to hard-zero animation/transition durations independent of Tailwind's `motion-safe:` utility.
- `app/demo-store/page.tsx`: the controlled static Cloudstep sneaker storefront used by the extension E2E paths.
- `globals.css`: Tailwind 4 `@theme` block with `--color-paper/cream/ink/lemon/leaf/coral/sky/line`, `--font-display`, `--font-sans`; global `:focus-visible` ring; system and manual reduced-motion support.
- `public/art/`: `lemonade-lane-town.png` (town base), `scout-sheet.png` and `workshop-residents-sheet.png` (3x2 character/state sprite sheets), plus `home-nook.png`/`browser-gate.png`/`picnic-green.png`/`little-station.png` (cropped from the town base at the exact `LOCATION_HOTSPOTS` rects). Unused chroma-key source files live in `docs/production/art-source/`, outside the shipped bundle.

**`apps/extension`**: WXT React, Shadow Root. `src/detection/product-detection.ts` extracts JSON-LD/Open Graph/semantic product data and scores confidence; `src/companion/shopping-scout.tsx` is the real `ShoppingScout` (hidden/peeking/curious/prompting/paused states) using `scout-sheet.png`, with Pause/Continue anyway/Snooze/Hide; `src/bridge/messages.ts` plus the WXT background handle `STORE_HANDOFF`/`GET_PENDING_HANDOFF`/`ACK_HANDOFF` over `storage`. Manifest permissions: `["storage"]`; content-script match scope: `http://127.0.0.1/*` and `http://localhost/*` only.

**`tests/e2e/town-dashboard.spec.ts`**: twelve Chromium paths (first open/seed with zero action taken, desktop/mobile dashboard stability with saved 1440x900/390x844 baselines regenerated after the Stage 14 touch-target pass, manual Capture, Buy/Use-existing/Extend outcomes, repair+allocation, resident-to-project assignment confirm and cancel, offline-after-load business loop, My Stuff/invalid-import fallback) covering hydration/console safety, keyboard activation, horizontal overflow, mobile snap states, reduced motion, and four `toMatchAriaSnapshot` checks. A file-wide `beforeEach`/`afterEach` fails any test that raises an uncaught console error or page exception, not just the ones that check explicitly.

**`tests/e2e/extension-scout.spec.ts`**: four Chromium paths loading the real unpacked extension - high-confidence prompt, Pause tab-local + Hide, Snooze, and the full Pause -> storage -> web import -> ACK -> return -> refresh handoff (asserts exactly one decision is created). Every test now also asserts zero uncaught console errors via a `trackConsoleErrors` helper.

### Exact current test count

`corepack pnpm test` (Vitest, `--passWithNoTests`): **141 tests passing** across these files:
`packages/domain/src/schemas.test.ts`, `seed.test.ts`, `transaction.test.ts`, `decision-machine.test.ts`, `decision-commands.test.ts`, `overlap.test.ts`, `mission-commands.test.ts`, `import-command.test.ts`; `packages/game-engine/src/town.test.ts`; `apps/web/src/repositories/web-local-repository.test.ts`, `apps/web/src/store/lemonade-store.test.ts`; `apps/extension/src/detection/product-detection.test.ts`.

### Verification last run (2026-07-11 23:41 CST) - all PASS

```text
corepack pnpm typecheck        -> PASS (4 packages)
corepack pnpm lint             -> PASS
corepack pnpm test              -> PASS (141/141)
corepack pnpm format:check     -> PASS
corepack pnpm --filter @lemonade/web build       -> PASS
corepack pnpm --filter @lemonade/extension build -> PASS (1.63 MB total, unchanged)
corepack pnpm test:e2e         -> PASS (16/16 Chromium)
```

### Important resolved tooling incident (historical, do not repeat)

Sandboxed pnpm installs can appear to hang at high CPU because pnpm cannot safely use its user-level store/SQLite index under a filesystem sandbox. If this recurs: (1) terminate only the exact residual Node install processes; (2) remove only generated `node_modules` inside the workspace; (3) run `corepack pnpm install --frozen-lockfile --offline` with approved elevated access to the pnpm store; (4) keep `enableGlobalVirtualStore: false` and always use `corepack pnpm`. Do not delete source files or repeat sandboxed installs that cannot reach the pnpm store.

### Note on image generation

No image-generation tool is available in this environment. All Stage 13 art is either the previously-approved sprite sheets (town base, Scout, Workshop/Mender/Host) or Pillow crops of them. Do not claim new art can be generated on demand; if further art is genuinely required, ask the user how they want it produced.

### Immediate next actions (start Stage 15)

Stage 14 is complete and verified; see CHG-20260711-020, CHG-20260711-021, and the Stage 14 Status/Evidence line above. Stage 15 (deployment, repository, video, submission) is next and has not been started. Unlike Stage 14, several Stage 15 tasks are hard-to-reverse or need explicit user decisions before an agent should act: deploying to Vercel (needs the user's account/target and produces a public URL), recording the three-minute demo video and silent fallback capture (needs the user's voice/screen or explicit sign-off on an automated capture approach), and freezing code except submission-blocking fixes. Do not start these without asking the user first. The README completion (task 1), `.env.example`/secret-leakage check (task 2), and extension ZIP/unpacked artifact (task 4) are safe to prepare without new authorisation. The deadline is 2026-07-12 10:00 Shanghai CST/12:00 Sydney AEST. Re-check `git ls-remote` before any further push.

---

## Historical Stage 2 Close-Out Handoff (Superseded)

Everything below this heading was the authoritative handoff before Stage 3 began. It is retained for history only. Do not follow it; use the Current Resume Point above. The Stage 1 pre-implementation handoff that used to follow this section has been removed from this file for length - see `docs/production/02-change-log.md` CHG-20260711-001 through 004 and `01-implementation-roadmap.md` Stage 1/2 evidence lines if that history is needed.

Stage 2 finished with: `apps/web` and `apps/extension` both building; `packages/domain`/`packages/game-engine` React-free skeletons; Playwright/Vitest configured; extension manifest MV3 with localhost-only matches and no permissions; full verification matrix passing including `format:check`. See CHG-20260711-005 for the exact Stage 2 close-out evidence.
