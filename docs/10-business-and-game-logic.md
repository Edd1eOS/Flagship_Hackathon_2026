# Lemonade Business and Game Logic

> Date: 2026-07-11  
> Status: business and town/resident logic remain current; browser Scout/mission integration and final layout are specified by `12-browser-companion-pivot.md` and `13-town-dashboard-uiux.md`  
> Product: Lemonade - Mindful Spending  
> Game world: Lemonade Lane

## 1. Separation of responsibilities

Lemonade has two connected but separate systems.

### Business layer

The business layer records what the user considered, what intervention they saw, what they decided, and what they explicitly planned. It is the source of truth for money-related language.

### Game layer

The game layer receives confirmed business events and turns them into projects, resident activities, world-state changes, and cosmetic feedback. It cannot create, edit, or imply real financial transactions.

```text
User decision
  -> business state transition
  -> immutable domain event
  -> game project becomes available
  -> player assigns residents
  -> world state changes
  -> art/animation renders the new state
```

The dependency is one-way. Game actions cannot change a purchase decision, invent an allocation, or classify an item as necessary.

---

# Part A - Business Logic

## 2. Business goal

Interrupt a non-essential purchase before checkout, help the user compare it with what they already own and what they value, support a voluntary cooling period, and record a considered outcome without guilt or fake savings claims.

Lemonade does not claim to eliminate consumerism or technically block every payment. Its direct behavioural target is narrower and testable:

> Reduce unnecessary, duplicate, replacement-avoidable, and impulse-driven material purchases by intervening before checkout.

### Anti-consumerism intervention modules

| Moment | Product module | Behavioural mechanism | Intended result |
|---|---|---|---|
| Before temptation | Goal + discretionary plan | pre-commitment and visible priority | create a reference point before a sale appears |
| At impulse | `I'm tempted` / quick capture | interrupt one-click checkout and name the impulse | insert a decision moment before payment |
| During assessment | Need / Replacement / Want gate | separate essential use from expandable desire | avoid treating every desire as necessity |
| During assessment | My Stuff overlap | make owned substitutes visible | reduce duplicate buying and avoidable replacement |
| During assessment | Repair/reuse choice | expose a concrete alternative action | extend the life of an existing item |
| During assessment | Goal opportunity cost | convert price into a personally meaningful trade-off | make the foregone experience/security concrete |
| During assessment | Frequency insight | reveal repeated category behaviour | reduce habitual, invisible repetition |
| Before purchase | 24-hour Cooling | delay action beyond the strongest impulse window | allow desire intensity and sale pressure to weaken |
| At review | Buy / Skip / Extend | require a fresh decision with preserved autonomy | turn passive checkout into considered choice |
| After Skip | Planned allocation | connect restraint to a chosen real-life priority | prevent `not buying` from feeling like pure loss |
| Across repeated use | Lemonade Lane | substitute reflection, agency, and cute bounded rewards for shopping feedback | support retention without physical consumption |

The first eight modules are the direct intervention engine. Planned allocation closes the behavioural loop. Lemonade Lane is the reinforcement layer, not evidence that a purchase was prevented.

### Current interception limitation

The Web MVP depends on the user remembering to open Lemonade before checkout. This is the main practical weakness in the intervention model.

Future distribution surfaces can reduce that gap:

- mobile share sheet from a shopping/product page;
- WXT browser extension with `Pause with Lemonade` on product pages;
- product-link paste that prefills name, image, and price after confirmation;
- optional reminders for ready decisions.

The extension/share surface should create a PurchaseDecision and open the same core flow. It must not become a product-discovery or shopping recommendation channel.

The core loop is:

```text
Set goal and discretionary plan
  -> capture an impulse
  -> classify and inspect
  -> cool or decide
  -> review when ready
  -> buy / skip / extend
  -> optionally create a planned allocation
  -> send confirmed events to Lemonade Lane
```

## 3. Core entities

### UserProfile

- display name;
- coaching tone;
- currency;
- monthly discretionary budget;
- notification preference, future only.

P0 uses a seeded local profile and has no authentication.

### Goal

- type: `experience | savings | debt`;
- name;
- target amount;
- starting amount;
- planned allocation total;
- milestone definitions.

`starting amount + planned allocation total` is labelled `planned progress`, not bank balance or funded amount.

### OwnedItem

- name and image;
- category;
- colour;
- use tags;
- optional condition;
- optional repair note.

The collection is called `My Stuff`, never Library.

### PurchaseDecision

- item name, image, price, and category;
- motive;
- user classification;
- created and review timestamps;
- decision status;
- overlap results shown;
- final outcome and reason;
- linked reuse commitment;
- linked allocation IDs.

### PlannedAllocation

- source decision ID;
- destination goal ID;
- amount;
- timestamp;
- type fixed to `planned`.

It records intent. It does not move money.

### ReuseCommitment

- source decision ID;
- owned item ID;
- action: `use_existing | repair | borrow | restyle`;
- optional note;
- timestamp.

### Reflection

- decision ID;
- outcome;
- optional reason;
- completed timestamp;
- XP-awarded flag.

Only one completion reward is allowed per decision.

## 4. Purchase-decision state machine

```text
draft
  -> assessed
      -> reclassified_need
      -> bought
      -> cooling

cooling
  -> ready
  -> bought
  -> reclassified_need

ready
  -> bought
  -> skipped
  -> extended -> cooling
```

### State rules

- `draft`: form is incomplete and does not affect any totals.
- `assessed`: interventions are visible; the user controls the next action.
- `cooling`: review time is in the future.
- `ready`: review time has passed; resolution is available.
- `bought`: self-reported purchase; no punishment.
- `skipped`: self-reported decision not to buy; does not change a goal automatically.
- `extended`: audit event followed by a new cooling deadline.
- `reclassified_need`: removed from the wants intervention after the user gives a reason.

Terminal outcomes remain editable only through a separate correction action that records an audit event. P0 can omit correction UI.

## 5. Capture and intervention flow

### Capture

Required:

- item name;
- price;
- category;
- motive: `need | replacement | occasion | mood | sale | trend`.

Optional:

- image;
- product URL;
- sale deadline;
- free-text reason.

### Intervention order

1. Ask `Is this a need, replacement, or want?`
2. Show up to three explainable My Stuff overlaps.
3. Show remaining discretionary planning capacity after a hypothetical purchase.
4. Translate price into one concrete goal milestone.
5. Show a verified frequency observation from local history.
6. Offer `Cool for 24h`, `Buy anyway`, or `This is necessary`.

AI may suggest attributes or classification in P1, but the user confirms all values.

## 6. Overlap logic

P0 uses explainable rules, not opaque embeddings.

```text
score = categoryMatch * 0.45
      + sharedUseTags * 0.35
      + colourOrStyleMatch * 0.10
      + usableCondition * 0.10
```

- show at most three matches;
- state the reason, such as `same category + running use`;
- use `possible overlap` below the high-confidence threshold;
- let the user dismiss an irrelevant match;
- never claim the item is definitely unnecessary.

## 7. Cooling logic

- P0 default: 24 hours.
- The app cannot block an external checkout.
- Countdown derives from timestamps, never from a decrementing stored counter.
- Seed one decision whose review time is already past for the demo.
- Creating a new decision must show a genuine future deadline.
- Extending creates a new deadline and preserves the earlier event.

## 8. Money and truth rules

### Terms

- `price`: self-reported opportunity amount;
- `discretionary plan`: user-set monthly planning boundary;
- `bought amount`: self-reported decided purchases;
- `available to redirect`: temporary choice capacity after Skip;
- `planned allocation`: explicit intent assigned to a goal;
- `actual savings`: never claimed without verified financial data.

### Invariants

1. Capturing or cooling an item changes no money total.
2. `Skip` alone changes no goal total.
3. Planned allocation amount must be positive.
4. Total allocations sourced from one skipped decision cannot exceed its price.
5. An allocation must reference a skipped decision and an existing goal.
6. Deleting a decision with allocations is blocked or requires explicit dependent cleanup.
7. All displayed progress using local data says `planned`.
8. No game animation may display a bank transfer, cash deposit, or verified environmental impact.

### Planning capacity

For the simplified MVP:

```text
remainingPlanningCapacity = monthlyDiscretionaryBudget
  - selfReportedBoughtWants
  - plannedGoalAllocationsThisMonth
```

This is a planning view, not an account balance. Clamp visual display at zero but preserve the true negative value for an over-plan warning.

## 9. Resolution rules

### Buy

- record outcome and optional reason;
- create one Reflection event;
- update self-reported bought-wants total;
- add to My Stuff only after separate confirmation;
- award no negative game state.

### Skip

- record outcome and optional reason;
- create one Reflection event;
- expose up to the item price as available to redirect;
- optionally create a ReuseCommitment;
- do not advance the goal yet.

### Allocate

- user selects goal and amount;
- validate against unallocated source capacity;
- create PlannedAllocation;
- update planned goal progress;
- publish the game event only after persistence succeeds.

### Extend

- record reason optionally;
- set a new review timestamp;
- do not grant a second Reflection reward until the final ready review;
- do not change money or world state.

## 10. Business domain events

```ts
type BusinessEvent =
  | { type: 'DECISION_REVIEWED'; decisionId: string; outcome: 'bought' | 'skipped' }
  | { type: 'REUSE_COMMITTED'; decisionId: string; ownedItemId: string; action: ReuseAction }
  | { type: 'ALLOCATION_PLANNED'; allocationId: string; goalId: string; amount: number }
  | { type: 'ITEM_ADDED_TO_STUFF'; itemId: string; sourceDecisionId?: string };
```

Events have stable IDs and are idempotent. Replaying local state must not duplicate XP, projects, rewards, or allocations.

## 11. Business pages and controls

### My World

Primary screen. Contains the world, current goal summary, ready-decision indicator, and `I'm tempted` action.

### Decisions

Three tabs:

- Ready;
- Cooling;
- History.

### Capture / Review panel

One focused step at a time; no long all-in-one form.

### My Stuff

Seed 8-12 items; allow simple add/delete and show use tags.

### Goal panel

Show target, starting amount, planned allocations, linked decisions, and clear data disclaimer.

---

# Part B - Game and Art-Scene Logic

## 12. Game definition

Lemonade Lane is a **small-scale world-management simulation** driven by mindful-spending events.

The player manages a pocket neighbourhood made by mice from repaired and reused human objects. The goal is not to maximise property, wealth, or population. The player decides which meaningful activities happen next under limited resident attention.

Buildings are scene containers. The reward is visible life: packing, repairing, learning, sharing, and resting.

## 13. Why this is simulation management

The world contains:

- persistent project and location states;
- residents with limited actions per turn;
- project prerequisites from real product behaviour;
- mutually exclusive short-term assignments;
- delayed projects that remain available without punishment;
- visible consequences and resident routines;
- player choice over what the neighbourhood prioritises.

An automatic building upgrade after Skip would only be progression feedback. Resident assignment and project prerequisites create actual management.

## 14. Game inputs from the business layer

There is no generic lemon currency in P0.

| Business event | Game signal | Example project unlocked |
|---|---|---|
| `DECISION_REVIEWED` | Reflection signal | Picnic/reflection gathering |
| `REUSE_COMMITTED` | Reuse commitment | Repair an existing backpack at Workshop |
| `ALLOCATION_PLANNED` | Goal plan | Prepare the Little Station for Japan |
| XP milestone reached | Reward choice | Select one Home cosmetic |

Signals are requirements, not spendable coins. They cannot be bought, traded, or farmed by item price.

## 15. Turn and resident logic

### Cycle

One world cycle represents a planning period, not a real-time day. P0 uses a button such as `Plan this week` to avoid background timers.

### Residents

- two residents are available in the seeded demo;
- each resident can be assigned to one project per cycle;
- a resident cannot occupy two projects simultaneously;
- an unassigned project waits and does not decay;
- assigning a resident previews the resulting activity before confirmation;
- confirming the plan atomically updates all assignments.

### Meaningful constraint

The seeded scenario exposes three eligible projects but only two resident actions:

1. **Workshop:** repair and reuse the existing travel shoes/backpack;
2. **Picnic Green:** reflect with friends and prepare a farewell picnic;
3. **Little Station:** prepare the Japan milestone backed by a planned allocation.

The player chooses which two happen now. There is no moral score and no permanent loss; the third can wait until the next cycle.

## 16. World project state machine

```text
locked
  -> available
  -> assigned
  -> active
  -> lived_in

assigned
  -> available   // player changes plan before confirmation
```

- `locked`: requirement not satisfied.
- `available`: business signal exists and project may be selected.
- `assigned`: resident reserved in the current unconfirmed plan.
- `active`: plan confirmed; build/activity sequence is running or complete.
- `lived_in`: persistent idle activity is visible in later visits.

World projects never regress because the user later buys something or misses a day.

## 17. Locations

### Home Nook

Always active. Shows the main character, selected cosmetic, limited My Stuff references, and entrances to the rest of the lane.

It is not the `My Stuff` database and not a virtual shop.

### Workshop Corner

Represents repair, reuse, making, and learning. It becomes available through a ReuseCommitment.

Demo activity: repair an existing travel item instead of replacing it.

### Picnic Green

Represents relationships, shared experiences, and reflection. It becomes available after a completed decision review.

Demo activity: two residents prepare a small farewell picnic.

### Little Station

Represents an experience goal. It becomes available only after a PlannedAllocation linked to that goal.

Demo activity: prepare luggage and a reused-teacup station for the Japan trip.

### Quiet Garden

Future location for savings/debt/security goals. Do not build it in P0 unless the primary demo is no longer an experience goal.

## 18. Game state

```ts
type WorldState = {
  cycle: number;
  residents: ResidentState[];
  projects: WorldProjectState[];
  locations: LocationState[];
  reflectionXp: number;
  level: number;
  unlockedCosmeticIds: string[];
  equippedCosmeticIds: string[];
  processedBusinessEventIds: string[];
};
```

Derived selectors determine:

- eligible projects;
- resident availability;
- current scene variants;
- next reflection milestone;
- reward-choice eligibility;
- demo sequence step.

No amount or project eligibility is derived inside an animation component.

## 19. XP and cosmetic rules

- one completed ready review grants a small fixed Reflection XP amount;
- XP does not depend on price or Buy/Skip outcome;
- extending does not repeatedly award XP;
- XP cannot be spent;
- a milestone offers one of three bounded cosmetic choices;
- selected cosmetics affect Home appearance only;
- no store, pricing, rarity, inventory capacity, or gameplay power;
- reward selection is persistent and idempotent.

Seed the account one review short of a reward milestone so the demo shows the choice without fake repeated activity.

## 20. Screen and scene sequence

### Scene 0 - World overview

- Lemonade Lane in lived-in idle state;
- Home active;
- three surrounding locations visible;
- ready decision indicator at the illustrated cooler tray;
- residents performing restrained idle actions.

### Scene 1 - Decision review

- world remains visible but visually quiet;
- a side panel/bottom sheet shows `$180 sneakers`;
- My Stuff reveals similar owned shoes;
- goal trade-off shows `one hostel night`;
- user selects Skip, Buy, or Extend.

### Scene 2 - Reuse and allocation

- after Skip, user may choose an existing pair to reuse/repair;
- allocation is a separate explicit step;
- selecting `$180 planned toward Japan` creates the business event;
- no location changes before persistence succeeds.

### Scene 3 - Projects become available

- Workshop, Picnic, and Station receive distinct non-monetary availability markers;
- two residents become draggable/click-assignable;
- UI states `2 residents, 3 possible projects`;
- player previews and confirms two assignments.

### Scene 4 - World response

- confirmed locations transition from ready to active;
- assigned residents travel to them;
- unselected location remains warmly available, not greyed as failure;
- location activities begin and persist.

### Scene 5 - Reflection reward

- three cosmetic stickers appear;
- player selects one;
- reward settles into Home;
- world returns to a stable overview with the next project still waiting.

## 21. Art-state mapping

Each location has complete illustrated variants:

```text
locked  -> ready  -> active  -> lived-in loop
```

### Common layers

1. background paper field;
2. ground/island;
3. rear foliage and scenery;
4. complete location-state illustrations;
5. resident shadows;
6. resident pose sprites;
7. foreground props and foliage;
8. transient effect sprites;
9. interaction hotspots;
10. application HUD and panels.

Hotspots have stable dimensions and do not rely on artwork alpha bounds for click targets.

## 22. Event-to-effect contract

| Confirmed state change | Visual response | Duration |
|---|---|---:|
| Review persisted | fixed XP roll and short character acknowledgement | 300-500 ms |
| Reuse commitment persisted | Workshop ready marker appears | 300-500 ms |
| Allocation persisted | labelled planned token travels to Station | 600-900 ms |
| Resident assigned locally | resident preview appears at target | 150-250 ms |
| World plan confirmed | ready-to-active location transition | 700-1100 ms |
| Project active | resident activity loop begins | persistent |
| Reward selected | sticker settles into Home | 500-800 ms |

Business/game state commits before celebratory animation. Animation failure never rolls back a valid decision or allocation. Buttons lock during the atomic transition to prevent duplicate events.

## 23. Character scene logic

### Main resident

- idle at Home in Scene 0;
- acknowledge the ready decision in Scene 1;
- appear beside the selected project during preview;
- use `pack-front` at Station or `work-front` at Workshop;
- use `celebrate-front` only for the reflection reward;
- return to a lived-in activity pose after the ceremony.

### Supporting residents

- one supports Picnic Green;
- one supports Workshop or Station;
- use complete pose replacements, not visible geometric limbs;
- unassigned residents remain active at Home rather than looking rejected.

## 24. Responsive composition

### Desktop

- world stage: approximately 65-70% width;
- action panel: approximately 30-35% width;
- fixed world aspect ratio;
- world remains visible during the entire decision-to-project sequence.

### Mobile

- world occupies the stable upper region;
- forms and decisions use a bottom sheet;
- resident assignment uses tap-select then tap-target;
- no essential action requires drag;
- text and controls never overlay resident faces or project markers.

## 25. Audio and motion

P0 audio is optional and muted by default for reliable video capture.

- paper pop for project readiness;
- soft wooden tap for assignment;
- short bright chime for reward;
- no slot-machine cadence, coin shower, alarm, or loss sound.

Support `prefers-reduced-motion`. Reduced mode uses crossfades, immediate placement, and no curved token travel.

## 26. Seeded demo state

### User

- name: Maya;
- monthly discretionary plan: `$600 AUD`;
- primary goal: Japan trip;
- planned progress one milestone short of hostel preparation.

### Decision

- `$180 sneakers`;
- status: ready;
- motive: trend/sale;
- three similar items in My Stuff;
- opportunity cost: one hostel night.

### World

- Home Nook active;
- Workshop, Picnic Green, and Little Station locked but visible;
- two residents available;
- Reflection XP one review short of a cosmetic reward;
- three reward choices preloaded;
- reset reproduces this state exactly.

## 27. P0 acceptance criteria

### Business

- a new want can be captured and genuinely enters cooling;
- seeded ready decision can resolve to Buy, Skip, or Extend;
- Skip does not move goal progress;
- allocation requires explicit confirmation and is labelled planned;
- overlap reasons come from seeded My Stuff data;
- a decision cannot grant Reflection XP twice;
- all state survives refresh and Reset Demo restores the seed.

### Game

- three different business signals make three projects available;
- only two residents can be assigned in one cycle;
- the same resident cannot be double-assigned;
- changing an unconfirmed assignment releases the prior target;
- confirming assignments changes exactly two project/location states;
- the unselected project remains available without punishment;
- Buy creates no negative character/world state;
- reward selection is cosmetic and persists;
- missing or reduced animation never corrupts state.

### Art and UX

- all hero assets are finished illustrations, not CSS primitive characters;
- locations use coherent full-state illustrations;
- no text overlaps the world or decision controls on desktop/mobile;
- game-critical click targets remain stable between art variants;
- all critical assets preload before the demo flow begins;
- reduced-motion mode remains fully usable.

## 28. Explicit P0 exclusions

- real-time resource production;
- city zoning, roads, utilities, population, or taxes;
- random events and procedural simulation;
- virtual currency or cosmetic shop;
- free furniture placement;
- arcade/minigames;
- real-money rewards;
- full character creator;
- punitive decay or absence timers;
- bank, payment, marketplace, or transaction integration;
- claims that game state predicts happiness or proves environmental impact.

---

# Part C - Inventory Entry, Full Loop, Engine Integration, and APIs

## 29. My Stuff entry strategy

### Principle: progressive inventory, not inventory onboarding

Lemonade must work before the user builds a complete inventory. Do not ask a new user to photograph a wardrobe, scan a room, import receipts, or complete dozens of attributes.

The inventory grows at moments when the information is already relevant:

1. during a purchase consideration;
2. after the user confirms an existing substitute;
3. after a self-reported purchase;
4. when the user voluntarily opens My Stuff.

### First-use flow

- set one goal and discretionary plan;
- optionally choose two or three frequent temptation categories;
- offer `Add one thing you often rebuy`, but allow Skip;
- enter My World immediately.

An empty My Stuff disables only overlap evidence. Cooling, goal comparison, frequency history, review, and the world remain usable.

### Contextual quick add

During Capture, ask:

> Do you already own something that does the same job?

Actions:

- select a suggested item already in My Stuff;
- `Yes, add one`;
- `No / not sure`.

`Yes, add one` opens a two-step quick add:

1. take/select a photo or type a short name;
2. confirm prefilled category and use tags inherited from the considered item.

Photo, colour, condition, brand, purchase date, and notes are optional. The minimum valid item is `name + category + one use tag`.

### Other low-friction entry points

- **After Buy:** one-tap `Add to My Stuff`, prefilled from the decision.
- **After Reuse:** selected existing item can be enriched later without blocking the decision.
- **My Stuff page:** camera button and short manual form.
- **Future bulk mode:** multi-photo candidate review, never silent auto-import.
- **Future browser/share extension:** create a purchase consideration, not scrape a full shopping history.

### Image handling

P0 processes images in the browser:

- correct orientation;
- centre-crop to a square preview;
- resize to approximately 256-512 px;
- encode as compressed WebP;
- store only the reduced preview locally;
- retain the original nowhere unless the user explicitly chooses upload.

The demo seed contains 8-12 curated items. Seeded data must be clearly a demo persona, not presented as automatically discovered user data.

### Friction targets

- no required inventory step during onboarding;
- contextual quick add: under 10 seconds;
- no more than two confirmations after photo selection;
- all AI-filled fields editable;
- `Skip for now` always visible;
- one failed image/AI request never loses the typed name or blocks Capture.

## 30. Complete product loop

### Cold-start loop

```text
Choose goal + discretionary plan
  -> enter Lemonade Lane
  -> optional one-item My Stuff seed
  -> see one real action: I'm tempted
```

### Recurring behaviour loop

```text
Impulse occurs
  -> Capture item
  -> Need / Replacement / Want
  -> contextual My Stuff check
  -> budget + goal + frequency intervention
  -> Cool / Buy / Reclassify
  -> Ready review after 24h
  -> Buy / Skip / Extend
  -> Reflection recorded
  -> optional Reuse commitment
  -> optional Planned allocation
  -> game projects become available
  -> assign two residents among eligible projects
  -> world activities persist
  -> optional bounded cosmetic choice
  -> return to world with next pending decision visible
```

### Buy branch

```text
Buy
  -> honest Reflection XP
  -> optional Add to My Stuff
  -> no negative world state
  -> return to project planning with only eligible signals
```

### Skip branch

```text
Skip
  -> honest Reflection XP
  -> optional reuse/repair confirmation
  -> amount becomes available to redirect
  -> explicit planned allocation or leave unallocated
  -> corresponding projects become available
```

The loop succeeds even if the user does not Skip, does not allocate, and does not add an owned item. The game shows fewer newly eligible projects but never blocks or shames the user.

## 31. Embedding business logic into the game engine

### Architecture

Use one persisted root state with separate slices:

```ts
type AppState = {
  business: BusinessState;
  world: WorldState;
  eventLog: DomainEvent[];
  effectQueue: UiEffect[];
};
```

Commands are the only public write API:

```ts
captureDecision(input)
startCooling(decisionId)
resolveDecision(decisionId, outcome)
commitReuse(decisionId, ownedItemId, action)
planAllocation(decisionId, goalId, amount)
assignResident(projectId, residentId)
confirmWorldPlan()
selectReward(rewardId)
```

### Transaction flow

```text
UI dispatches command
  -> command validator checks business/game invariants
  -> pure business reducer creates new business state + domain events
  -> append events with stable IDs
  -> pure world projector folds unseen events into world state
  -> persist the complete root state once
  -> enqueue non-authoritative visual effects
  -> UI renders derived selectors
```

Conceptual implementation:

```ts
function execute(state: AppState, command: Command): AppState {
  const result = handleCommand(state, command);
  const withEvents = appendUniqueEvents(result.state, result.events);
  const projected = projectUnseenEvents(withEvents);
  return enqueueEffects(projected, result.events);
}
```

### Required boundaries

- components never call `grantXp`, `unlockLocation`, or `addGoalProgress` directly;
- animations consume `effectQueue` but cannot mutate business data;
- world projector checks processed event IDs for idempotency;
- selectors derive eligible projects and resident availability;
- Zod validates command inputs, persisted-state migrations, and AI responses;
- pure reducers receive a supplied clock/ID generator so tests are deterministic;
- Reset Demo replaces the complete root state, not individual slices.

### Suggested modules

```text
domain/business/commands.ts
domain/business/decision-machine.ts
domain/business/allocation.ts
domain/business/overlap.ts
domain/events.ts
domain/world/projector.ts
domain/world/projects.ts
domain/world/residents.ts
domain/app-reducer.ts
store/app-store.ts
ui/effects/effect-runner.ts
```

No event-bus, XState, Redux, or game-engine package is required for P0. Typed discriminated unions and pure reducers are sufficient.

## 32. Runtime API requirements

### P0: no external runtime API required

The full judged loop can run with:

- Next.js/React client;
- local seed JSON;
- Zustand persistence;
- browser time and File APIs;
- browser Canvas only for client-side image resizing/compression;
- local deterministic overlap and opportunity-cost rules;
- Motion for visual effects.

There is no required database, auth, bank, marketplace, map, notification, product-search, carbon, or game API.

### Internal API route if AI is enabled

```text
POST /api/ai/extract-item
```

Input:

- one resized product image;
- optional typed name;
- optional current category.

Output:

```ts
type ExtractedItem = {
  suggestedName: string | null;
  category: string | null;
  colour: string | null;
  useTags: string[];
  confidence: number;
  explanation: string;
};
```

The server route keeps `GROQ_API_KEY` out of the browser, limits image size, applies a short timeout, validates output with Zod, and returns a manual-entry fallback on any error.

Do not add separate APIs for AI coaching, world simulation, overlap, or opportunity cost in P0.

### Storage choices

- structured state: Zustand persist/localStorage for P0;
- reduced image thumbnails: localStorage only if the compressed total remains small;
- if image volume grows, move image blobs to IndexedDB while keeping IDs in the main state;
- production multi-device sync would require a backend later, but it is not necessary for the demo.

## 33. AI decision

### Recommendation

AI is **optional P1**, not a P0 dependency. Add exactly one visible AI feature only after the deterministic loop and world sequence work:

> Product-photo extraction that pre-fills item name, category, colour, and use tags.

This AI use directly reduces My Stuff/Capture friction and supports the owned-item overlap differentiator.

### AI must not decide

- whether an item is necessary;
- whether the user should buy;
- whether two products are definitely equivalent;
- how much money was saved;
- happiness, environmental impact, or financial risk;
- game rewards or project eligibility.

### Groq implementation

Current official Groq documentation supports image inputs through vision-capable models. A suitable hackathon option is `meta-llama/llama-4-scout-17b-16e-instruct`. Its structured output support is best-effort rather than strict, so every response must still pass local Zod validation and have a manual fallback.

Use a three-state UI:

- `Analysing photo...`;
- editable suggestions;
- `Couldn't analyse - enter details manually`.

Timeout target: approximately 3-5 seconds. Cache the accepted result with the item so reopening it does not call AI again.

### Priority order

1. deterministic business loop;
2. game event projection and resident assignment;
3. world art and reliable animation;
4. image compression and manual quick add;
5. Groq extraction;
6. any coaching copy, only if all preceding work is complete.

## 34. First-open user experience walkthrough

### 34.1 Arrival

The website opens directly into Lemonade Lane, not a marketing landing page. The world is visible behind a short setup sheet so the user immediately understands that this is both a decision tool and a small living world.

The initial world contains:

- an active Home Nook;
- the main pocket mouse resident;
- Picnic Green, Workshop Corner, and Little Station as quiet future places;
- no fake buildings, progress, or owned items until setup is confirmed.

### 34.2 Three-step setup

#### Step 1 - Choose what to make room for

Prompt:

> What would you rather make room for?

Choose:

- experience;
- savings/security;
- debt.

Then enter goal name, target amount, and existing starting amount. The demo offers `Japan trip` as a one-click example.

#### Step 2 - Set a planning boundary

Enter a monthly discretionary plan. The copy says this is a self-set planning number, not a bank balance.

#### Step 3 - Optional personalisation

Choose common temptation categories and an optional coaching tone. Offer `Add one thing you often rebuy`, but keep a prominent Skip action. Do not require My Stuff setup.

After confirmation, the setup sheet closes and the main resident enters Home.

### 34.3 My World home state

The primary screen shows:

- the illustrated world as the dominant surface;
- goal name and planned progress;
- monthly planning capacity;
- `Ready` and `Cooling` decision counts;
- primary action `I'm tempted`;
- navigation to Decisions and My Stuff;
- an illustrated cooler tray representing Cooling decisions.

No chart dashboard appears before the world. Financial labels remain concise and readable outside the illustration.

### 34.4 Capture an impulse

The user selects `I'm tempted`. A side panel on desktop or bottom sheet on mobile opens without hiding the entire world.

#### Product input

Options:

- take/upload a photo;
- type name and price;
- choose the seeded `$180 sneakers` example in Demo Mode.

If AI is available, the image can prefill name, category, colour, and use tags. Suggestions remain editable and failure falls back to manual entry.

#### Classification

Ask:

> Is this a need, a replacement, or a want?

Choosing Need requests one short reason and exits the wants intervention. Replacement continues to repair/reuse options. Want continues through the full intervention.

#### Existing-item check

Ask:

> Do you already own something that does the same job?

Show existing matches. If none exist, offer a contextual two-step quick add or `No / not sure`; never block progress.

#### Intervention reveal

Show information progressively rather than as one warning wall:

1. the best My Stuff overlap and why it matched;
2. the hypothetical remaining discretionary capacity;
3. one goal equivalent such as `one hostel night`;
4. one verified frequency observation.

Actions:

- `Cool for 24 hours` - primary for a Want;
- `Buy anyway`;
- `This is necessary`.

### 34.5 Cooling state

After `Cool for 24 hours`:

- the item moves into the illustrated cooler tray;
- a real review timestamp is stored;
- the world does not upgrade and no XP is awarded;
- the user returns to My World;
- Decisions > Cooling shows the countdown, original reason, and evidence.

The user may report Buy or reclassify during Cooling, but the app cannot prevent an external checkout.

### 34.6 Ready review

When the timestamp passes, the cooler tray displays a restrained Ready marker. Opening it restores the original context:

- what the user wanted;
- why they wanted it;
- matching owned items;
- goal trade-off;
- category frequency;
- time spent cooling.

Ask:

> Now that some time has passed, what do you want to do?

Actions:

- `Buy`;
- `Skip`;
- `Keep cooling`.

For the hackathon, a separate seeded decision is already Ready. A newly captured item never pretends that 24 hours have elapsed.

### 34.7 Buy branch

After Buy:

1. optionally record a short reason;
2. grant fixed Reflection XP for completing the review;
3. offer `Add to My Stuff` with all fields prefilled;
4. show no sad character, damage, wilt, or failed streak;
5. return to My World.

Only the Reflection project signal becomes newly available unless another valid business event exists.

### 34.8 Skip branch

After Skip:

1. record Reflection and fixed XP;
2. state clearly that `$180 was not moved`;
3. ask whether the user will use, repair, borrow, or restyle an existing item;
4. offer a separate allocation sheet with destination and amount;
5. label the confirmation `$180 planned toward Japan`, not saved or transferred;
6. persist Reflection, ReuseCommitment, and PlannedAllocation events independently.

The user may skip reuse, allocation, or both and still finish the decision.

### 34.9 Enter world-management mode

After the seeded Skip path, three locations become available for different reasons:

- Picnic Green from Reflection;
- Workshop Corner from ReuseCommitment;
- Little Station from PlannedAllocation.

The UI changes from decision mode to planning mode and states:

> 2 residents, 3 possible projects. What should happen this week?

The user selects a resident and then a location. Drag is optional; tap-select/tap-target always works. Selecting a project previews the resident and activity without committing it.

### 34.10 Confirm world plan

After two assignments:

1. show both selected activities and the waiting project;
2. user confirms `Plan this week`;
3. the app persists assignments atomically;
4. selected locations transition from ready to active;
5. residents move into complete activity poses;
6. the unselected project stays warm and available for the next cycle.

No location is labelled failed and nothing deteriorates.

### 34.11 Reflection reward

The seeded account reaches a Reflection milestone after this review. Three complete cosmetic stickers appear, such as a plant, lamp, and postcard.

- choose one;
- it settles into Home;
- it provides no gameplay or financial advantage;
- the other choices do not become purchasable offers.

### 34.12 Return state

The user returns to My World and sees:

- the selected locations lived in by residents;
- the waiting project still available;
- the chosen Home cosmetic;
- updated planned goal progress;
- the next Cooling/Ready decision;
- the same primary action `I'm tempted`.

The recurring loop is now visually understandable without tutorial text: purchasing decisions create evidence and plans; confirmed signals create possible projects; resident choices determine what life appears in the world.

## 35. Shopping interception layer

### Product role

The website is the decision and world-management destination. A browser extension or mobile share sheet is the distribution surface that brings Lemonade into the shopping moment.

Without this layer, the user must remember to open Lemonade before checkout. That is the main adoption weakness of a standalone web app.

### Trigger strategy

Do not show a blocking modal every time a user opens a product page.

Use progressive intervention:

1. **Product page loaded:** show a small passive Lemonade tab/chip.
2. **Repeated product visit or Add to Cart intent:** visually strengthen the chip and offer `Pause with Lemonade`.
3. **Buy Now / checkout intent:** in an explicitly enabled stronger mode, show a dismissible decision overlay.
4. Always provide `Continue anyway`; never claim the extension can prohibit payment.

For the hackathon, implement one predictable Add to Cart trigger. Do not attempt behavioural scoring or repeated-visit detection unless the core demo is already stable.

### Detection pipeline

The WXT content script can inspect, in order:

1. `application/ld+json` with Schema.org `Product`/`Offer` data;
2. Open Graph product/title/image metadata;
3. common semantic price elements and currency text;
4. button text/accessible names such as `Add to cart` or `Buy now`;
5. manual fallback when extraction is incomplete.

Extract only:

- product name;
- displayed price and currency;
- primary image URL;
- category when explicitly available;
- source URL and merchant hostname.

AI is not required for page detection or metadata extraction. Deterministic structured-data parsing is faster and more explainable.

### Extension experience

```text
Open product page
  -> quiet Lemonade tab appears
  -> click Add to Cart
  -> compact overlay: `Pause before this becomes a purchase?`
  -> product preview + Pause with Lemonade / Continue anyway
  -> Pause opens the Lemonade Capture route with fields prefilled
  -> website performs classification, My Stuff matching, Cooling, and world logic
```

The overlay itself must not contain the complete game or inventory. It is an entry point into the existing business loop.

### Web handoff for the MVP

Recommended handoff:

```text
https://<lemonade-site>/capture
  ?name=...
  &price=...
  &currency=AUD
  &image=...
  &source=...
```

The website treats all query values as untrusted suggestions:

- validate and decode safely;
- constrain field length and price format;
- display a confirmation before creating a decision;
- never fetch arbitrary server-side URLs;
- remove sensitive query data from the address/history after import where practical.

This avoids duplicating Zustand/localStorage state between the website and extension. A future authenticated backend can replace the URL handoff with account sync.

### WXT shape

```text
entrypoints/shopping.content.ts
domain/extract-product.ts
domain/find-purchase-actions.ts
ui/intervention-overlay.tsx
utils/open-lemonade.ts
```

Use a Shadow Root content-script UI to isolate styles. Observe DOM/path changes for SPA retailers and remount idempotently. No runtime code should depend on one retailer's generated CSS class names when JSON-LD or accessible labels are available.

### Permissions and privacy

- request only the shopping-site access needed by the current build;
- P0 may support a controlled demo storefront plus one generic JSON-LD path;
- do not read card, address, checkout-form, account, or browsing-history data;
- do not upload page data until the user chooses `Pause with Lemonade`;
- do not record every viewed product automatically;
- provide a clear disable/bypass control;
- never use the extension to recommend more products.

### Hackathon scope decision

The interception layer is strategically core but implementation-wise P1 until the website loop is reliable.

Best demo scope:

- one functional WXT content script;
- one controlled or reliably structured product page;
- deterministic name/price/image extraction;
- one Add to Cart interception overlay;
- one Continue path;
- one Pause path that opens prefilled Lemonade Capture.

Do not claim universal retailer support. A functional vertical slice is more credible than brittle all-sites interception.
