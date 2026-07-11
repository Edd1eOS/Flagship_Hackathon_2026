# Lemonade Problem Statement and Scoring Audit

> Date: 2026-07-11 14:22 CST  
> Time remaining at audit: approximately 19 hours 38 minutes  
> Evidence: `Problem_statement.jpg`, current PRD, logic spec, stack, and delivery plan  
> Status: corrective audit; scoring estimates are internal judgement, not official weights

## 1. Original task

The brief says recyclable products alone are insufficient and asks teams to rethink unwanted goods, giving phone upgrades and food redistribution as examples. The actual task is:

> Develop a technical solution that meaningfully reduces consumerism/materialism in everyday life.

The phone and food examples are not mandatory feature categories. A valid solution may focus on purchasing habits, but it must show a credible mechanism that changes material-consumption behaviour.

## 2. Overall verdict

Lemonade has **not fundamentally left the problem**, because pre-purchase interruption, owned-item substitution, cooling, repair, and reuse directly address mindful purchasing.

It has drifted in two important ways:

1. **Narrative drift:** Japan savings and a cute town can make the product look like a gamified savings tracker rather than an anti-consumerism intervention.
2. **Delivery drift:** the proposed workspace, extension, AI, simulation engine, and 30+ art assets are architecturally strong but too broad while the repository still contains no implementation.

The first is corrected through product emphasis. The second requires a smaller executable vertical slice.

## 3. Problem-statement fit

| Brief requirement/theme | Current fit | Audit |
|---|---:|---|
| Reduce consumerism/materialism | Medium-strong | Strong only if reuse/repair resolution is the demo climax; weak if Skip-to-savings is the climax |
| Everyday life | Medium | Web capture is voluntary; extension/share entry would strengthen real shopping context |
| Rethink unwanted/already-owned goods | Medium | My Stuff and ReuseCommitment fit, but passive inventory alone is insufficient |
| Upgrade/repair instead of replace | Medium-strong | Repair experiment must be a first-class outcome, not one optional sentence |
| Mindful purchasing habits | Strong | Classification, overlap, opportunity cost, Cooling, and ready review directly support it |
| Community | Medium | Picnic/shared activity gives a narrative; do not claim operational community impact |
| Planet/waste | Medium | Avoided replacement is directionally aligned; do not invent waste/carbon numbers |
| Technical solution | Strong concept, absent build | State machine, extension, and simulation are credible only when running |

## 4. Why it currently feels like a savings app

The current visible sequence can still be summarised as:

```text
set goal -> resist purchase -> redirect money -> goal increases -> town grows
```

That is structurally similar to a savings-goal product. My Stuff, repair, and consumption resolution are present but not yet the protagonist.

Correct sequence:

```text
shopping intent
  -> identify the job/need behind the product
  -> match capabilities in My Stuff
  -> choose use/repair/restyle/borrow/wait/buy
  -> run a real 24-hour experiment where appropriate
  -> reconsider
  -> optional financial allocation
  -> world reflects the type of real action completed
```

Allocation remains useful but becomes one optional result, not the definition of success.

## 5. Correct product thesis

Recommended one-line product definition:

> Lemonade intercepts an online impulse, finds what the user already owns, and turns cooling time into a concrete reuse or repair experiment before the purchase is reconsidered.

Recommended game explanation:

> Lemonade Lane does not prove that money or waste was saved. It makes confirmed reflection, reuse, repair, sharing, and goal planning emotionally visible so the user wants to repeat the process.

## 6. Correct demo story

### Required narrative

1. User is considering `$180 sneakers` for travel comfort/a fresh look.
2. Lemonade captures the product before checkout or from the website demo flow.
3. My Stuff finds existing shoes with the same walking/travel capability.
4. The app identifies a concrete alternative: clean/restyle them, repair/replace the insole, or test-wear them tomorrow.
5. The item enters Cooling with the selected real-world experiment attached.
6. A separate seeded record is already Ready.
7. User confirms whether the experiment solved the original job.
8. User chooses use existing/repair/Buy/Extend honestly.
9. Workshop becomes available because of the confirmed reuse/repair path.
10. Optional: the user separately plans some amount toward a hostel, enabling Station.
11. Two residents are assigned among eligible world projects.
12. World scenes show repair and trip preparation; no fake savings or waste counter appears.

### Wrong demo climax

```text
Skip sneakers -> Japan progress bar increases -> cute building appears
```

This would score as polished savings gamification but weakly prove anti-consumerism.

### Correct demo climax

```text
Existing shoes can satisfy the same job
  -> user commits to a repair/test action
  -> returns after Cooling
  -> confirms the new purchase is avoidable
  -> Workshop residents visibly repair and reuse the old item
```

## 7. Scoring audit

Scores below are directional internal estimates out of 10.

| Criterion | Current concept ceiling | If implemented as savings-town | Corrected vertical slice | Main evidence needed |
|---|---:|---:|---:|---|
| Innovation & Creativity | 8 | 5-6 | 8 | shopping interception + owned capability match + repair experiment + pocket-mouse reuse world |
| Technical Complexity & Completeness | 9 complexity | 4-5 completeness | 7-8 | running state machine, idempotent projection, resident constraint, persistence, tests |
| UX & Design | 8-9 | 7 | 8-9 | one short capture/review flow, coherent world art, mobile/desktop, no warning overload |
| Practicality & Usability | 6-7 | 6 | 7-8 | manual fallback, no required inventory, real timestamps, explicit extension limitations |
| Presentation & Pitch | 8 | 6 | 8-9 | one shoe, one existing substitute, one repair experiment, one world consequence |
| Team Collaboration | 6 currently evidenced | 6 | 8 | research table, art assets, timed narration, task board, commits/material provenance |

### Innovation & Creativity

Strength:

- Pocket mice reuse discarded human objects is a coherent metaphor;
- consumption-resolution pathways are more distinctive than a savings tracker;
- extension context makes the timing credible.

Risk:

- cooldown, opportunity cost, savings goals, XP, and town growth are individually common;
- the combination only feels innovative when My Stuff capability matching and a real reuse/repair experiment are visible.

### Technical Complexity & Completeness

Strength:

- typed command/state machine;
- event projection and idempotency;
- resident scheduling and persistent world state;
- WXT handoff if completed.

Risk:

- architecture documents do not score as completeness;
- a four-package workspace plus extension plus AI plus 30-35 assets is currently over-scoped;
- many empty surfaces will score below one complete loop.

### UX & Design

Strength:

- direct app first screen;
- contextual My Stuff entry;
- non-punitive Buy path;
- strong reference art direction.

Risk:

- setup, capture, four interventions, Cooling, review, reuse, allocation, resident planning, and reward can become too many consecutive sheets;
- the demo should seed onboarding and compress progressive evidence into one review.

### Practicality & Usability

Strength:

- no bank or organisational dependency;
- local state and manual input work immediately;
- product does not claim to block all purchases.

Risk:

- standalone web requires the user to remember Lemonade;
- generic retailer detection is brittle and permission-sensitive;
- full My Stuff inventory is unrealistic, so progressive entry must remain optional.

### Presentation & Pitch

Strength:

- the shoe story is concrete and visual;
- world activation provides a strong final image.

Risk:

- explaining the complete architecture, all game rules, AI, extension, budgets, and world lore cannot fit three minutes;
- pitch should explain one mechanism, not the feature catalogue.

### Team Collaboration

Strength:

- roles are clear.

Risk:

- role labels do not prove collaboration;
- each teammate needs a traceable artifact used in the final submission.

## 8. Corrected P0

### Must run

- one deployed Next.js application;
- seeded persona and Reset Demo;
- one Ready sneakers decision and one genuine newly Cooling decision;
- My Stuff match with explainable same-job capability;
- one concrete reuse/repair experiment;
- Buy/Skip/Extend without punishment;
- planned allocation as optional secondary step;
- pure TypeScript business/world engine;
- three eligible project types, two resident assignments;
- one world activation sequence using a small coherent asset set;
- persistence, responsive layout, and core Vitest/Playwright coverage.

### Conditional after the web loop is stable

- one WXT controlled-page interception and prefilled handoff;
- Groq photo extraction.

### Cut immediately from the implementation target

- generic all-retailer extension support;
- full first-use onboarding during the recorded demo;
- 30-35 final art assets;
- multiple location upgrade levels;
- AI coach;
- bulk inventory import;
- additional goals, random events, charts, notifications, and settings pages.

## 9. Stack correction

The architecture in `05-build-stack-and-tools.md` is a valid ceiling, not the minimum scaffold.

For immediate implementation, start as a single Next.js app with:

```text
apps/web/src/domain
apps/web/src/game-engine
```

Promote them to workspace packages only when the WXT extension actually exists and needs shared imports. Package boundaries without a second consumer add ceremony but no score.

The custom deterministic simulation engine should remain. AI and extension breadth should not compete with the complete main loop.

## 10. Final audit decision

### On-theme

- purchase-time intervention;
- same-job owned-item matching;
- repair/reuse experiment;
- honest reconsideration;
- non-punitive world feedback.

### Off-theme if overemphasised

- savings target and Japan progress;
- cosmetic collecting;
- town construction as the main objective;
- AI coach;
- financial dashboard breadth.

### Final priority statement

> Build evidence that one new material purchase can be avoided by satisfying the same job with an existing item. Everything else exists to make that intervention easier, more repeatable, or more memorable.
