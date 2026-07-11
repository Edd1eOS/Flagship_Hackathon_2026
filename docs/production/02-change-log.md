# Lemonade Change Log

> Policy: append-only for meaningful changes. Do not silently rewrite previous entries. Corrections must be added as new entries that reference the superseded change ID.

## What Must Be Logged

Log every change that affects one or more of the following:

- user-visible behaviour or copy;
- domain/game rules or invariants;
- state schema, seed, persistence, or migration;
- public function/type/component contracts;
- package dependencies or build configuration;
- browser-extension permissions, detection, messaging, or storage;
- asset identity, visual state, animation, or accessibility;
- tests, test fixtures, deployment, or submission configuration;
- production documentation or roadmap decisions;
- removal, deferral, or scope change of a feature.

Pure formatting with no semantic effect may be grouped into one entry. Never omit a change because it was small if it changed behaviour.

## Entry Template

Copy this block for each change:

```markdown
### CHG-YYYYMMDD-NNN - Short imperative title

- Timestamp: YYYY-MM-DD HH:mm TZ
- Author/agent: <name or agent identifier>
- Stage: <roadmap stage number>
- Change type: feature | fix | refactor | dependency | test | docs | asset | config | deployment | scope
- Status: completed | reverted | superseded | partial
- Request/source: <user request, issue, audit, or discovered defect>

#### Intent

<Why this change was necessary and the user/product outcome it serves.>

#### Changed

- `<file>`: <specific modification>
- `<symbol>`: <contract or behaviour change>

#### Behavioural impact

<What a user, engine, extension, developer, or test can observe now. State "None" only if truly none.>

#### Dependency impact

<New/removed/changed dependency, affected callers, schemas, assets, permissions, migrations.>

#### Verification

- `<command or manual step>`: PASS/FAIL - <evidence>

#### Risks and follow-up

- <remaining risk, limitation, or next required action>

#### Documentation updated

- `docs/production/03-dependency-map.md`: yes/no/not applicable
- `docs/production/01-implementation-roadmap.md`: yes/no/not applicable
- Other: <paths>
```

## Status Rules

- `completed`: implemented and verified at the stated level.
- `partial`: useful work exists but exit criteria are not met.
- `reverted`: implementation was removed; preserve the reason and verification.
- `superseded`: a later design/implementation replaced it; reference the new CHG ID.

Never mark a change completed because files were edited. Verification evidence is required.

## Log

### CHG-20260711-001 - Establish English production documentation system

- Timestamp: 2026-07-11 14:22-15:00 CST (approximate documentation session)
- Author/agent: Codex planning agent
- Stage: pre-implementation
- Change type: docs
- Status: completed
- Request/source: user requested executable coding stages, change tracking, dependency mapping, strict iteration workflow, collaboration protocol, and a handoff prompt.

#### Intent

Create one unambiguous English production source of truth before clearing the current conversation and handing implementation to a new agent.

#### Changed

- `docs/production/README.md`: created production-doc precedence and product summary.
- `docs/production/01-implementation-roadmap.md`: created fifteen gated implementation stages.
- `docs/production/02-change-log.md`: created append-only change policy and template.
- `docs/production/03-dependency-map.md`: created target dependency map.
- `docs/production/04-iteration-workflow.md`: created mandatory iteration workflow.
- `docs/production/05-collaboration-protocol.md`: created user/agent communication contract.
- `docs/production/06-agent-handoff.md`: created standalone current-state handoff for the next implementation agent.

#### Behavioural impact

No runtime behaviour exists yet. Future agents have a single production planning source and mandatory documentation process.

#### Dependency impact

No package dependency changed. Production documentation now supersedes conflicting historical exploration.

#### Verification

- Inspect production documents and links: PASS after file creation.
- Confirm all production documents are English: PASS by authoring policy; final agent should re-check.

#### Risks and follow-up

- Current workspace is not recognised as a valid Git repository.
- No application code or tests exist yet.
- The next agent must begin at Roadmap Stage 1 and log each change.

#### Documentation updated

- `docs/production/03-dependency-map.md`: yes
- `docs/production/01-implementation-roadmap.md`: yes
- Other: all `docs/production/*`

### CHG-20260711-002 - Correct companion and town product composition

- Timestamp: 2026-07-11 CST
- Author/agent: Codex planning agent
- Stage: pre-implementation
- Change type: scope
- Status: completed
- Request/source: user clarified that the browser mouse is an additional patrol companion, not a replacement for the Lemonade Lane town dashboard.

#### Intent

Preserve the small-town management game while adding a continuous Scout character that detects shopping pages and jumps back into the town with captured decisions.

#### Changed

- Current product model: `Browser Scout + Lemonade Lane dashboard/game terminal`.
- Scout is not an assignable town resident.
- Mender and Host remain the two limited town residents.
- `docs/13-town-dashboard-uiux.md`: created combined desktop/mobile layout and interaction flow.
- Historical replace-town assumption in `docs/12-browser-companion-pivot.md`: marked superseded.

#### Behavioural impact

The target demo now begins on a shopping page, returns through Browser Gate, runs Cooling/reuse/repair, then activates town projects through resident assignment.

#### Dependency impact

Both companion/mission and town/project engines are required. WXT is a core demo surface rather than a purely optional future feature.

#### Verification

- Cross-check current production summary against `docs/13-town-dashboard-uiux.md`: PASS.

#### Risks and follow-up

- The combined product has more scope than either surface alone. Enforce the cut order and controlled-storefront limitation.

#### Documentation updated

- `docs/production/03-dependency-map.md`: yes
- `docs/production/01-implementation-roadmap.md`: yes
- Other: `docs/13-town-dashboard-uiux.md`, historical decision documents

### CHG-20260711-003 - Establish safe repository baseline

- Timestamp: 2026-07-11 15:42 CST
- Author/agent: Codex implementation agent
- Stage: 1
- Change type: config
- Status: completed
- Request/source: user requested Roadmap Stage 1 repository safety inspection and a verifiable baseline before continuing to Stage 2.

#### Intent

Make the non-empty documentation workspace reproducible under Git without deleting the existing empty `.git` directory or risking remote history.

#### Changed

- `.git`: initialised in place on `main` after confirming the target GitHub repository returned zero refs.
- Local Git configuration: added `origin` for `https://github.com/Edd1eOS/Flagship_Hackathon_2026.git`; no push or other remote mutation was performed.
- `.gitignore`: added exclusions for dependencies, Next.js, WXT, build/test output, environment secrets, generated image intermediates, logs, editor files, and operating-system noise while preserving environment examples.
- `README.md`: added the product summary, production-document links, repository status, and baseline tool requirements.
- `package.json`: declared a private `lemonade` workspace using pnpm 11.2.2 and Node.js 20 or later.
- `pnpm-workspace.yaml`: registered `apps/*` and `packages/*` workspace package locations.
- `tsconfig.base.json`: added strict shared TypeScript defaults.
- `pnpm-lock.yaml`: generated the empty-workspace lockfile using pnpm 11.2.2.
- `docs/production/01-implementation-roadmap.md`: recorded Stage 1 status and verification evidence.
- `docs/production/03-dependency-map.md`: recorded the implemented root baseline and its file boundaries.

#### Behavioural impact

Git now recognises the workspace on `main`, and future application packages can share a strict pnpm/TypeScript baseline. No application runtime behaviour exists yet.

#### Dependency impact

No runtime or development dependency was installed. Stage 2 packages will consume the root workspace and TypeScript configuration.

#### Verification

- `git ls-remote --symref <target> HEAD` and `git ls-remote <target>`: PASS - both read-only queries returned zero refs before local Git initialisation.
- `git status --short --branch`: PASS - Git reports `No commits yet on main` and only expected untracked baseline/user files.
- `git remote -v`: PASS - local `origin` fetch/push URLs match the target repository; no remote mutation occurred.
- Node JSON parse for `package.json` and `tsconfig.base.json`: PASS.
- PowerShell structural check for `pnpm-workspace.yaml`: PASS.
- `git check-ignore -v --no-index .env .env.local apps/web/.env.local .env.example`: PASS - secret environment files match ignore rules and `.env.example` matches the explicit allow rule.
- `pnpm install --lockfile-only --offline`: PASS using pnpm 11.2.2.

#### Risks and follow-up

- The repository has no first commit and remains unpushed by design. The first push requires a later explicit safe-push decision.
- Application code, package scripts, tests, and builds begin in Stage 2.

#### Documentation updated

- `docs/production/03-dependency-map.md`: yes
- `docs/production/01-implementation-roadmap.md`: yes
- Other: `README.md`

### CHG-20260711-004 - Scaffold connected web and extension workspaces

- Timestamp: 2026-07-11 15:45-16:36 CST
- Author/agent: Codex implementation agent
- Stage: 2
- Change type: feature
- Status: partial
- Request/source: user requested continuous implementation after the verified Stage 1 baseline; work was intentionally paused to create an exact handoff.

#### Intent

Create runnable Next.js and WXT React surfaces with strict React-free shared package boundaries and a reproducible verification toolchain.

#### Changed

- `apps/web`: added Next.js App Router, Tailwind/PostCSS, ESLint flat config, metadata, a responsive connection baseline, and shared-package imports.
- `apps/extension`: added WXT React configuration, localhost-only Shadow Root content-script proof, and strict JSX type configuration.
- `packages/domain` and `packages/game-engine`: added React-free source packages and verified the intended dependency direction.
- Root workspace: added pinned build/test/format dependencies and scripts, Playwright/Vitest configuration, a lockfile, Corepack pnpm 11.11.0 contract, and explicit pnpm build-script trust decisions.
- `tests/e2e/baseline.spec.ts`: added a Chromium baseline for the web/shared-package connection.
- `CONTINUE_IMPLEMENTATION_PROMPT.md`: added the exact continuation prompt pointing to the current handoff.
- `docs/production/06-agent-handoff.md`: added the authoritative current resume state, verification evidence, incidents, risks, and next commands.

#### Behavioural impact

The web root renders a minimal Lemonade value-proposition baseline. On localhost pages, the extension can mount a minimal isolated Browser Scout readiness badge. No product detection, business state, persistence, town logic, or remote integration exists yet.

#### Dependency impact

Pinned versions and build-script allow/deny decisions are recorded in `03-dependency-map.md` and the current handoff. The extension currently requests no explicit permissions and has localhost-only content-script matches.

#### Verification

- `corepack pnpm install --frozen-lockfile --offline`: PASS after clean generated dependency rebuild; pnpm supply-chain policy verification passed.
- `corepack pnpm typecheck`: PASS for all four workspace packages.
- `corepack pnpm --filter @lemonade/web build`: PASS, including rerun after `allowedDevOrigins` configuration.
- `corepack pnpm --filter @lemonade/extension build`: PASS; generated MV3 manifest inspected.
- `corepack pnpm lint`: PASS before final handoff documentation changes.
- `corepack pnpm test`: PASS with zero unit files under the explicit Stage 2 `--passWithNoTests` contract.
- `corepack pnpm test:e2e`: PASS, 1/1 Chromium test; rerun after eliminating the Next dev-origin warning.
- `corepack pnpm format:check`: NOT RUN after the script was added.
- Final complete verification matrix after all latest config/docs changes: NOT RUN.

#### Risks and follow-up

- Stage 2 must remain partial until formatter check, the full final matrix, and three review passes complete.
- The repository still has no commit and no push. Re-check the empty remote before any user-authorised first push.
- Product/domain logic begins only after Stage 2 close-out; do not treat the readiness badge as implemented Scout behaviour.

#### Documentation updated

- `docs/production/03-dependency-map.md`: yes
- `docs/production/01-implementation-roadmap.md`: yes
- Other: `docs/production/06-agent-handoff.md`, `CONTINUE_IMPLEMENTATION_PROMPT.md`

### CHG-20260711-005 - Complete Stage 2 close-out with formatting and full verification matrix

- Timestamp: 2026-07-11 16:50-17:05 CST
- Author/agent: Claude implementation agent
- Stage: 2
- Change type: config
- Status: completed
- Request/source: continuation per `CONTINUE_IMPLEMENTATION_PROMPT.md`; finishes the partial close-out recorded in CHG-20260711-004.

#### Intent

Close Stage 2 by fixing outstanding Prettier formatting, rerunning the complete verification matrix, and performing the three mandatory review passes so Stage 3 can begin on a verified baseline.

#### Changed

- Prettier `--write` applied to the code/config glob from the `format:check` script only (17 files: extension entrypoint/component/CSS/config, web configs/styles/pages, package manifests, tsconfigs, `pnpm-lock.yaml`, `tests/e2e/baseline.spec.ts`). No Markdown or historical document was reformatted. No semantic change.

#### Behavioural impact

None. Formatting only; all runtime behaviour identical.

#### Dependency impact

None. `pnpm-lock.yaml` was reformatted by Prettier (YAML semantics unchanged; pnpm compares parsed content).

#### Verification

- `corepack pnpm format:check`: PASS after write - all matched files use Prettier style.
- `corepack pnpm typecheck`: PASS - all four workspace packages.
- `corepack pnpm lint`: PASS - `apps/web` ESLint clean.
- `corepack pnpm test`: PASS - Vitest 4.1.10, zero unit files under the explicit Stage 2 `--passWithNoTests` contract.
- `corepack pnpm --filter @lemonade/web build`: PASS - Next.js 16.2.10, `/` and `/_not-found` prerendered.
- `corepack pnpm --filter @lemonade/extension build`: PASS - WXT 0.20.27 chrome-mv3 output.
- Generated manifest inspection: PASS - MV3, matches only `http://localhost/*` and `http://127.0.0.1/*`, no `permissions` key.
- `corepack pnpm test:e2e`: PASS - 1/1 Chromium baseline test.
- `git check-ignore` for `.env*`, `.output`, `.next`, `node_modules`, `test-results`: PASS - all ignored; `.env.example` remains trackable.
- Three-pass review (correctness/product truth; architecture/style; UX/accessibility): PASS - no material findings; placeholders contain no business, money, XP, outcome, allocation, or eligibility mutations; shared packages remain React-free.

#### Risks and follow-up

- Repository still has no commit and no push by design; first push requires explicit user authorisation and a fresh remote check.
- Stage 3 (domain schemas, seed, clock, IDs) begins next and introduces the Zod dependency to `packages/domain`.

#### Documentation updated

- `docs/production/03-dependency-map.md`: not applicable (no contract change)
- `docs/production/01-implementation-roadmap.md`: yes (Stage 2 marked completed)
- Other: none

### CHG-20260711-006 - Implement Stage 3 domain schemas, seed, clock, and IDs

- Timestamp: 2026-07-11 17:05-17:55 CST
- Author/agent: Claude implementation agent
- Stage: 3
- Change type: feature
- Status: completed
- Request/source: roadmap Stage 3 after Stage 2 close-out (CHG-20260711-005).

#### Intent

Define stable typed domain contracts, deterministic clock/ID adapters, and the canonical seeded persona before any UI or simulation work, expressing the non-negotiable truth rules at the type level.

#### Changed

- `packages/domain/package.json`: added `zod@4.4.3` (exact) and `"sideEffects": false` so consumers tree-shake unused schema modules (extension bundle had regressed 202.55 kB -> 277.27 kB via the barrel export; now restored).
- `packages/domain/src/clock.ts`: `Clock` interface, `SystemClock`, deterministic `FixedClock` with `advanceByMinutes`, `toIsoTimestamp`.
- `packages/domain/src/ids.ts`: `IdGenerator` interface, `SystemIdGenerator` (`crypto.randomUUID`, ambient-declared to keep the package DOM/Node-type free), `DeterministicIdGenerator` (per-kind counters).
- `packages/domain/src/schemas/primitives.ts`: `CURRENT_SCHEMA_VERSION = 1`, entity ID, ISO timestamp (`z.iso.datetime`), `AUD` literal currency, whole-cent `audAmountSchema`/`positiveAudAmountSchema`.
- `packages/domain/src/schemas/*.ts`: strict Zod schemas + inferred types for `UserProfile`, `Goal`, `OwnedItem`, `PurchaseDecision`, `Mission`, `ReuseCommitment`, `PlannedAllocation` (`kind: 'planned'` literal, positive amount), `Reflection` (`xpAwarded: literal REFLECTION_XP = 10`, price/outcome independent), `CaptureTemplate`, town (`LocationId`, `LocationState`, `ResidentRole`, `CompanionMode`, `ResidentState` rejecting an assignable scout, `TownState` with unique locations/roles).
- `packages/domain/src/schemas/purchase-decision.ts`: new `origin` field (`manual | extension_import | seeded_demo`) keeping genuinely new Cooling visibly distinct from seeded Ready; `cooling/ready/extended` require `reviewAt`.
- `packages/domain/src/events/domain-event.ts`: eleven-variant discriminated `domainEventSchema`; every event has stable `id`, `occurredAt`, `schemaVersion`, optional `commandId`.
- `packages/domain/src/schemas/app-state.ts`: `appStateSchema` root with cross-entity refinements (referential integrity; allocations only against skipped decisions; per-decision allocation total <= price; unique event IDs) and `migrateAppState` placeholder rejecting unknown versions.
- `packages/domain/src/seed.ts`: `createSeedState(clock, ids)` (self-validating via `appStateSchema.parse`) and `parseSeedData`. Persona: Alex, AUD, $600 discretionary plan, Japan trip experience goal (secondary), 10 owned items including three same-job shoe candidates, one seeded Ready sneakers decision (created 26 h ago, reviewAt 2 h ago, `origin: seeded_demo`, overlap = the three shoes), one controlled-storefront capture template, town with Home lived-in/Gate available/rest locked, Scout unassignable on patrol, Mender + Host assignable.
- `packages/domain/src/index.ts`: barrel exports for all of the above; `DOMAIN_PACKAGE_NAME` retained.
- `packages/domain/src/schemas.test.ts`, `packages/domain/src/seed.test.ts`: 23 Vitest tests covering valid/invalid fixtures, truth-rule rejections, seed determinism, lossless JSON round trip, and seed shape guarantees.

#### Behavioural impact

No runtime UI change. The workspace now has executable, tested domain contracts; `corepack pnpm test` runs real unit tests (the Stage 2 `--passWithNoTests` allowance is no longer exercised for the domain package).

#### Dependency impact

`zod@4.4.3` added to `packages/domain` dependencies (first runtime dependency of a shared package; already planned in the dependency map). `PurchaseDecision` gained the `origin` field relative to the original target contract. Lockfile updated and re-verified.

#### Verification

- `corepack pnpm --filter @lemonade/domain add --save-exact zod`: PASS - zod 4.4.3, supply-chain policy check passed.
- `corepack pnpm test`: PASS - 2 files, 23/23 tests.
- `corepack pnpm typecheck`: PASS - all four packages.
- `corepack pnpm lint`: PASS.
- `corepack pnpm format:check`: PASS after formatting the new files.
- `corepack pnpm --filter @lemonade/web build`: PASS.
- `corepack pnpm --filter @lemonade/extension build`: PASS - bundle restored to 202.55 kB after `sideEffects: false`.
- `corepack pnpm install --frozen-lockfile --offline`: PASS - lockfile up to date after Prettier reformatting.
- `corepack pnpm test:e2e`: PASS - 1/1 Chromium.

#### Risks and follow-up

- Development-startup seed validation is inherent (`createSeedState` parses through `appStateSchema`); repository hydration validation lands in Stage 4.
- The seed event log is intentionally empty; Stage 4 introduces command/event append semantics.
- Deprecated transitive `uuid@8.3.2` warning observed during install (from existing toolchain, not zod); no action needed.

#### Documentation updated

- `docs/production/03-dependency-map.md`: yes
- `docs/production/01-implementation-roadmap.md`: yes
- Other: none

### CHG-20260711-007 - Implement Stage 4 command transaction and persistence foundation

- Timestamp: 2026-07-11 17:55-18:10 CST
- Author/agent: Claude implementation agent
- Stage: 4
- Change type: feature
- Status: completed
- Request/source: roadmap Stage 4 after Stage 3 completion (CHG-20260711-006).

#### Intent

Create the single safe write path shared by web and (later) extension contexts: typed commands, idempotent transactions, append-only events, repository implementations, and a command-only view store.

#### Changed

- `packages/domain/src/commands/command.ts`: full sixteen-variant `Command` union with stable `commandId` on every command; `DetectedProduct` payload type for the future extension import.
- `packages/domain/src/transaction.ts`: `executeCommand` dispatch with command-ID replay dedupe, `appendUniqueEvents` (event-ID dedupe), `TransactionResult`/`TransactionError`, `CommandDependencies` including a `createSeed` factory so `RESET_DEMO` is deterministic under test. Implemented handlers: `QUICK_ADD_OWNED_ITEM` (item + `OWNED_ITEM_ADDED` event) and `RESET_DEMO`; all other commands return an explicit `NOT_IMPLEMENTED` error until their stage lands. The `effects` output channel is deliberately deferred to Stage 8 when the first transient effect consumer exists.
- `packages/domain/src/repository.ts`: `LemonadeRepository` interface (`load`/`transact`/`subscribe`/`resetDemo`), `createCommandDependencies`, `RepositoryOptions` (`initialState`, `seedFactory`), and `InMemoryRepository` for deterministic tests.
- `apps/web/src/repositories/web-local-repository.ts`: `WebLocalRepository` persisting one versioned root JSON under `lemonade.app-state.v1` through an injectable `KeyValueStorage`; corrupted or unsupported-version storage falls back to the seed with a `console.warn` development warning. Only `AppState` is persisted; no transient UI data exists in the persistence shape.
- `apps/web/src/store/lemonade-store.ts`: `createLemonadeStore` (Zustand vanilla) hydrating from the repository; exposes `status/appState/loadError` plus `dispatch` and `resetDemo` only - no arbitrary setters for components.
- `apps/web/package.json`: added `zustand@5.0.14` (exact).
- Tests: `packages/domain/src/transaction.test.ts`, `apps/web/src/repositories/web-local-repository.test.ts`, `apps/web/src/store/lemonade-store.test.ts` (15 new tests; 38 total).

#### Behavioural impact

No visible UI change yet (shell integration is Stage 9/10). The workspace now has a tested end-to-end write path: command -> transaction -> persisted state -> subscription.

#### Dependency impact

`zustand@5.0.14` added to `apps/web`. New public domain symbols: `Command` union and member types, `DetectedProduct`, `executeCommand`, `appendUniqueEvents`, `TransactionResult`, `TransactionError`, `CommandDependencies`, `LemonadeRepository`, `StateListener`, `RepositoryOptions`, `createCommandDependencies`, `InMemoryRepository`. New web symbols: `WebLocalRepository`, `APP_STATE_STORAGE_KEY`, `KeyValueStorage`, `createLemonadeStore`, `LemonadeStoreState`.

#### Verification

- `corepack pnpm test`: PASS - 5 files, 38/38 tests (idempotent replay no-op, event dedupe, NOT_IMPLEMENTED error, deterministic reset, seed-on-first-load, simulated refresh persistence, corruption and version fallbacks with warning, store hydration/dispatch/reset).
- `corepack pnpm typecheck`: PASS - all packages.
- `corepack pnpm lint`: PASS after removing one unused parameter.
- `corepack pnpm format:check`: PASS.
- `corepack pnpm --filter @lemonade/web build`: PASS.
- `corepack pnpm --filter @lemonade/extension build`: PASS - bundle unchanged at 202.55 kB.
- `corepack pnpm test:e2e`: PASS - 1/1 Chromium.

#### Risks and follow-up

- Browser-level refresh persistence is verified at unit level with an injected storage fake; the real-browser E2E path lands when the shell consumes the store (Stage 9/10).
- Command payloads for not-yet-implemented commands may be refined by Stages 5-8; the dependency map must be updated when they change.
- `ExtensionRepository`/`ExtensionBridgeRepository` remain Stage 12 contracts.

#### Documentation updated

- `docs/production/03-dependency-map.md`: yes
- `docs/production/01-implementation-roadmap.md`: yes
- Other: none

### CHG-20260711-008 - Implement Stage 5 purchase decision engine

- Timestamp: 2026-07-11 18:10-18:20 CST
- Author/agent: Claude implementation agent
- Stage: 5
- Change type: feature
- Status: completed
- Request/source: roadmap Stage 5 after Stage 4 completion (CHG-20260711-007).

#### Intent

Implement the complete honest purchase-decision state machine so new decisions genuinely wait 24 hours, reviews are one-shot, Buy is neutral, and Skip never touches money.

#### Changed

- `packages/domain/src/decision-machine.ts`: `COOLING_HOURS = 24`, `DecisionTransitionEvent` union (`ASSESS`, `START_COOLING`, `MARK_READY`, `BUY`, `SKIP`, `RECLASSIFY_NEED`, `EXTEND`, `RESUME_COOLING`), single-step `transitionDecision` guarded by an explicit legal-transition table matching the roadmap, `getDecisionReadiness` (ready exactly at `reviewAt`), `computeReviewAt`, `markReady` (clock-guarded).
- `packages/domain/src/transaction.ts`: handlers for `CAPTURE_DECISION` (draft + `DECISION_CAPTURED`), `START_COOLING` (draft chains legal ASSESS -> START_COOLING; emits `COOLING_STARTED` with `reviewAt = now + 24h`), `RESOLVE_DECISION` (outcome-to-transition map: bought -> BUY; skipped/reused_existing/repaired -> SKIP; reclassified_need -> RECLASSIFY_NEED; one fixed-XP Reflection only when resolving from `ready`, defensively deduplicated; optional Buy `addToMyStuff` records the item plus `OWNED_ITEM_ADDED`), `EXTEND_COOLING` (legal ready -> extended -> cooling chain with a fresh 24-hour window, emitting `COOLING_STARTED`).
- `packages/domain/src/schemas/purchase-decision.ts`: added optional `resolvedAt` audit timestamp.
- `packages/domain/src/commands/command.ts`: `ResolveDecisionCommand` gained optional `addToMyStuff`.
- Tests: `decision-machine.test.ts` (table-driven legality across all eight statuses, terminal-status rejection, exact 24-hour boundary at the millisecond, `markReady` guard, audit fields) and `decision-commands.test.ts` (capture/cooling flow, seeded-vs-new distinctness, one-reflection rule, duplicate-resolution rejection, Buy neutrality with My Stuff add, skip-while-cooling rejection, extend semantics). 107 total tests.

#### Behavioural impact

The full decision lifecycle is now executable through the single command path. No UI consumes it yet (Stage 10).

#### Dependency impact

New public domain symbols: `COOLING_HOURS`, `DecisionTransitionEvent`, `DecisionTransitionResult`, `transitionDecision`, `getDecisionReadiness`, `computeReviewAt`, `markReady`. `PurchaseDecision.resolvedAt` added; `ResolveDecisionCommand.addToMyStuff` added. No package dependency change.

#### Verification

- `corepack pnpm test`: PASS - 7 files, 107/107 tests (after fixing a test-only deterministic ID collision between seed factory and command generator, and updating the NOT_IMPLEMENTED probe to `OFFER_MISSION`).
- `corepack pnpm typecheck`: PASS.
- `corepack pnpm lint`: PASS.
- `corepack pnpm format:check`: PASS.
- `corepack pnpm --filter @lemonade/web build` / `--filter @lemonade/extension build`: PASS - extension bundle unchanged.
- `corepack pnpm test:e2e`: PASS - 1/1 Chromium.

#### Risks and follow-up

- `markReady` is an engine function, not a `Command`; the Ready display state is derived via `getDecisionReadiness` in selectors until Stage 10 wires the review flow.
- Same-job overlap population (`ASSESS` currently passes through existing `overlapItemIds`) becomes real in Stage 6 matching.

#### Documentation updated

- `docs/production/03-dependency-map.md`: yes
- `docs/production/01-implementation-roadmap.md`: yes
- Other: none

### CHG-20260711-009 - Implement Stage 6 same-job matching and reuse commitment

- Timestamp: 2026-07-11 18:20-18:30 CST
- Author/agent: Claude implementation agent
- Stage: 6
- Change type: feature
- Status: completed
- Request/source: roadmap Stage 6 after Stage 5 completion (CHG-20260711-008).

#### Intent

Make the anti-consumerism differentiator functional: deterministically and explainably surface owned items that satisfy the same job, and record validated reuse commitments, all without AI.

#### Changed

- `packages/domain/src/overlap.ts`: `scoreOwnedItemMatch` (job-led weighted scoring - an item that does not cover the same job never matches, regardless of category; weights: job 0.55, same category +0.25, condition bonus up to +0.15 with human-readable reasons including repair notes), `getMatchConfidence` (none < 0.35 <= low < 0.6 <= medium < 0.8 <= high), `findSameJobMatches` (ranked, non-none only), `explainMatch` (primary reason), `MatchCandidate`/`MatchConfidence`/`OwnedItemMatch` types.
- `packages/domain/src/transaction.ts`: `COMMIT_REUSE` handler validating decision/item existence, honest context (`ready` or `skipped` decisions only), and one commitment per decision; emits `REUSE_COMMITTED`.
- `packages/domain/src/overlap.test.ts`: 9 tests - seeded sneakers rank the three same-job shoes (trail runners first) with explainable reasons and the boots' repair note; unrelated jobs return no matches; category-only overlap scores zero; broken same-job items are low confidence; confidence monotonicity; commitment creation/duplicate/context/not-found rules. 117 total tests.

#### Behavioural impact

The engine can now produce the demo's same-job shoe evidence and record the repair/reuse commitment that later unlocks the Workshop. Design decision: matching is job-gated, so a camera never suggests headphones merely for sharing "electronics".

#### Dependency impact

New public domain symbols: `scoreOwnedItemMatch`, `getMatchConfidence`, `findSameJobMatches`, `explainMatch`, `MatchCandidate`, `MatchConfidence`, `OwnedItemMatch`. Quick Add remains the `QUICK_ADD_OWNED_ITEM` handler from Stage 4 (no separate `quickAddOwnedItem` function needed). No package dependency change.

#### Verification

- `corepack pnpm test`: PASS - 8 files, 117/117 tests.
- `corepack pnpm typecheck` / `lint` / `format:check`: PASS.
- `corepack pnpm --filter @lemonade/web build` / `--filter @lemonade/extension build`: PASS.
- `corepack pnpm test:e2e`: PASS - 1/1 Chromium.

#### Risks and follow-up

- Empty-My-Stuff continuation is trivially safe at engine level (empty match list); the visible fallback copy lands in Stage 10 UI.
- Match weights may be tuned once real UI copy exists; thresholds are centralised in `getMatchConfidence`.

#### Documentation updated

- `docs/production/03-dependency-map.md`: yes
- `docs/production/01-implementation-roadmap.md`: yes
- Other: none

### CHG-20260711-010 - Implement Stage 7 mission, allocation, and reflection engines

- Timestamp: 2026-07-11 18:30-18:40 CST
- Author/agent: Claude implementation agent
- Stage: 7
- Change type: feature
- Status: completed
- Request/source: roadmap Stage 7 after Stage 6 completion (CHG-20260711-009).

#### Intent

Turn Cooling into an executable real-world experiment (missions with slots, conflicts, and time-gated check-in) while preserving financial truth in planned allocations.

#### Changed

- `packages/domain/src/mission-machine.ts`: `MISSION_CHECK_IN_HOURS = 24`, `MissionTransitionEvent` (`ACCEPT`/`START`/`MARK_READY_FOR_CHECKIN`/`COMPLETE`/`CANCEL`), guarded `transitionMission`, `getMissionReadiness` (time-derived), `computeCheckInAt`, `NON_TERMINAL_MISSION_STATUSES`.
- `packages/domain/src/transaction.ts`: `MISSION_SLOTS = 2`; handlers `OFFER_MISSION` (decision must be assessed/cooling/ready; max two open missions; one open mission per decision; no conflicting open mission on the same owned item), `ACCEPT_MISSION` (offered -> accepted -> active with `checkInAt = acceptedAt + 24h`), `COMPLETE_MISSION` (time-guarded; auto-promotes active -> ready_for_checkin only when the window passed), `CANCEL_MISSION` (fully neutral; frees the slot), `PLAN_ALLOCATION` (skipped decision only, positive whole-cent amount, per-decision total <= price, goal existence; appends allocation, updates `goal.plannedAllocationTotal` only - `startingAmount` untouched; emits `ALLOCATION_PLANNED`).
- `packages/domain/src/events/domain-event.ts`: added `MISSION_OFFERED` and `MISSION_CANCELLED` variants so every state-changing command has an event for command-ID idempotency.
- `packages/domain/src/schemas/reflection.ts`: `calculateReflectionXp()` exported; deliberately takes no inputs.
- `packages/domain/src/mission-commands.test.ts`: 12 tests covering machine guards, slot/conflict/per-decision rules, 24-hour check-in boundary, neutral cancellation, allocation invariants (zero/negative/sub-cent/price-exceeding rejections, goal planned-total update), and fixed XP. 129 total tests.

#### Behavioural impact

The complete mission lifecycle and optional planned-allocation flow are executable through the command path. Progression/reward milestones are explicitly deferred to Stage 8 (game-engine `progression.ts`/`rewards.ts`), where they belong.

#### Dependency impact

New public domain symbols: `MISSION_CHECK_IN_HOURS`, `MissionTransitionEvent`, `MissionTransitionResult`, `transitionMission`, `getMissionReadiness`, `computeCheckInAt`, `NON_TERMINAL_MISSION_STATUSES`, `MISSION_SLOTS`, `calculateReflectionXp`. `DomainEvent` union grew by `MISSION_OFFERED`/`MISSION_CANCELLED`. No package dependency change.

#### Verification

- `corepack pnpm test`: PASS - 9 files, 129/129 tests (NOT_IMPLEMENTED probe moved to `PREVIEW_ASSIGNMENT` after `OFFER_MISSION` became real).
- `corepack pnpm typecheck` / `lint` / `format:check`: PASS.
- `corepack pnpm --filter @lemonade/web build` / `--filter @lemonade/extension build`: PASS.
- `corepack pnpm test:e2e`: PASS - 1/1 Chromium.

#### Risks and follow-up

- Mission check-in currently uses a fixed 24-hour window aligned with cooling; checklist-based readiness can be added later if the UX needs it.
- The Ready check-in question ("did it solve the job?") is answered through `RESOLVE_DECISION` outcomes; no separate command was added.

#### Documentation updated

- `docs/production/03-dependency-map.md`: yes
- `docs/production/01-implementation-roadmap.md`: yes
- Other: none

### CHG-20260711-011 - Implement Stage 8 town simulation and resident scheduling

- Timestamp: 2026-07-11 18:40-18:55 CST
- Author/agent: Claude implementation agent
- Stage: 8
- Change type: feature
- Status: completed
- Request/source: roadmap Stage 8 after Stage 7 completion (CHG-20260711-010).

#### Intent

Implement persistent Lemonade Lane project/resident logic independently of rendering, wired into the single command path without violating the domain -> game-engine dependency ban.

#### Changed

- `packages/domain/src/transaction.ts`: added the injectable `TownEngine` interface (`handleCommand`, `projectEvents`) and `TransientEffect` base type; `TransactionResult` now carries a transient `effects` array (first consumer exists, resolving the Stage 4 deferral); `executeCommand` delegates unknown commands to the injected town engine and idempotently projects each successful command's events.
- `packages/domain/src/repository.ts` + `apps/web/src/repositories/web-local-repository.ts`: `RepositoryOptions.townEngine` and a fourth `createCommandDependencies` parameter.
- `packages/game-engine/src/effects.ts`: ordered `UiEffect` union (`PROJECT_AVAILABLE`, `RESIDENT_TRAVELLED`, `LOCATION_ACTIVATED`, `LOCATION_LIVED_IN`) - advisory only, never persisted.
- `packages/game-engine/src/eligibility.ts`: `PROJECT_RECIPES` (DECISION_REVIEWED -> Picnic; REUSE_COMMITTED -> Workshop; ALLOCATION_PLANNED -> Station) and `getEligibleProjects` with human-readable reasons.
- `packages/game-engine/src/projector.ts`: `projectBusinessEvent`/`projectBusinessEvents`, idempotent via `processedEventIds`.
- `packages/game-engine/src/assignments.ts`: reversible `previewAssignment` (Scout and locked/held locations rejected; re-preview moves the single preview), `cancelAssignment` (assigned -> available), atomic `confirmTownPlan` (distinct residents/locations, assignable-only, available/assigned-only, foreign-preview rejection; activates the exact set with ordered effects and role activities).
- `packages/game-engine/src/simulate-cycle.ts`: deterministic `simulateCycle` (active -> lived_in with effects).
- `packages/game-engine/src/invariants.ts`: `assertWorldInvariants` (Scout unassignable/project-free, known locations, no double project holding, no assignment to locked).
- `packages/game-engine/src/progression.ts`: derived `getProgression` (`XP_PER_LEVEL = 30`), resolving the Stage 7 progression deferral without currency or shop.
- `packages/game-engine/src/selectors.ts`: `selectTownViewModel` read model.
- `packages/game-engine/src/town-engine.ts`: `createTownEngine` handling `PREVIEW_ASSIGNMENT`/`CANCEL_ASSIGNMENT`/`CONFIRM_TOWN_PLAN` (confirm emits `TOWN_PLAN_CONFIRMED`); previews intentionally emit no event and are naturally idempotent.
- `packages/game-engine/package.json`: `"sideEffects": false`.
- `packages/game-engine/src/town.test.ts`: 7 tests including the full demo path through `executeCommand` with replay dedupe. 136 total tests.

#### Behavioural impact

Confirmed business actions now deterministically unlock, activate, and settle town projects through the same command pipeline the UI will use. `SELECT_REWARD` remains NOT_IMPLEMENTED (cosmetic reward choice sits in the roadmap cut order).

#### Dependency impact

Domain `TransactionResult` gained `effects` (additive; existing consumers unaffected). New game-engine public symbols as listed above. No package dependency change.

#### Verification

- `corepack pnpm test`: PASS - 10 files, 136/136 tests.
- `corepack pnpm typecheck` / `lint` / `format:check`: PASS (one `Set<string>` widening fix in invariants).
- `corepack pnpm --filter @lemonade/web build` / `--filter @lemonade/extension build`: PASS.
- `corepack pnpm test:e2e`: PASS - 1/1 Chromium.

#### Risks and follow-up

- Scout mode transitions (patrol/returning/cooler_check) remain static until Stage 12's return flow.
- The web store does not yet inject `createTownEngine`; Stage 9/10 wiring must pass it to the repository.

#### Documentation updated

- `docs/production/03-dependency-map.md`: yes
- `docs/production/01-implementation-roadmap.md`: yes
- Other: none

### CHG-20260711-012 - Stage 9 groundwork: theme tokens, asset manifest, browser store wiring

- Timestamp: 2026-07-11 18:55-18:49 CST
- Author/agent: Claude implementation agent
- Stage: 9
- Change type: feature
- Status: partial
- Request/source: roadmap Stage 9 after Stage 8 completion (CHG-20260711-011); paused early at the user's request to produce a context-reset handoff.

#### Intent

Lay the foundation the Stage 9 shell/dashboard needs (design tokens, typed asset manifest with stable hotspot rectangles, and a client-only store provider wired to the Stage 4/8 repository and town engine) before building the actual `AppShell`/`WorldStage`/`CommandDeck` components.

#### Changed

- `apps/web/src/app/globals.css`: replaced ad hoc CSS variables with a Tailwind 4 `@theme` block (`--color-paper/cream/ink/lemon/leaf/coral/sky/line`, `--font-display`, `--font-sans`) matching `docs/13-town-dashboard-uiux.md` section 13; added a visible `:focus-visible` ring for art backgrounds and a `prefers-reduced-motion` global override.
- `apps/web/src/assets/manifest.ts`: `WorldAssetId` union and `ASSET_MANIFEST` (every P0 world asset ID from the dependency map, `src: null` placeholders with `fallbackTint` so a missing image never breaks layout - real art lands in Stage 13); `LOCATION_HOTSPOTS` with percentage-based `HotspotRect` per `LocationId`, positioned independently of image alpha bounds per the UI/UX spec.
- `apps/web/src/repositories/repository-provider.tsx`: `RepositoryProvider` (React context) constructing one `WebLocalRepository` + `createTownEngine()` via a lazy `useState` singleton initializer (not an effect, to satisfy `react-hooks/set-state-in-effect` and avoid cascading renders) and `useLemonade` selector hook. Because the initializer touches `window.localStorage`, this component must be imported with `next/dynamic(() => import(...), { ssr: false })` at its usage site - documented inline.
- `apps/web/src/store/selectors.ts`: `selectReadyDecisions`, `selectCoolingDecisions` (sorted by nearest `reviewAt`), `selectOpenMissions`.
- `apps/web/package.json`: added `lucide-react` (exact) for Stage 9/10 navigation and control icons per the approved dependency map.

#### Behavioural impact

None yet: no page imports these modules. `page.tsx` still renders only the Stage 2 connection baseline. This is intentionally a foundation-only commit; the actual `AppShell`, `TopBar`, `NavRail`, `WorldStage`, `CommandDeck`, `DecisionDock` components and their Playwright screenshot verification remain undone.

#### Dependency impact

New public web symbols: `ASSET_MANIFEST`, `WorldAssetId`, `AssetEntry`, `LOCATION_HOTSPOTS`, `HotspotRect`, `RepositoryProvider`, `useLemonade`, `selectReadyDecisions`, `selectCoolingDecisions`, `selectOpenMissions`. `lucide-react` added to `apps/web`.

#### Verification

- `corepack pnpm typecheck`: PASS - all four packages.
- `corepack pnpm lint`: PASS after fixing one `react-hooks/set-state-in-effect` violation (switched from `useEffect`+`setState` to a lazy `useState` initializer).
- `corepack pnpm test`: PASS - 10 files, 136/136 tests (unchanged; no new tests were added for pure UI groundwork with no behaviour yet).
- `corepack pnpm format:check`: PASS after formatting `globals.css` and `pnpm-lock.yaml`.
- `corepack pnpm install --frozen-lockfile --offline`: PASS.
- `corepack pnpm --filter @lemonade/web build` / `--filter @lemonade/extension build`: PASS.
- `corepack pnpm test:e2e`: PASS - 1/1 Chromium (unchanged baseline).

#### Risks and follow-up

- Stage 9 is NOT complete: `AppShell`/`TopBar`/`NavRail`/`WorldStage`/`LocationHotspot`/`CommandDeck`/`DecisionDock`/`MobileBottomSheet`/`MobileBottomNav` components do not exist yet.
- `page.tsx` must be rewritten to use `next/dynamic(..., { ssr: false })` for `RepositoryProvider` and consume `useLemonade`.
- No Playwright screenshot verification (1440x900 desktop, 390x844 mobile) has been run because there is no shell to screenshot yet.
- Hotspot rectangle percentages in `LOCATION_HOTSPOTS` are first-pass estimates from the UI/UX spec's ASCII layout and have not been visually validated against real art (art does not exist until Stage 13).

#### Documentation updated

- `docs/production/03-dependency-map.md`: yes
- `docs/production/01-implementation-roadmap.md`: yes
- Other: `docs/production/06-agent-handoff.md` rewritten with the current exact resume point.

### CHG-20260711-013 - Complete and verify Stage 9 responsive town dashboard

- Timestamp: 2026-07-11 20:05-20:30 CST
- Author/agent: Codex implementation agent
- Stage: 9
- Change type: feature/fix/test
- Status: completed
- Request/source: user requested continuing, fixing, and advancing from the partially implemented Stage 9 shell.

#### Intent

Finish the static Lemonade Lane dashboard gate with a responsive, accessible shell that renders canonical seed data safely before Stage 10 adds business commands.

#### Changed

- Wired `RepositoryProvider` into `page.tsx` through `next/dynamic(..., { ssr: false })` and rendered `AppShell`.
- Added desktop/mobile shell and world components: `AppShell`, `TopBar`, `NavRail`, `MobileBottomNav`, `MobileBottomSheet`, `CommandDeck`, `DecisionDock`, `WorldStage`, `AssetTile`, and `LocationHotspot`.
- Fixed the mobile height model so the 42vh world, status header, Today content, and 64px bottom navigation remain contained within 390x844 rather than stacking independent viewport heights beyond the screen.
- Added keyboard-operable `collapsed`/`half`/`full` mobile sheet states and retained tap/button access for every location.
- Set `next.config.ts` `devIndicators: false` so the development indicator cannot cover the required mobile Town control during browser verification.
- Replaced the obsolete Stage 2 E2E baseline with `town-dashboard.spec.ts` and saved desktop/mobile Chromium screenshot baselines.

#### Behavioural impact

The root route now displays the static Lemonade Lane dashboard on desktop and mobile. Seeded Ready, Cooling, mission, resident, goal, patrol, and town-location state are visible; missing Stage 13 artwork uses stable tinted fallbacks. No business command or domain/game rule changed.

#### Verification

- `corepack pnpm typecheck`: PASS (4 packages).
- `corepack pnpm lint`: PASS.
- `corepack pnpm test`: PASS (10 files, 136/136 tests).
- `corepack pnpm format:check`: PASS.
- `corepack pnpm --filter @lemonade/web build`: PASS.
- `corepack pnpm --filter @lemonade/extension build`: PASS (203.7 kB total).
- `corepack pnpm test:e2e`: PASS (2/2 Chromium).
- Playwright baselines at 1440x900 and 390x844 were visually inspected: no horizontal overflow, incoherent overlap, missing critical fallback, or covered mobile control.
- Browser checks cover keyboard hotspot activation, client hydration without console errors, mobile viewport containment, all sheet states, and manual reduced-motion override.

#### Review

- Correctness/product truth: seed and selectors are read-only; Skip/Buy/allocation rules are untouched; no AI or extension capability is implied.
- Architecture/style: UI uses repository selectors and contains no direct domain/game mutation; no new dependency was added.
- UX/accessibility: town remains full-bleed, hotspots are real approximately 44px buttons, focus is visible, mobile controls fit, and reduced motion is exercised.

#### Risks and follow-up

- All world art is intentionally fallback-only until Stage 13.
- Stage 9 buttons that lead into Capture/Review/business actions become functional in Stage 10; this stage proves layout and accessible controls only.

#### Documentation updated

- `docs/production/01-implementation-roadmap.md`: Stage 9 completed with evidence.
- `docs/production/03-dependency-map.md`: Stage 9 shell dependencies recorded.
- `docs/production/06-agent-handoff.md`: current resume point moved to Stage 10.

### CHG-20260711-014 - Stage 10 slice 1: manual Capture to genuine Cooling

- Timestamp: 2026-07-11 20:32-20:40 CST
- Author/agent: Codex implementation agent
- Stage: 10
- Change type: feature/fix/test
- Status: partial
- Request/source: user requested Stage 10 progress after a report of remaining work.

#### Intent

Prove the first web-only behavioural slice without extension or AI: manually capture a temptation, classify it, show deterministic same-job evidence, and place it into a genuine 24-hour Cooling state.

#### Changed

- `packages/domain/src/transaction.ts`: `CAPTURE_DECISION` now uses the existing `findSameJobMatches` rule and persists ranked `overlapItemIds` instead of always storing an empty array.
- `packages/domain/src/decision-commands.test.ts`: added regression coverage that the canonical daily-walking capture records seeded same-job items.
- `apps/web/src/components/business/capture-flow.tsx`: added manual entry, AUD price/category/job fields, Need/Replacement/Want classification, progressive best-match evidence, command-only Capture/Cooling submission, recoverable errors, and real review timestamp confirmation.
- `CommandDeck`/`AppShell`: wired the `I'm tempted` action to the contextual Capture panel while keeping the town visible.
- Photo and Scout modes remain disabled with truthful copy; no file upload or extension import is claimed.
- `tests/e2e/town-dashboard.spec.ts`: added a manual Capture -> Cooling path that verifies the new Cooling and separate seeded Ready both survive refresh.

#### Verification

- `corepack pnpm typecheck`: PASS (4 packages).
- `corepack pnpm lint`: PASS.
- `corepack pnpm test`: PASS (10 files, 136/136 tests).
- `corepack pnpm format:check`: PASS.
- `corepack pnpm --filter @lemonade/web build`: PASS.
- `corepack pnpm test:e2e`: PASS (3/3 Chromium).

#### Review and follow-up

- Match truth remains deterministic and React-free; UI writes only through repository commands.
- Cooling copy explicitly states that nothing was bought or counted as saved.
- Stage 10 remains partial. Next priority is seeded Ready review plus honest outcome/repair mission controls.

#### Documentation updated

- `docs/production/01-implementation-roadmap.md`: Stage 10 marked partial.
- `docs/production/03-dependency-map.md`: Capture flow dependency recorded.
- `docs/production/06-agent-handoff.md`: resume point advanced within Stage 10.

### CHG-20260711-015 - Complete Stage 10 web business UX

- Timestamp: 2026-07-11 20:42-21:00 CST
- Author/agent: Codex implementation agent
- Stage: 10
- Change type: feature/test/fix
- Status: completed
- Request/source: user requested completing Stage 10 in one ordered execution list.

#### Intent

Finish the complete web-only behavioural loop before starting extension work, preserving honest purchase, reuse, mission, and planned-allocation semantics.

#### Changed

- Added `ReadyReview` with original job/motive, persisted owned-item evidence, Buy-neutral, real-Need, Use existing, Repair, and Extend actions.
- Repair explicitly creates/accepts a repair mission, records the reuse commitment, resolves the user-confirmed result, and makes Workshop available through existing event projection.
- Added mission status/check-in presentation, time-gated completion, and neutral cancellation controls.
- Added optional Planned Allocation after skipped outcomes only; copy states that planning does not save or transfer money.
- Added `DecisionsPanel` for Ready/Cooling/History/Missions and wired Decision Dock/navigation context selection.
- Added `MyStuffPanel` with contextual Quick Add and an explicit empty-state fallback.
- Added functional local-photo Capture; the file stays local to the form and is not uploaded/persisted. Scout prefill remains disabled until the extension bridge stage.
- Added invalid-import recovery while retaining existing loading and repository-error fallbacks.
- Expanded E2E to Buy, Use existing, Repair, Extend, Photo, Quick Add, allocation, Workshop availability, invalid import, and refresh persistence.
- Self-review fix: hid Planned Allocation for Buy/Extend/Need outcomes rather than relying on a later domain rejection.

#### Verification

- `corepack pnpm typecheck`: PASS (4 packages).
- `corepack pnpm lint`: PASS.
- `corepack pnpm test`: PASS (10 files, 136/136 tests).
- `corepack pnpm format:check`: PASS.
- `corepack pnpm --filter @lemonade/web build`: PASS.
- `corepack pnpm --filter @lemonade/extension build`: PASS (203.7 kB).
- `corepack pnpm test:e2e`: PASS (8/8 Chromium).

#### Three-pass review

- Correctness/truth: Buy is neutral; Skip alone changes no goal; allocation is explicit and planned-only; match/eligibility remain deterministic; no AI decides outcomes.
- Architecture/style: UI dispatches existing commands and does not mutate persisted truth directly; photo and panel state are transient; no dependency added.
- UX/accessibility: town remains visible, actions are keyboard/tap controls, empty/error/invalid states recover, and all required outcome branches are browser-tested.

#### Risks and follow-up

- Extension prefill is intentionally unavailable until Stages 11-12; invalid tokens fall back to manual Capture.
- Mission completion remains correctly time-gated by the existing 24-hour engine; the UI presents its future check-in and neutral cancellation.
- Real art/animation remains Stage 13.

#### Documentation updated

- `docs/production/01-implementation-roadmap.md`: Stage 10 completed.
- `docs/production/03-dependency-map.md`: business component dependencies recorded.
- `docs/production/06-agent-handoff.md`: resume point advanced to Stage 11.

### CHG-20260711-016 - Complete Stage 11 controlled detection and WXT Scout

- Timestamp: 2026-07-11 21:01-21:10 CST
- Author/agent: Codex implementation agent
- Stage: 11
- Change type: feature/test/privacy
- Status: completed
- Request/source: user requested executing Stage 11 sequentially from a written list.

#### Intent

Bring Lemonade into the controlled shopping context with confidence-gated, privacy-safe purchase intent intervention while keeping Continue neutral and deferring cross-surface persistence to Stage 12.

#### Changed

- Added `/demo-store`, a deterministic static Cloudstep sneaker page with Product/Offer JSON-LD, semantic product fields, and accessible Add to Cart.
- Added pure JSON-LD, Open Graph, and semantic extraction; confidence scoring; and accessible purchase-action discovery.
- Replaced the baseline extension badge with Shadow Root `ShoppingScout` hidden/peeking/curious/prompting/paused states.
- Added Pause, Continue anyway, Snooze this site for this tab, Hide, and one-prompt-per-page-session behavior.
- Continue writes only a session repeat marker and remains neutral. Pause retains no product outside React memory; no extension repository exists yet.
- Added accurate extension privacy options copy and explicit `permissions: []`.
- Added four detector unit tests and three unpacked-extension Chromium E2E paths.

#### Verification

- `corepack pnpm typecheck`: PASS (4 packages).
- `corepack pnpm lint`: PASS.
- `corepack pnpm test`: PASS (11 files, 140/140 tests).
- `corepack pnpm format:check`: PASS.
- `corepack pnpm --filter @lemonade/web build`: PASS (`/demo-store` statically generated).
- `corepack pnpm --filter @lemonade/extension build`: PASS (210.58 kB total).
- Built manifest inspection: MV3, `permissions: []`, options page present, content matches only `http://127.0.0.1/*` and `http://localhost/*`.
- `corepack pnpm test:e2e`: PASS (11/11; three tests load the real unpacked extension in Chromium).

#### Three-pass review

- Correctness/truth: only high-confidence intent auto-prompts; medium confidence is non-modal; Continue is neutral; no product is persisted before/after Pause in this pre-bridge stage.
- Architecture/style: extraction/confidence are pure and React-free; UI consumes detection output; no dependency or permission was added.
- UX/privacy/accessibility: Add to Cart and all Scout actions are accessible buttons; prompts are session-bounded; no checkout/payment/address/account/history access exists.

#### Risks and follow-up

- Generic retailer support is intentionally not claimed; manifest scope remains the controlled localhost storefront until deployment configuration is known.
- Pause does not yet open/import into Lemonade; that exact-once persistent handoff is Stage 12.
- The Scout uses a CSS placeholder mark until Stage 13 art integration.

#### Documentation updated

- `docs/production/01-implementation-roadmap.md`: Stage 11 completed.
- `docs/production/03-dependency-map.md`: detector/Scout dependencies recorded.
- `docs/production/06-agent-handoff.md`: resume point advanced to Stage 12.

### CHG-20260711-017 - Complete Stage 12 exact-once bridge and Scout return

- Timestamp: 2026-07-11 21:11-21:20 CST
- Author/agent: Codex implementation agent
- Stage: 12
- Change type: feature/test/privacy
- Status: completed
- Request/source: user requested planning and executing the next roadmap stage.

#### Intent

Connect the controlled shopping Scout to Lemonade Lane with an exact-once, state-first handoff that remains safe when the extension, bridge, or animation is unavailable.

#### Changed

- Implemented domain `IMPORT_DETECTED_PRODUCT`: extension-origin genuine Cooling, deterministic same-job overlap, import-ID replay dedupe, and import event.
- Added typed extension bridge messages and pending-handoff record.
- Added WXT background storage handlers for STORE/GET/ACK; pending data clears only for the matching acknowledged import.
- Added narrowly scoped page bridge with request IDs and a web client with a bounded timeout.
- Pause now persists the handoff before opening/focusing Lemonade Lane.
- Added `BridgeImportController`: waits for repository hydration, dispatches the import, ACKs after success, then displays Browser Gate return/landing status.
- Added controlled product job metadata so the imported sneaker retains the deterministic daily-walking same-job match.
- Added domain and real unpacked-extension exact-once tests, including refresh dedupe.
- Manifest adds only `storage`; localhost/127.0.0.1 match scope is unchanged.

#### Verification

- `corepack pnpm typecheck`: PASS (4 packages).
- `corepack pnpm lint`: PASS.
- `corepack pnpm test`: PASS (12 files, 141/141 tests).
- `corepack pnpm format:check`: PASS.
- web and extension production builds: PASS; extension total 215.83 kB.
- manifest inspection: MV3, service worker, `permissions: ["storage"]`, localhost/127.0.0.1 only.
- `corepack pnpm test:e2e`: PASS (12/12); real Pause -> storage -> web import -> ACK -> return -> refresh path creates exactly one decision.

#### Three-pass review

- Correctness/truth: import ID and command ID replay are safe; ACK follows web persistence; imported Cooling is distinct from seeded Ready; animation has no authority.
- Architecture/style: background owns extension storage; page sees only GET/ACK; web still uses command/repository writes; missing bridge times out to local fallback.
- UX/privacy/accessibility: Pause is explicit, Continue remains neutral, return status is accessible, reduced-motion CSS bounds effects, and no checkout/payment/address/account/history access was added.

#### Risks and follow-up

- Deployment-domain match patterns must be added only after the real deployment URL is known.
- Current return is a state-safe UI status effect; coherent Scout/Browser Gate art and motion land in Stage 13.
- Storage contains only the explicitly paused pending product and is deleted after ACK.

#### Documentation updated

- `docs/production/01-implementation-roadmap.md`: Stage 12 completed.
- `docs/production/03-dependency-map.md`: bridge/storage boundaries recorded.
- `docs/production/06-agent-handoff.md`: resume point advanced to Stage 13.

### CHG-20260711-018 - Complete Stage 13 art integration and scene feedback

- Timestamp: 2026-07-11 21:23-22:08 CST (asset generation and initial wiring, undocumented at the time) and 22:08-22:50 CST (location art completion, cleanup, re-verification, documentation)
- Author/agent: Codex implementation agent (initial groundwork, session interrupted before change-log/roadmap/handoff were updated) and Claude implementation agent (verification, remaining location art, documentation)
- Stage: 13
- Change type: feature/asset/test
- Status: completed
- Request/source: user asked the resuming agent to audit repository state after an unlogged interruption, then to plan and complete Stage 13.

#### Intent

Replace remaining CSS-primitive placeholders with coherent approved art and add bounded, non-authoritative scene feedback, without moving business rules into animation or generating new art beyond what the project's tooling can produce.

#### Changed

Inherited from the undocumented interruption (verified working, not modified except where noted):

- Added `apps/web/public/art/lemonade-lane-town.png` (town base, all six locations laid out), `scout-sheet.png` (Scout idle/peek/carry/cooler/acknowledge/celebrate, 3x2 sprite sheet), `workshop-residents-sheet.png` (Workshop locked/ready/active + Mender idle/repair + Host activity, 3x2 sprite sheet).
- Wired `world.town.base`, `world.workshop.{locked,ready,active}`, and all `CHARACTER_MANIFEST` entries in `apps/web/src/assets/manifest.ts`.
- Added `apps/web/src/effects/scene-director.tsx`, mounted in `app-shell.tsx`; consumes the existing `TransientEffect` queue (`PROJECT_AVAILABLE`, `RESIDENT_TRAVELLED`, `LOCATION_ACTIVATED`, `LOCATION_LIVED_IN`) and shows a bounded, auto-dismissing (1s) status toast with Scout/Mender art.
- Replaced the extension's CSS-placeholder Scout badge with the real `scout-sheet.png` sprite in `apps/extension/src/companion/shopping-scout.tsx` (idle/peek/carry positions by state).

Completed this iteration:

- Cropped `home-nook.png`, `browser-gate.png`, `picnic-green.png`, `little-station.png` from the existing approved town-base image using the exact `LOCATION_HOTSPOTS` percentage rects (no padding), so each overlay lands pixel-for-pixel on the region the base image already depicts and composites as a real, non-placeholder tile rather than a stretched or mismatched patch.
- Wired these four into `ASSET_MANIFEST` (`world.home.active`, `world.browser-gate`, `world.picnic.ready` / `.active-or-static`, `world.station.ready` / `.active-or-static`) and extended `worldAssetForLocation` in `world-stage.tsx` so Home Nook and Browser Gate always render their art, and Picnic Green/Little Station render it once unlocked (locked state keeps the existing dashed-outline/tint hotspot, matching the P0 scope that only requires a locked variant for Workshop).
- Quiet Garden intentionally kept as a tinted locked placeholder; the roadmap's P0 art scope lists it as optional/cuttable and it has no unlock path in this build.
- Moved the unused chroma-key source files (`scout-sheet-chroma.png`, `workshop-residents-sheet-chroma.png`, ~4.3 MB combined) from `apps/web/public/art/` to `docs/production/art-source/`; they were never referenced by any component and were shipping as dead weight in the deployed bundle.
- Regenerated the Playwright screenshot baselines (`town-dashboard-desktop-chromium-win32.png`, `town-dashboard-mobile-chromium-win32.png`) since the prior baselines predated all Stage 13 art and no longer matched real (correct) output.

#### Explicitly out of scope (documented cut, not an oversight)

- "Product/UI" P0 art (sneakers cutout, existing-shoes cutout, cooler icon, mission-slot visuals, planned token, paper dust/spark set) was not produced: this environment has no image-generation tool available, only the previously-approved sprite sheets and Pillow-based cropping of them. The Command Deck and Ready Review panels are typographic per `docs/13-town-dashboard-uiux.md` section 8/13 (clean sans, no nested cards/cutouts), so their absence does not block the demo path or violate the visual spec.
- Distinct per-effect animations (Scout peek arc into town, cooler-lid-close, a dedicated repair-loop animation distinct from the generic status toast) were not built as separate bespoke sequences; `SceneDirector` and `BridgeImportController` already provide bounded, state-safe, reduced-motion-respecting feedback for resident travel, project activation, and Scout return using the existing character frames. Building additional distinct sequences was judged lower priority than closing the location-art gap given the deadline.

#### Verification

- `corepack pnpm typecheck`: PASS (4 packages).
- `corepack pnpm lint`: PASS.
- `corepack pnpm test`: PASS (12 files, 141/141 tests).
- `corepack pnpm format:check`: PASS.
- `corepack pnpm --filter @lemonade/web build`: PASS.
- `corepack pnpm --filter @lemonade/extension build`: PASS (unchanged, 1.63 MB total).
- `corepack pnpm test:e2e`: PASS (12/12 Chromium), including the Stage 9 accessibility assertion `getByRole("img", { name: "Home Nook with the decision cooler" })`, which the interrupted session's `world-stage.tsx` state (`worldAssetForLocation` returning `null` for `home_nook`) would have failed had it been re-verified before the interruption.
- Screenshots visually inspected at 1440x900 and 390x844: all six locations show coherent illustrated art, labels stay legible on their pill backgrounds, no overlap with the Scout or Command Deck, no horizontal overflow.

#### Three-pass review

- Correctness/truth: no domain/game-engine files touched; location art selection reads only the existing `TownLocation.state`; no new transitions, XP, or duplicate-event paths introduced; demo continues to work without AI.
- Architecture/style: change is confined to `apps/web` assets/components plus doc/asset-location cleanup; `worldAssetForLocation` extended using the same pattern already established for Workshop; no new dependency; dead chroma files removed from the shipped bundle.
- UX/accessibility/visual: reduced-motion behaviour unchanged and still verified by the mobile E2E path; keyboard activation of Workshop still verified; touch targets and hotspot labels unchanged; every location now has real art or an explicitly justified locked placeholder (Quiet Garden).

#### Risks and follow-up

- The four newly-wired location images are single static states; Picnic Green and Little Station do not have a distinct "locked" illustration (not required by the P0 art scope, but a future iteration could add one for extra polish).
- Product-specific cutout art remains absent; if an image-generation tool becomes available before submission, adding the sneaker/existing-shoes cutouts to Capture/Ready Review would be pure polish, not required by current exit criteria.
- Stage 14 (verification/accessibility/performance/hardening) and Stage 15 (deployment/submission) remain outstanding, and the deadline (2026-07-12 10:00 Shanghai CST) is close; prioritise Stage 14's critical-path checks over further art polish.

#### Documentation updated

- `docs/production/01-implementation-roadmap.md`: Stage 13 marked completed with evidence.
- `docs/production/06-agent-handoff.md`: resume point advanced to Stage 14, asset/test inventory refreshed.

### CHG-20260711-019 - First Git commit and push (Stages 1-13)

- Timestamp: 2026-07-11 22:55 CST
- Author/agent: Claude implementation agent
- Stage: n/a (repository/deployment discipline)
- Change type: git
- Status: completed
- Request/source: explicit user instruction to push a version before starting Stage 14.

#### Changed

- `git ls-remote` reconfirmed the remote was still empty (zero refs) immediately before committing.
- Reviewed the full `git add -A --dry-run` file list for secrets; none found (`.env` files remain ignored, only `.env.example` is tracked).
- Created root commit `d73cc176af9eb580401ab616e1ad5a90efd63d36` (147 files, all of Stages 1-13) and pushed to `origin/main` at `https://github.com/Edd1eOS/Flagship_Hackathon_2026.git`.

#### Verification

- `git status --short --branch` after push: clean, `main...origin/main` with no ahead/behind.

#### Risks and follow-up

- This is the only commit so far; all subsequent stage work must be committed explicitly when the user requests it, following the same fresh-remote-check discipline.

### CHG-20260711-020 - Stage 14 slice 1: resident-to-project assignment UI and second push

- Timestamp: 2026-07-11 23:10 CST
- Author/agent: Claude implementation agent
- Stage: 14 (verification, accessibility, performance, hardening)
- Change type: feature + git
- Status: completed
- Request/source: found already implemented but uncommitted at session start (undocumented, like the Stage 13 interruption); verified, documented, and pushed at explicit user request ("push a version first, then plan and execute Stage 14").

#### Changed

- `apps/web/src/components/shell/app-shell.tsx`: resident selection state, `eligibleLocationIds` derivation (assignable, unlocked, either `available` or already held by the selected resident), `previewedAssignments` derivation, and handlers dispatching the existing `PREVIEW_ASSIGNMENT`/`CANCEL_ASSIGNMENT`/`CONFIRM_TOWN_PLAN` commands (no new domain/game-engine surface - these commands and `town-engine.ts` already existed from Stage 8).
- `apps/web/src/components/shell/command-deck.tsx`: replaced the read-only `residents` list with an interactive `residentRows` list (select resident, cancel a preview, confirm the plan), a `ResidentRow` view type owned by the component instead of leaking `TownResidentView` from `@lemonade/game-engine`.
- `apps/web/src/components/world/world-stage.tsx` and `location-hotspot.tsx`: added `eligible` highlighting (leaf-green border/fill) and an accessible `"tap to assign"` label suffix on hotspots the selected resident can be assigned to.
- `tests/e2e/town-dashboard.spec.ts`: added the roadmap's required "project eligibility -> two resident assignments -> Workshop active" Playwright path (Mender to Workshop, Host to Picnic Green, confirm, reload-persists) and a cancel-before-confirm path.

#### Verification

```text
corepack pnpm typecheck        -> PASS (4 packages)
corepack pnpm lint             -> PASS
corepack pnpm test              -> PASS (141/141)
corepack pnpm format:check     -> PASS (after `prettier --write` on app-shell.tsx)
corepack pnpm --filter @lemonade/web build       -> PASS
corepack pnpm --filter @lemonade/extension build -> PASS (1.63 MB total, unchanged)
corepack pnpm test:e2e         -> PASS (14/14 Chromium)
```

- `git ls-remote origin main` immediately before committing: still exactly `d73cc176af9eb580401ab616e1ad5a90efd63d36`, matching local `origin/main`, so no remote-side change to reconcile.

#### Risks and follow-up

- Remaining Stage 14 roadmap items are still open: ARIA snapshots, explicit touch-target/keyboard audit, console/network error inspection, anonymous clean-profile deployment check, image size/preload profiling, dead-code/debug-log removal, and the mandatory `04-iteration-workflow.md` code-style review. Tracked as the next iterations.

### CHG-20260711-021 - Complete Stage 14 hardening pass

- Timestamp: 2026-07-11 23:41 CST
- Author/agent: Claude implementation agent
- Stage: 14 (verification, accessibility, performance, hardening)
- Change type: test + fix + docs
- Status: completed
- Request/source: user instruction to plan and execute the rest of Stage 14 after the CHG-20260711-020 push.

#### Changed

- `tests/e2e/town-dashboard.spec.ts`: added the roadmap's "first open/seed" path (asserts the canonical seed - Japan trip fund goal, Ready (1) Retro court sneakers, Home Nook lived-in / Browser Gate available / Workshop+Picnic+Station locked, 10 My Stuff items - with zero prior action) and the "offline web fallback" path (goes offline after initial load, then completes a full manual-capture-to-Cooling-to-Buy loop, asserting zero failed network requests). Added four `toMatchAriaSnapshot` assertions (Today panel, Location details panel, Ready review panel, Capture flow panel) satisfying the roadmap's ARIA-snapshot task. Added a file-wide `beforeEach`/`afterEach` console-error/page-error guard so every test in the file (not just the ones that checked explicitly before) fails on any uncaught console error.
- `tests/e2e/extension-scout.spec.ts`: added the same console/page-error tracking to all four extension tests (`trackConsoleErrors` helper), including both pages (`store` and `lane`) in the handoff test.
- `apps/web/src/lib/preload-assets.ts` (new) + `apps/web/src/components/shell/app-shell.tsx`: the new offline test caught a real gap - Picnic Green/Little Station art (`preload: false` in the manifest) was only ever fetched the instant a location unlocked mid-session, so unlocking while offline (or on a flaky venue connection) would have shown a broken image at the exact "repair climax" moment Stage 13 was built around. `preloadWorldImages()` eagerly warms the browser cache for every manifest image (world + character) once on mount via `useEffect`, independent of lock state.
- `apps/web/src/app/icon.png` (new): the new console-error guard caught a second real gap - every page load 404s on the browser's implicit `/favicon.ico` request because the app had no icon at all, which is exactly the kind of thing a judge opening DevTools on a fresh profile would see. Added a small Pillow-generated brand-color (`--color-lemon`/`--color-ink`) mark; Next.js App Router serves it automatically from `src/app/icon.png`, no other wiring needed.
- Touch-target audit (roadmap 44px minimum) found and fixed 8 real sub-44px or unsized interactive elements: `top-bar.tsx` sound/settings buttons (36px to 44px), `mobile-bottom-sheet.tsx` snap-state handle (32px to 44px), `app-shell.tsx` Reset Demo and invalid-import Dismiss buttons, and the "Today" back-link plus one secondary action button each in `command-deck.tsx` and `ready-review.tsx`, plus the same back-link in `capture-flow.tsx`. Screenshot baselines regenerated after the layout shift.
- Verified (no code change needed): extension manifest permissions (`["storage"]` only, `matches` scoped to `127.0.0.1`/`localhost` only) match the documented privacy claims exactly; dependency lists in `apps/web` and `apps/extension` are already minimal with no unused packages; no `console.log`/`debugger`/`TODO`/commented-out code exists anywhere in `apps/*/src` or `packages/*/src`. Fixed two stale comments in `asset-tile.tsx` that still described a pre-Stage-13 "art doesn't exist yet" state.
- Anonymous/clean-profile deployment: not a separate new test - every Playwright test in both spec files already runs in an isolated fresh browser context (`town-dashboard.spec.ts`) or a brand-new temporary Chrome profile directory (`extension-scout.spec.ts`) with no prior storage, so the existing suite already exercises this path on every run; the new console-error guard is what would have caught a cold-start-only failure such as the favicon 404 above.

#### Verification

```text
corepack pnpm typecheck        -> PASS (4 packages)
corepack pnpm lint             -> PASS
corepack pnpm test              -> PASS (141/141)
corepack pnpm format:check     -> PASS (tracked files only; untracked .claude/settings.local.json is not part of this repo)
corepack pnpm --filter @lemonade/web build       -> PASS (now also emits /icon.png)
corepack pnpm --filter @lemonade/extension build -> PASS (1.63 MB total, unchanged)
corepack pnpm test:e2e         -> PASS (16/16 Chromium, up from 14)
```

#### Risks and follow-up

- Lossless PNG re-optimisation was measured (0.0-2.3% savings across the 7 art files, ~6.9 MB total) and judged not worth the risk of touching approved Stage 13 art this close to the deadline; no lossy/palette recompression was attempted since that would alter approved visual content without a new sign-off.
- Stage 15 (deployment, repository, video, submission) is still not started.

### CHG-20260711-022 - Stage 15 slice 1: README, secret check, extension ZIP

- Timestamp: 2026-07-11 23:55 CST
- Author/agent: Claude implementation agent
- Stage: 15 (deployment, repository, video, submission)
- Change type: docs + build
- Status: partially completed - only the parts of Stage 15 that need no external account/credentials or video recording; user explicitly deferred Vercel deployment and video recording to decide later.
- Request/source: user chose "do the safe parts first" when asked how to proceed with Stage 15's higher-risk tasks (Vercel deploy, video recording).

#### Changed

- `README.md`: replaced the Stage-2-era placeholder stub with the full roadmap-required content - problem, value proposition, demo flow (the roadmap's Final Demo Order), architecture table, local setup commands, extension-loading steps, a seed/demo-data disclaimer, a privacy-limits section, source references into `docs/production/`, and the Lemonade Inc. non-affiliation note required by `docs/00-decision-log.md`'s known-brand-risk entry. "Team & roles" is left as an explicit placeholder for the user - no team roster exists anywhere in the repo's docs, and inventing names would misrepresent the submission.
- Confirmed `.env.example` contains no secrets (one commented-out optional P1 key) and `.gitignore` excludes all `.env*` variants except the `.example` files - no change needed.
- Built the extension submission artifact: `corepack pnpm --filter @lemonade/extension zip` produced `apps/extension/.output/lemonadeextension-0.0.0-chrome.zip` (1.48 MB); `.output/` is gitignored by design, so the zip itself is a local build artifact, not a committed file - the README documents the exact command to reproduce it and the unpacked-load steps for judges who prefer that.

#### Verification

- `git status --short` after the zip build: only `README.md` changed; the build output correctly stayed untracked.

#### Risks and follow-up

- Stage 15 tasks 3 (Vercel deploy), 6-7 (screen captures/demo video), 9 (second-device/clean-profile playback check), 10 (submission checklist), and 11 (code freeze) are still open and need the user's explicit go-ahead - deploying and recording are hard to reverse or require the user's own voice/screen.

### CHG-20260712-023 - Deploy apps/web to Vercel production

- Timestamp: 2026-07-12 00:15 CST
- Author/agent: Claude implementation agent
- Stage: 15 (deployment, repository, video, submission)
- Change type: deploy
- Status: completed
- Request/source: explicit user instruction ("部署吧") after confirming GitHub was up to date.

#### Changed

- User authenticated the Vercel CLI themselves via `vercel login` (device flow), per their choice when asked how to authorise.
- Linked the repo to a new Vercel project (`xinxiang-lei/web`). First attempt linked from inside `apps/web`, which only uploaded that subdirectory and failed (`npm install` couldn't see the pnpm workspace or `@lemonade/domain`/`@lemonade/game-engine`). Re-linked from the repository root instead, then set the project's `rootDirectory` to `apps/web` via the Vercel REST API (`PATCH /v9/projects/{id}`) using the CLI's own stored session token, so a normal `vercel --prod` deploy from the repo root uploads the full monorepo and Vercel's own pnpm-workspace-aware install/build runs correctly. A short-lived root `vercel.json` with manual `buildCommand`/`installCommand`/`outputDirectory` was tried first, found unnecessary once `rootDirectory` was set correctly, and removed - Vercel's zero-config Next.js + monorepo detection handles it.
- Production deploy succeeded: `corepack pnpm install --frozen-lockfile` (all 5 workspace projects) then `next build` inside `apps/web`, same output as the local build (`/`, `/_not-found`, `/demo-store`, `/icon.png`, all static).
- Local artefacts: `.vercel/` at the repo root and a new `apps/web/.gitignore` (containing only `.vercel`) were created by the CLI; both are gitignored, no secrets committed.

#### Verification

- `curl -s -o /dev/null -w "%{http_code}"` against the production alias: `/` -> 200, `/icon.png` -> 200, `/demo-store` -> 200.
- `curl` on `/` contains the string "Lemonade" (page actually renders, not an error page).

#### Result

- Production URL: `https://web-seven-pied-41.vercel.app` (stable alias; the per-deploy URL `https://web-cx2sc7e0y-xinxiang-lei.vercel.app` also resolves to the same build and will change on every future deploy).

#### Risks and follow-up

- The app is entirely client-side (localStorage-backed, no backend), so this static/prerendered deployment is expected to behave identically to the local dev server for the demo path; no server-side environment variables are needed.
- The browser extension still must be loaded from a local unpacked build or the zip artifact (Chrome Web Store publishing is out of scope for this hackathon submission) - the extension's content-script match scope (`http://localhost/*`, `http://127.0.0.1/*`) does not include the Vercel domain, so the Scout will only activate against the local `/demo-store` page, not the deployed one. This is expected and should be called out in the demo video script so the video doesn't imply the deployed URL is where the extension activates.
- Stage 15 tasks 6-7 (video), 9 (clean-device playback check), 10 (submission checklist), 11 (code freeze) are still open.

### CHG-20260712-024 - Fix missing Goal view and app-wide click affordance on the deployed site

- Timestamp: 2026-07-12 00:35 CST
- Author/agent: Claude implementation agent
- Stage: n/a (correctness/UX fix found via real usage of the deployed URL, not a roadmap stage)
- Change type: fix + feature
- Status: completed
- Request/source: user tested the newly deployed production URL and reported world hotspots feeling unclickable/static, scene-effect toasts popping abruptly, and a "This section opens later in the build." placeholder visible on a real nav tab - asked directly whether the product was actually unfinished.

#### Root causes found

1. **`NavId` "goal" was never implemented.** `app-shell.tsx` special-cased `activeNav === "goal"` to render only the literal placeholder string "This section opens later in the build." - a Stage-9-era stub that every later stage's "completed and verified" claim never actually clicked through, including this agent's own Stage 14 hardening pass. The `Goal`/`PlannedAllocation` domain data (target/starting/planned amounts, per-decision planned allocations) has existed since Stage 3 and was already summarised in the Top Bar, but no dedicated view ever consumed it.
2. **No button in the app had a pointer cursor.** Tailwind v4's preflight leaves `<button>` at the browser's default arrow cursor (this was changed upstream from Tailwind's old default); only one label in `capture-flow.tsx` had ever added `cursor-pointer` explicitly. Combined with location hotspots having a fully transparent idle-state border/background (only `hover:border-leaf`, invisible until the mouse happens to already be over the exact percentage-rect), this made every clickable region in the app - especially the world hotspots sitting directly on illustrated art - read as flat, non-interactive images even though the click handlers worked.
3. **No press/click feedback anywhere.** Only 3 uses of Tailwind's `active:` variant existed in the whole codebase.
4. **`SceneDirector`'s toast popped in and out with `if (!effect) return null`** (a hard mount/unmount, no transition) plus a jarring `animate-[pulse_500ms_ease-in-out_2]` - it appeared and vanished instantly with a flash in between.
5. **A genuine, pre-existing correctness gap surfaced while investigating (1)-(4) via a real offline test run**: `/art/*` files were served with `Cache-Control: public, max-age=0`, which forces the browser to revalidate with the server on every use regardless of `preloadWorldImages()` (CHG-20260711-020) - meaning the "works offline after load" claim from Stage 14 was not actually true once art needed revalidation. This affected the local dev server, the local production build, and the live Vercel deployment identically (confirmed via `curl` on all three).

#### Changed

- `apps/web/src/components/business/goal-panel.tsx` (new): a real Goal side panel - name/type, a progress bar (`startingAmount + plannedAllocationTotal` against `targetAmount`, capped and explicitly labelled "planned money only - not saved or transferred funds" to match the app's existing truth-in-copy rules), and a list of individual `PlannedAllocation` entries joined to their originating decision's name.
- `apps/web/src/components/shell/app-shell.tsx`: `"goal"` now renders `GoalPanel` through the same `contextualDeck` slot as `DecisionsPanel`/`MyStuffPanel`, so the world stage stays visible next to it like every other tab (per the UI spec's "the world remains the dashboard" rule) instead of a full-screen takeover. The `activeNav !== "goal"` special case was deleted entirely.
- `apps/web/src/components/shell/nav-items.ts`: removed the stale Stage-9 comment claiming only "town" renders real content.
- `apps/web/src/app/globals.css`: added a zero-specificity `:where(button:not(:disabled))` rule restoring `cursor: pointer` and a `:active` press-scale globally, so no component was missed and no existing component's own `transition-*` utility gets overridden.
- `apps/web/src/components/world/location-hotspot.tsx`: idle (non-selected, non-eligible, non-locked) hotspots now carry a subtle always-visible border/background/shadow instead of `border-transparent`, so the interactive region reads as a UI element at rest, not only on hover.
- `apps/web/src/effects/scene-director.tsx`: replaced the instant mount/unmount + pulse with a `translate-y`/`opacity` cross-fade driven by local `entered` state (timers for enter at 10ms, leave at 700ms, actual removal at 1000ms, matching the previous total visible duration).
- `apps/web/next.config.ts`: added a `headers()` rule giving `/art/:path*` `Cache-Control: public, max-age=31536000, immutable`, so once `preloadWorldImages()` has fetched a file the browser never revalidates it again - this is what actually makes the offline-after-load claim true, not just the preload call by itself.
- `tests/e2e/town-dashboard.spec.ts`: added "Goal tab shows real progress beside the town, not a placeholder" (asserts the placeholder string has zero matches, real progress text renders, and the world stage/Home Nook stays visible alongside it).

#### Verification

```text
corepack pnpm typecheck        -> PASS (4 packages)
corepack pnpm lint             -> PASS
corepack pnpm test              -> PASS (141/141)
corepack pnpm format:check     -> PASS
corepack pnpm --filter @lemonade/web build -> PASS
corepack pnpm test:e2e         -> PASS (17/17 Chromium, up from 16)
```

- `curl -sD - http://127.0.0.1:3000/art/picnic-green.png` confirmed `Cache-Control: public, max-age=31536000, immutable` after the fix (was `max-age=0`).
- Visually inspected the desktop screenshot baseline and a manual Goal-tab screenshot after the change; screenshot baselines regenerated and re-verified passing.
- The offline e2e test (previously passing only by luck/timing) now passes deterministically for the right reason - confirmed by re-running it multiple times.

#### Risks and follow-up

- This was found through the user directly testing the deployed URL, not through this agent's own review passes across 14+ prior "completed and verified" stage claims - the Stage 14 three-pass self-review's UX/accessibility pass asked "are hotspots/buttons at least approximately 44px" (a size question) but never asked "does hovering/clicking actually look and feel interactive," and no stage's exit criteria included clicking through every nav tab. Both gaps should be treated as standing lessons for any remaining verification.
- Redeployed to Vercel after this fix; see the deployment follow-up entry.

### CHG-20260712-025 - Replace the full-rect hotspot highlight with a compact badge

- Timestamp: 2026-07-12 00:55 CST
- Author/agent: Claude implementation agent
- Stage: n/a (follow-up UX fix on CHG-20260712-024)
- Change type: fix
- Status: completed
- Request/source: user tested the redeployed site and reported the location hotspot's selected/eligible highlight was still a jarring hard-edged rectangle sitting over the hand-drawn art, and asked for either a proper button-style highlight or an outline that follows the actual shape.

#### Changed

- `apps/web/src/components/world/location-hotspot.tsx`: a true silhouette/outline highlight (option 2) isn't feasible - the town art is one composite base image, not per-location cutouts with alpha edges to trace, and no image-generation tool is available to produce them. Implemented the button-style highlight (option 1) instead: the outer `<button>` (still the full percentage-rect click target, unchanged position/size for the 44px touch-target requirement) now carries no visible border or background at all. The border/background color feedback (leaf for eligible, lemon for selected, dashed for locked, subtle leaf on hover) moved onto the small label badge itself (`{name}` + `{state}` pill, already anchored near the bottom of each location), which now reads as an actual UI chip/tag instead of a box drawn over the illustration.

#### Verification

```text
corepack pnpm typecheck        -> PASS (4 packages)
corepack pnpm lint             -> PASS
corepack pnpm test              -> PASS (141/141)
corepack pnpm format:check     -> PASS
corepack pnpm --filter @lemonade/web build -> PASS
corepack pnpm test:e2e         -> PASS (17/17 Chromium)
```

- Manually screenshotted the idle and eligible states after the change and visually confirmed the badge reads as a compact tag, not a rectangle over the art. Desktop/mobile screenshot baselines regenerated and re-verified passing.
- Redeployed to Vercel; see the deployment follow-up entry.

### CHG-20260712-026 - Extend Scout to the deployed domain; add a first-open hint

- Timestamp: 2026-07-12 01:05 CST
- Author/agent: Claude implementation agent
- Stage: n/a (usability follow-up)
- Change type: feature + fix
- Status: completed
- Request/source: user reported the dashboard gave no clue how to use it at a glance, and asked how to test the shopping-interception feature at all given the extension only worked on localhost. Asked and got explicit approval to: (a) widen the extension's activation scope to the deployed Vercel domain (a privacy/permission-scope change, confirmed with the user first per the mandatory material-question rule), and (b) add a lightweight first-open hint.

#### Changed

- `apps/extension/src/allowed-origins.ts` (new): single source of truth for the extension's activation scope, now `["http://localhost/*", "http://127.0.0.1/*", "https://web-seven-pied-41.vercel.app/*"]` - deliberately the exact stable alias, not a `*.vercel.app` wildcard, since that would match arbitrary third-party sites on the same public multi-tenant domain suffix. Imported into `wxt.config.ts` (`web_accessible_resources` matches), `entrypoints/shopping.content.tsx`, and `entrypoints/lemonade-bridge.content.ts` (both previously had the same array duplicated three times, a real risk of the lists silently drifting apart). The handoff URL itself needed no change - `shopping-scout.tsx` already builds it from `location.origin` dynamically, not a hardcoded host.
- `apps/web/src/components/shell/onboarding-hint.tsx` (new): a single dismissible banner below the Top Bar - "New here? Tap "I'm tempted" before buying something, or tap a building in town to see what's happening there." with a "Got it" button. Dismissal is persisted in `localStorage` (`lemonade.onboarding-dismissed`, independent of app/demo state, so Reset Demo does not resurface it). Rendered as a single JS string expression rather than mixed JSX text/`<strong>` children - an earlier attempt with inline `<strong>` tags silently dropped the space at certain line-wrap boundaries in the compiled output (confirmed via `innerHTML`, not just visual inspection), so the plain-string form was kept as the reliable fix.
- `README.md`: added a "Live demo" link at the top, updated the extension-loading/privacy sections to reflect the third allowed origin and that the deployed demo doesn't need a local server for the Scout half either.

#### Verification

```text
corepack pnpm typecheck        -> PASS (4 packages)
corepack pnpm lint             -> PASS
corepack pnpm test              -> PASS (141/141)
corepack pnpm format:check     -> PASS
corepack pnpm --filter @lemonade/web build       -> PASS
corepack pnpm --filter @lemonade/extension zip   -> PASS (1.48 MB)
corepack pnpm test:e2e         -> PASS (18/18 Chromium, up from 17)
```

- Rebuilt the extension and inspected `manifest.json` directly to confirm all three `matches`/`web_accessible_resources` entries include the Vercel domain.
- Loaded the rebuilt extension in a real (non-Playwright-managed) Chromium profile via `chromium.launchPersistentContext` against the live production URL and drove the full flow: Scout appears on `/demo-store` -> Pause -> a new tab opens at `https://web-seven-pied-41.vercel.app/?handoff=...` -> "Scout landed. Your decision is Cooling." -> Cooling (1) with "Cloudstep Runner Sneakers" listed. Screenshotted both steps.
- Verified the onboarding text renders with correct spacing via `innerText()`/`innerHTML()` inspection, not just a screenshot.

#### Risks and follow-up

- The Vercel alias is stable across redeploys (confirmed earlier in CHG-20260712-023), but if the project is ever renamed or the alias changes, `allowed-origins.ts` must be updated and the extension rebuilt/reloaded, or Scout will silently stop activating on the deployed page.
- The web app changed (`onboarding-hint.tsx`, `app-shell.tsx`), so it needs a fresh Vercel deploy for the hint to appear live; the extension change needs a rebuild plus the user reloading the unpacked extension in `chrome://extensions`, since Chrome does not hot-reload unpacked extensions.

### CHG-20260712-027 - Extension icon, locked-location unlock hints, and surfaced the XP/level system

- Timestamp: 2026-07-12 01:20 CST
- Author/agent: Claude implementation agent
- Stage: n/a (usability follow-up)
- Change type: fix + feature
- Status: completed
- Request/source: user reported the extension "looked gray and unusable," that the five town locations "don't respond to clicks and I don't know what they're for," and that "the whole scene/currency system feels dead." Diagnosed each rather than guessing.

#### Root causes and changes

1. **Extension icon.** The manifest never declared an `icons` field, so Chrome/Edge fell back to an auto-generated gray-square placeholder (first letter of the name on gray) in both the extensions page and the toolbar puzzle-piece menu - it read as broken even though the background service worker was genuinely running (confirmed via `context.serviceWorkers()` and a `chrome://extensions` screenshot showing the toggle already on, no error state). Added `apps/extension/public/icon/{16,32,48,96,128}.png` (resized from the existing web favicon for consistent branding); WXT auto-wires files at that exact path/size convention into `manifest.icons` with zero config changes. Verified the manifest picked them up and the extensions page now shows the real lemon-yellow mark. **Separately reported by the user afterward: the extension is still completely non-functional for them in both Chrome and Edge even with the correct chrome-mv3 folder selected - this fix does not resolve that, and is being tracked as a distinct, still-open problem (see next entry / follow-up) since it doesn't reproduce in this sandbox.**
2. **Locked-location detail panel.** `command-deck.tsx`'s "Location details" view only ever showed a "Why it's open" explanation for already-unlocked projects; a locked one showed nothing beyond "State: Locked," giving no indication of how to change that. Added `LOCKED_UNLOCK_HINTS` in `app-shell.tsx` (UI copy only, not a new domain rule - the actual unlock logic already lives in `PROJECT_RECIPES`) and a new "How to unlock" `<dt>/<dd>` pair, e.g. Workshop -> "Repair or reuse something you already own from a 'Ready' decision to unlock this."
3. **XP/level progression.** `packages/game-engine/progression.ts` (`getProgression`, `XP_PER_LEVEL = 30`) has existed since early stages with full domain support (`state.reflections`, `REFLECTION_XP = 10` per honest final review) but was never imported anywhere in `apps/web` - confirmed via a precise grep with zero matches. The entire reward feedback loop was invisible, which is almost certainly what read as "the currency system seems dead." Added a small "Lv N" badge to `TopBar` (title/aria-label spell out XP progress toward the next level) computed via `getProgression(appState)` in `app-shell.tsx`, updating reactively as reflections accumulate. Scope was confirmed with the user first (asked rather than assumed, since surfacing dormant systems this close to a deadline is a real scope decision) - deliberately kept to a persistent badge, not a new transient toast/animation, to limit risk.
4. Also asked about a "paste a link" fallback capture path; user confirmed the existing default "Manual" tab in Capture (already tested, already the primary path in the onboarding hint) already serves this purpose - no new feature needed, since a true link-fetch fallback would require a backend proxy this app intentionally doesn't have.

#### Verification

```text
corepack pnpm typecheck        -> PASS (4 packages)
corepack pnpm lint             -> PASS
corepack pnpm test              -> PASS (141/141)
corepack pnpm format:check     -> PASS
corepack pnpm --filter @lemonade/web build       -> PASS
corepack pnpm --filter @lemonade/extension zip   -> PASS (1.51 MB)
corepack pnpm test:e2e         -> PASS (19/19 Chromium, up from 18)
```

- Added "Level badge reflects reflection XP after a decision review" (asserts Lv 1 initially, then 10/30 XP total after one Buy resolution) and screenshotted the rebuilt extensions page directly (not just `manifest.json`) to confirm the icon renders.

#### Risks and follow-up

- **Open:** the user reports the extension does not work at all for them (both Chrome and Edge, correct unpacked folder selected), independent of the icon issue. Not reproduced in this sandbox (background service worker starts, content scripts inject, e2e suite passes against a freshly built unpacked load). Needs the user's exact symptom/screenshot to diagnose further - explicitly deprioritized by the user ("that one fix last") in favor of the fixes above.
- The XP badge is read-only/derived; there is still no transient "+10 XP" feedback moment when a reflection is created, only the persistent total. Flagged as a possible follow-up, not requested.

## Release/Submission Entries

When a deployment or submission artifact is created, add entries for:

- first successful local web build;
- first successful extension build;
- first full business loop;
- first full town loop;
- first extension-to-web handoff;
- first Vercel deployment;
- first passing critical test suite;
- feature freeze;
- video export;
- final GitHub push and submission link verification.
