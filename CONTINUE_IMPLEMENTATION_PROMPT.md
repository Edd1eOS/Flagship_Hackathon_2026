# Lemonade Implementation Continuation Prompt

You are the primary implementation agent for the Lemonade Hackathon project. Work directly in `D:\Flagship_Hackathon` and continue from the existing implementation state. Do not restart product ideation, replace the product direction, or stop after proposing a plan.

## Mandatory reading order

Read every item completely and in this exact order before changing files:

1. `docs/production/README.md`
2. `docs/production/06-agent-handoff.md` — its top **Current Resume Point** (dated 2026-07-11 18:49 CST) is the authoritative implementation handoff; everything below the historical-supersession heading is explicitly historical.
3. `docs/production/01-implementation-roadmap.md`
4. `docs/production/04-iteration-workflow.md`
5. `docs/production/05-collaboration-protocol.md`
6. `docs/production/03-dependency-map.md`
7. `docs/production/02-change-log.md` (at minimum, read entries CHG-20260711-006 through CHG-20260711-012 for the Stage 3-9 implementation history)
8. `docs/13-town-dashboard-uiux.md`
9. `docs/style.png` — inspect visually.
10. `Problem_statement.jpg` — inspect visually.

Precedence is: latest user instruction > `docs/production/` > `docs/13-town-dashboard-uiux.md` > historical documents.

## Communication and execution rules

- Communicate with the user in concise Chinese.
- Keep code, identifiers, comments, UI copy, tests, production docs, and commit messages in English.
- Report every meaningful start, discovery, pre-edit contract, verification phase, risk, and completion.
- Use `docs/production/04-iteration-workflow.md` exactly, including acceptance contracts, triple necessity checks, staged verification, three review passes, and documentation updates.
- Do not use sub-agents unless the user explicitly requests them.
- Do not claim unrun tests as passing or partial work as completed.
- Do not push, commit, or mutate the remote without explicit user authorisation and a fresh remote-history check.
- Never delete `.git`, force push, rewrite history, or use destructive Git operations.

## Product invariant

Lemonade is a pre-purchase reuse companion with two continuous surfaces: a WXT Browser Scout catches high-confidence shopping intent, and Lemonade Lane remains the town dashboard/game terminal. The required demo climax is an existing-item repair/reuse mission leading to Workshop activity with Mender and Host assigned; Scout is never assignable.

Preserve all truth/privacy rules in the production docs, especially: Skip is not savings; only explicit PlannedAllocation affects planned progress; Buy is neutral; reflection XP is price/outcome independent; AI never decides necessity/outcome/overlap/allocation/eligibility; detection is confidence-gated; Continue/Snooze/Hide are required; no payment/address/account/history access; new Cooling and seeded Ready must be visibly distinct.

## Current implementation state (summary — verify against the handoff, not from memory)

- Stages 1-8 are **completed and verified**: repository baseline; web/extension/domain/game-engine skeletons; full domain schemas + seed + clock + IDs; command/transaction/persistence foundation; purchase decision engine; same-job matching + reuse commitment; mission/allocation/reflection engines; town simulation + resident scheduling. 136/136 unit tests pass; full verification matrix (typecheck/lint/format/test/both builds/E2E) passes.
- Stage 9 (Web Shell And Static Town Dashboard) is **partial — groundwork only**: Tailwind theme tokens, a typed asset manifest with placeholder fallbacks, and a client-only Zustand store provider (`RepositoryProvider`/`useLemonade`) exist and are verified, but no shell component (`AppShell`, `TopBar`, `NavRail`, `WorldStage`, `CommandDeck`, `DecisionDock`, mobile bottom sheet/nav) has been built, and `page.tsx` is still the unmodified Stage 2 placeholder.
- Stages 10-15 are not started.
- The repository still has **zero commits and has never been pushed**. No remote mutation has occurred at any point.

## Exact first task

Resume Stage 9 exactly as described in the "Immediate next actions (resume Stage 9)" section at the top of `docs/production/06-agent-handoff.md`.

1. Inspect Git status and confirm the workspace matches the handoff's description (untracked files, no commits, Stage 9 groundwork files present).
2. Wire `RepositoryProvider` into the app using `next/dynamic(..., { ssr: false })` and verify in a real browser that there is no hydration mismatch.
3. Build the desktop and mobile shell components exactly as specified in `docs/13-town-dashboard-uiux.md` sections 3-9 and 12, using the existing `ASSET_MANIFEST`/`LOCATION_HOTSPOTS`/selectors — do not invent a different layout or design language.
4. Verify with Playwright screenshots at 1440x900 and 390x844, keyboard traversal, and the Frontend Completion Checklist in `04-iteration-workflow.md` section 20.
5. Perform all three mandatory self-review passes.
6. Append accurate Change Log evidence and update the Dependency Map and Roadmap status. Only mark Stage 9 completed when its exit criteria genuinely pass.
7. When and only when Stage 9 exit criteria pass, continue directly to Stage 10. Do not ask the user to reconfirm ordinary decisions already specified.

Use Corepack pnpm 11.11.0. The handoff explains the sandbox/pnpm-store incident and the safe recovery; do not repeat sandboxed installs that cannot access the pnpm store. No remote mutation is authorised.
