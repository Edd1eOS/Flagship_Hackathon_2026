# Lemonade Production Documentation

This directory is the production source of truth for implementation agents.

All files in `docs/production/` are written in English to minimise ambiguity. Historical research and design exploration remain in the parent `docs/` directory and may contain Chinese. When a historical document conflicts with a production document, the production document wins.

## Documents

1. [`01-implementation-roadmap.md`](./01-implementation-roadmap.md)  
   Fifteen gated implementation stages from repository bootstrap to submission.

2. [`02-change-log.md`](./02-change-log.md)  
   Append-only record for every meaningful repository change.

3. [`03-dependency-map.md`](./03-dependency-map.md)  
   Target file tree, package graph, domain types, exported functions, runtime dependencies, assets, tests, and environment variables.

4. [`04-iteration-workflow.md`](./04-iteration-workflow.md)  
   Mandatory workflow for every implementation iteration, including requirement checks, library research, three necessity challenges, code-style review, verification, and documentation.

5. [`05-collaboration-protocol.md`](./05-collaboration-protocol.md)  
   Rules for communicating with the user and maintaining documentation.

6. [`06-agent-handoff.md`](./06-agent-handoff.md)  
   Standalone current-state handoff for an implementation agent starting after conversation reset.

## Product Source Of Truth

The current product is:

> Lemonade, a pre-purchase reuse companion. A WXT browser Scout detects shopping intent and carries the decision back to the Lemonade Lane town dashboard, where the user compares same-job owned items, performs a Cooling/reuse or repair mission, reviews the decision honestly, and converts confirmed actions into persistent town activity.

The town remains the dashboard and game terminal. The browser mouse extends the town; it does not replace it.

## Current Constraints

- Deadline: 2026-07-12 12:00 Sydney AEST / 10:00 Shanghai CST.
- Deliverables: public GitHub link, deployed website link, three-minute demonstration video.
- Repository target: `https://github.com/Edd1eOS/Flagship_Hackathon_2026`.
- Current workspace contains documentation and assets but no application implementation.
- The local `.git` directory is not currently recognised as a valid Git repository. Stage 1 must inspect and repair or initialise Git safely without deleting user files or overwriting remote history.
- One core developer is responsible for implementation.
- Production UI copy is English unless explicitly changed by the user.
- Communication with the user is Chinese.

## Non-Negotiable Product Rules

- `Skip` never means money was saved or transferred.
- Only explicit `PlannedAllocation` changes planned goal progress.
- `Buy` never harms the companion, town, XP, or streak.
- AI never decides necessity, purchase outcome, overlap, allocation, or game eligibility.
- Product detection is confidence-gated and always offers `Continue anyway`.
- The extension does not read checkout fields, payment data, addresses, accounts, or full browsing history.
- The Scout does not consume a town resident assignment slot.
- The recorded demo uses one genuinely new Cooling decision and one clearly seeded Ready decision.

## Conflict Resolution

Use this precedence order:

1. Latest explicit user instruction.
2. `docs/production/` documents.
3. `docs/13-town-dashboard-uiux.md`.
4. Current sections of `docs/01-prd.md`, `docs/10-business-and-game-logic.md`, and `docs/12-browser-companion-pivot.md` that do not conflict with item 3.
5. Historical option and review documents.

If ambiguity can change user-visible behaviour, financial truth, privacy, scope, or the demo story, ask the user in Chinese before implementation.
