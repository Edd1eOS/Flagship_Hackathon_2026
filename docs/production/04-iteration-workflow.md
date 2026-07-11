# Lemonade Strict Iteration Workflow

> Mandatory for every implementation iteration.  
> An iteration is one coherent change that can be understood, implemented, verified, and logged independently.

## 1. Iteration Definition

Each iteration must have:

- one user/product objective;
- a bounded file/symbol scope;
- explicit behaviour before and after;
- acceptance checks;
- verification evidence;
- a change-log entry;
- no unrelated refactor.

Examples of valid iterations:

- implement the decision transition guard;
- add same-job matching and tests;
- build static desktop shell;
- inject the Scout on the controlled storefront;
- implement one idempotent extension handoff.

Examples of invalid iterations:

- "build the app";
- "improve architecture";
- "polish UI" without identified states and viewports;
- changing domain, extension, art, and deployment without one shared acceptance contract.

## 2. Step 0 - Reconcile The Latest Request

Before acting:

1. Read the newest user message twice.
2. Check whether it corrects or supersedes earlier decisions.
3. Read `docs/production/README.md` precedence rules.
4. State the interpreted objective in one sentence.
5. Identify whether the user is requesting implementation, analysis, review, or planning.
6. Do not continue an older objective after the user changes direction.

If the newest request conflicts with production docs, the user wins. Update the docs in the same iteration.

## 3. Step 1 - Report The Start In Chinese

Send a short update before exploration or edits:

```text
Working on: <objective>.
First checking: <files/state/dependencies>; then validating with <verification>.
```

Render the meaning of this template in concise Chinese when sending it to the user.

Do not over-explain the plan before reading the repository.

## 4. Step 2 - Inspect Repository State

Required checks:

1. current working directory;
2. Git validity/status/branch/remote when relevant;
3. unexpected dirty files;
4. current stage exit criteria;
5. relevant production docs;
6. relevant code and tests;
7. package scripts and installed dependencies;
8. running processes/dev servers if relevant.

Use fast targeted tools such as `rg`, `rg --files`, and parallel file reads. Do not scan or dump the entire repository when a narrower search is sufficient.

Never revert, overwrite, or delete changes that may belong to the user.

## 5. Step 3 - Create A Change Contract

Write an internal contract before coding:

```text
Objective:
User-visible change:
Domain/game rule:
Files/symbols likely affected:
Out of scope:
Acceptance checks:
Rollback/fallback:
```

For a frontend change, add:

```text
Required states:
Desktop viewport:
Mobile viewport:
Keyboard/reduced-motion behaviour:
Asset dependencies:
```

For an extension change, add:

```text
Permissions:
Detection confidence:
Message/storage impact:
Privacy boundary:
Continue/Snooze behaviour:
```

## 6. Step 4 - Ask Only Material Questions

Ask the user in Chinese before implementation if ambiguity can change:

- core product behaviour;
- financial truth;
- privacy or permissions;
- destructive/repository operations;
- public API/data schema;
- feature scope or deadline trade-off;
- visual identity or required asset;
- what the demo claims;
- whether existing remote work may be overwritten.

Do not ask about trivial implementation choices already resolved by production docs. Bundle related material questions into one concise request.

When a safe reversible assumption exists, state it and proceed. Record the assumption in the change log.

## 7. Step 5 - Discover Before Designing

Before adding code:

1. Search for an existing implementation, helper, type, pattern, or test.
2. Read callers and affected selectors.
3. Read the nearest tests.
4. Check persisted schema and migration impact.
5. Check extension message compatibility.
6. Check whether an asset/state already exists.
7. Prefer the established repository pattern unless it violates current requirements.

Do not invent a new abstraction before understanding the existing one.

## 8. Step 6 - Research Tools And Libraries

Research is required when:

- an API/library is temporally unstable;
- a new dependency is proposed;
- browser-extension behaviour/permissions are uncertain;
- a framework API is not already used locally;
- correctness depends on a specific current capability.

Research order:

1. local code/package lock/docs;
2. official documentation;
3. primary source repository/release notes;
4. no secondary blog unless primary sources are insufficient.

Record:

- candidate;
- official source;
- why existing stack cannot solve it;
- bundle/runtime/permission cost;
- fallback;
- selected/rejected decision.

Do not add MCP, SDK, state manager, animation library, or game engine merely to increase complexity.

## 9. Step 7 - Mandatory Triple Necessity Gate

Before adding any feature, abstraction, dependency, file, state field, or animation, answer all three questions explicitly in internal reasoning:

### Necessity Question 1 - Product Proof

> Does this directly prove the value proposition, satisfy a roadmap exit criterion, prevent a correctness/privacy failure, or materially improve the judged demo?

If no, defer or remove it.

### Necessity Question 2 - Simplest Existing Mechanism

> Can the same requirement be met by an existing type, function, browser API, component, asset state, or dependency with less code and fewer failure modes?

If yes, reuse the existing mechanism.

### Necessity Question 3 - Cost And Cut

> What must be tested, documented, maintained, permitted, downloaded, or cut to support this change, and is that cost justified before the deadline?

If the cost is not justified, reduce the scope or reject the change.

The change may proceed only when all three answers support it.

## 10. Step 8 - Map Dependency Impact

Use `03-dependency-map.md` and identify:

- upstream types/events/commands;
- downstream callers/components/selectors;
- persistence and migration;
- extension messages;
- seed and fixtures;
- assets/effects;
- unit/E2E tests;
- docs and demo script;
- environment/permission/deployment impact.

If a public symbol or boundary changes, update the dependency map in the same iteration.

## 11. Step 9 - Plan The Smallest Verifiable Slice

Order work as:

1. schema/type;
2. pure rule/guard;
3. unit test;
4. repository/transaction;
5. selector/view model;
6. UI/animation;
7. E2E/manual verification;
8. documentation.

Do not start with animation for a state transition that does not exist.

For substantial iterations, maintain a short task plan with one in-progress item. For tiny changes, a written plan is unnecessary.

## 12. Step 10 - Report Before Editing

Before the first file edit, send a Chinese update naming:

- what will change;
- why;
- which behaviour will remain invariant;
- how it will be verified.

Example:

```text
I will update the Decision state machine and tests so Ready can only enter Buy/Skip/Extend. Money and town state remain unchanged. Then I will run domain unit tests and typecheck.
```

Render this update in concise Chinese for the user.

## 13. Step 11 - Implement With Scope Discipline

Rules:

- use `apply_patch` for manual edits;
- keep edits local to the intended modules;
- use ASCII unless the file has a clear existing Unicode requirement;
- write code, comments, identifiers, UI copy, and production docs in English;
- prefer pure functions and discriminated unions;
- avoid `any`, non-null assertions, hidden global state, and stringly typed status changes;
- components dispatch commands and render selectors; they do not mutate domain/game truth;
- effects follow persisted state; they do not create it;
- keep comments for non-obvious constraints, not narration;
- do not add a dependency without updating package/dependency docs and lockfile intentionally;
- preserve user changes and unrelated dirty files;
- do not perform opportunistic refactors.

## 14. Step 12 - Verify Incrementally

Run the narrowest relevant check after each logical block:

1. focused unit test;
2. package typecheck;
3. package build if boundary/config changed;
4. related E2E path;
5. desktop/mobile visual check for frontend;
6. extension controlled-page check for content-script changes.

Do not wait until the end to discover package or state-contract failures.

If a command fails due to sandbox/network restrictions and the task requires it, request the narrowest appropriate approval rather than bypassing safety.

## 15. Step 13 - Three-Pass Self Review

### Review Pass 1 - Correctness And Product Truth

Ask:

- Are all legal/illegal transitions correct?
- Can this duplicate events, XP, allocations, imports, or assignments?
- Does Skip remain financially neutral?
- Is Buy non-punitive?
- Does the feature work without AI?
- Does the implementation match the actual user request rather than a previous one?
- Are privacy/permission claims true?
- Does the demo use genuine Cooling and clearly seeded Ready data?

### Review Pass 2 - Architecture And Code Style

Ask:

- Is business/game logic React-free and testable?
- Did UI bypass commands/repositories?
- Are names specific and consistent with the dependency map?
- Is there duplicated logic or an unnecessary abstraction?
- Are types narrow and runtime boundaries validated?
- Are errors explicit and recoverable?
- Is the code consistent with nearby style?
- Are comments concise and useful?
- Did the change introduce dead code, unused imports, debug output, or dependency bloat?

### Review Pass 3 - UX, Accessibility, And Visual Quality

Ask:

- Is the next action obvious without tutorial copy?
- Does the world remain the dashboard rather than a decorative card?
- Do desktop and mobile remain stable?
- Can every action be completed without drag?
- Are hotspots/buttons accessible and at least approximately 44px for touch?
- Does text fit and avoid art/control overlap?
- Is reduced motion functional?
- Is the Scout contextual rather than annoying?
- Are Continue/Snooze/Hide available where required?
- Are animations short, recoverable, and non-authoritative?

Fix all material findings before completion.

## 16. Step 14 - Update Documentation And Change Log

Before reporting completion:

1. append a `CHG-*` entry;
2. update `03-dependency-map.md` if contracts/dependencies changed;
3. update roadmap status/exit evidence if a stage gate changed;
4. update README/API/environment docs if usage changed;
5. record tests and manual verification accurately;
6. record known limitations and follow-up.

Never mark a test as passed if it was not run. Never omit an inability to test.

## 17. Step 15 - Report Completion In Chinese

Use a concise structure:

```text
Completed: <behaviour/result>
Verification: <tests/build/browser checks>
Changed: <important files or links>
Risk/next step: <only material remaining issue>
```

Render this final structure in concise Chinese for the user.

For longer work, include clickable local file links. Do not dump every implementation detail or command output.

If the work is incomplete, say exactly what remains and why. Do not call partial scaffolding complete.

## 18. Step 16 - Git Discipline

- inspect `git status` before and after;
- do not revert user changes;
- do not commit secrets or generated test artifacts;
- use atomic non-interactive commits only when the user requests or the handoff explicitly authorises commits;
- do not push, force push, rewrite history, or modify remote branches without user approval and a known-safe remote state;
- record commit hash/deployment in the change log when created.

## 19. Blocker Protocol

Before declaring a blocker:

1. reproduce it;
2. inspect local docs/code/logs;
3. try a safe fallback;
4. search official docs when relevant;
5. isolate the smallest failing unit;
6. report exact error and affected stage.

Ask the user only when the blocker requires a decision, permission, missing asset/credential, or external-state change.

## 20. Frontend Completion Checklist

- [ ] desktop screenshot inspected at 1440x900;
- [ ] mobile screenshot inspected at 390x844;
- [ ] no blank/missing critical image;
- [ ] no incoherent overlap;
- [ ] no horizontal overflow;
- [ ] text fits controls/panels;
- [ ] focus and keyboard path work;
- [ ] reduced motion works;
- [ ] loading/empty/error/ready/cooling states exist;
- [ ] Scout return and Workshop activation are state-safe;
- [ ] Playwright path and screenshot evidence recorded.

## 21. Dependency Addition Checklist

Before installing a package:

- [ ] existing stack/browser API cannot reasonably solve it;
- [ ] official documentation checked;
- [ ] package is maintained and compatible;
- [ ] bundle/runtime cost justified;
- [ ] only one library chosen for the responsibility;
- [ ] license acceptable;
- [ ] fallback understood;
- [ ] dependency map updated;
- [ ] change log updated;
- [ ] build/test run after lockfile change.
