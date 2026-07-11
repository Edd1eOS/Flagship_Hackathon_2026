# Lemonade Complete Technical Stack

> Date: 2026-07-11  
> Status: target architecture with staged extraction; P0 may colocate modules inside the web app  
> Constraints: one core developer, approximately 24 hours, deployed website + GitHub + three-minute video  
> Focus: frontend, world-simulation engine, shopping interception, deterministic offline demo

> **Integration notice:** Next.js/WXT/shared-domain/Zustand/Zod/Motion/testing choices remain current. The final engine keeps town projects/resident scheduling and adds Scout companion/mission state; combined UI and state responsibilities are defined in `13-town-dashboard-uiux.md`.

## 1. Engineering objective

The implementation must demonstrate meaningful technical depth without expanding into infrastructure that does not serve the product.

Complexity belongs in:

- pre-purchase interception across a web app and browser extension;
- explicit purchase-decision state transitions;
- event-driven projection from business actions into a game world;
- project prerequisites and limited resident scheduling;
- persistent multi-scene state and deterministic reset;
- responsive illustrated rendering and animation orchestration;
- explainable My Stuff matching;
- tests for financial and game invariants.

Complexity does **not** belong in:

- authentication, bank integration, payments, or a database for a local demo;
- a 3D/physics engine;
- a virtual economy or marketplace;
- multiple AI SDKs;
- realtime multiplayer;
- a large generic component framework.

## 2. Architecture summary

The target architecture is a lightweight pnpm workspace without Turborepo or Nx.

```text
lemonade-mindful-spending/
  apps/
    web/                 # Next.js product and Lemonade Lane
    extension/           # WXT shopping-page intervention
  packages/
    domain/              # schemas, commands, business state machine, extraction
    game-engine/         # event projection, projects, residents, scene state
  docs/
  pnpm-workspace.yaml
  package.json
  tsconfig.base.json
```

Dependency direction:

```text
apps/web ---------> packages/domain
       `----------> packages/game-engine ----> packages/domain

apps/extension ---> packages/domain
```

`domain` and `game-engine` never import React, Next.js, WXT, Motion, or browser DOM code.

### Staged implementation rule

Do not create empty workspace packages before there is a second consumer. Begin with the same boundaries colocated inside `apps/web/src/domain` and `apps/web/src/game-engine`. Extract them into `packages/` only when the WXT extension starts and needs shared imports. This preserves the architecture and tests without spending early hours on package configuration.

## 3. Frontend application stack

### Framework

- **Next.js App Router**
- **React**
- **TypeScript with `strict: true`**
- **pnpm workspaces**
- **Vercel deployment**

The App Router supplies layouts, routes, metadata, loading/error boundaries, and the optional AI Route Handler. The product experience remains client-driven because local state, timers, file input, and the simulation are interactive.

### Route shape

```text
/                     My World / Lemonade Lane
/capture              new consideration, including extension handoff
/decisions            Ready / Cooling / History
/decisions/[id]       intervention and review
/my-stuff             owned-item capability library
/goal                 planned goal details
/api/ai/extract-item  optional server-only Groq call
```

Use route-level pages for direct links, but render Capture/Review as a side panel on desktop and bottom sheet on mobile when entered from My World.

### Server and client boundary

Server Components:

- app shell and metadata;
- static font and asset configuration;
- non-interactive layout where useful.

Client Components:

- all Zustand consumers;
- decision forms and timers;
- world stage and resident assignment;
- file/image processing;
- animation/effect runner.

Only `/api/ai/extract-item` requires server execution. Do not add Server Actions for local domain mutations.

## 4. UI system

### Styling

- **Tailwind CSS** for layout, responsive rules, tokens, and state classes;
- CSS custom properties for brand palette, z-index, durations, and world coordinates;
- CSS Modules only for complex world-stage isolation if Tailwind becomes unreadable.

### Component primitives

- **shadcn/ui with Radix primitives**, added component by component;
- **Lucide React** for standard action icons;
- **Sonner** for concise non-game toast feedback;
- native buttons and form controls whenever a primitive adds no value.

Required primitives:

- Button;
- Dialog/AlertDialog;
- Sheet/Drawer;
- Tabs;
- Tooltip;
- Select;
- Slider only for allocation amount;
- Form fields;
- Toast/Sonner.

Do not use a dashboard block or nested card system. The world is the main surface; business panels are restrained overlays/bands.

### Typography

- one hand-drawn display font for Lemonade, page headings, and milestones;
- one readable sans-serif for forms, money, timers, and body text;
- tabular numerals for amounts/countdowns;
- no viewport-scaled font sizes and no negative letter spacing.

## 5. Lemonade Lane renderer

### Rendering choice

Use a responsive DOM-based 2D scene, not Phaser, PixiJS, Three.js, or `<canvas>`.

Reasons:

- the world is one fixed pocket neighbourhood, not a free camera map;
- there is no physics, collision, combat, or high-volume sprite field;
- DOM buttons provide accessible project hotspots;
- responsive layout and bottom sheets are easier to coordinate;
- Playwright can inspect and screenshot every state;
- complete raster scene variants can be layered without rebuilding a renderer.

### World stage

```tsx
<WorldStage>
  <BackgroundLayer />
  <GroundLayer />
  <RearSceneryLayer />
  <LocationLayer />
  <ResidentShadowLayer />
  <ResidentLayer />
  <ForegroundLayer />
  <EffectLayer />
  <HotspotLayer />
</WorldStage>
```

Implementation rules:

- fixed `aspect-ratio` and constrained max size;
- percentage-based anchors for locations and residents;
- stable hotspot rectangles independent of transparent image bounds;
- explicit z-index token map;
- `pointer-events: none` on decorative layers;
- real buttons with accessible names in HotspotLayer;
- complete `locked / ready / active / lived_in` location images;
- no runtime construction from CSS circles or dozens of generated props.

### Asset manifest

Use a typed manifest instead of hard-coded image paths inside components:

```ts
type SceneAsset = {
  id: string;
  src: string;
  width: number;
  height: number;
  anchor: { x: number; y: number };
  preload: boolean;
};
```

Preload the world base, hero resident, ready sneakers, and all assets used in the 90-second demo path. Lazy-load unused cosmetic/location variants.

### Image formats

- WebP for opaque or simple-alpha world assets;
- PNG for alpha edges that WebP visibly damages;
- generated art at approximately 2x display resolution;
- Next/Image for regular content images;
- normal preloaded `<img>` layers for absolute world sprites where predictable sizing is more important than automatic layout behaviour.

## 6. Motion and visual-effects engine

Use **Motion for React** through `motion/react`.

### Motion responsibilities

- location-state crossfades/build sequences;
- resident path movement;
- pose swaps and squash/settle;
- planned-token curved movement;
- reward fan and Home placement;
- panel/sheet transitions;
- layout changes in Decisions and My Stuff.

### SceneDirector

Create one `SceneDirector`/`EffectRunner` that consumes transient `UiEffect` objects:

```ts
type UiEffect =
  | { type: 'XP_ROLL'; amount: number }
  | { type: 'PROJECT_READY'; projectId: string }
  | { type: 'PLANNED_TOKEN'; allocationId: string; targetId: string }
  | { type: 'ACTIVATE_LOCATION'; locationId: string }
  | { type: 'RESIDENT_TRAVEL'; residentId: string; targetId: string }
  | { type: 'REWARD_SETTLE'; rewardId: string };
```

Effects are produced after a valid state transition. They do not own amounts, unlocks, or eligibility.

### Effect sequencing

- domain/game state commits first;
- SceneDirector acknowledges each effect after completion;
- failed or skipped animation still acknowledges it;
- effect queue is not persisted across reloads;
- `prefers-reduced-motion` replaces paths/springs with short crossfades;
- animation components never dispatch financial/game progression commands.

### Timing budget

- press feedback: 80-140 ms;
- panel transition: 180-260 ms;
- marker/project readiness: 300-500 ms;
- planned-token travel: 600-900 ms;
- location activation: 700-1100 ms;
- no unskippable sequence longer than approximately 1.2 seconds.

## 7. State and persistence

### Zustand root store

Use **Zustand** with one root store and typed slices:

```ts
type AppState = {
  schemaVersion: number;
  business: BusinessState;
  world: WorldState;
  eventLog: DomainEvent[];
  demo: DemoState;
  effects: UiEffect[]; // transient, excluded from persistence
};
```

One persisted JSON key keeps business state, world state, and processed events consistent. Do not persist each slice independently.

Use:

- `persist` middleware;
- `partialize` to exclude transient effects and file object URLs;
- versioned migration function;
- `resetDemo()` that replaces the entire persisted root;
- selectors for narrow component subscriptions.

### Image storage

P0:

- resize user image in browser with File + Canvas APIs;
- store a small 256-512px WebP preview;
- reject oversized input before processing;
- keep total demo image data bounded.

If persistent image volume becomes meaningful, add IndexedDB later. Do not add a database only for one demo upload.

### Clock and IDs

- absolute ISO timestamps;
- inject `Clock.now()` into pure commands;
- use `crypto.randomUUID()` behind an injectable `IdGenerator`;
- timer display may tick, but readiness is always derived from `now >= reviewAt`;
- tests use a fixed clock and deterministic IDs.

## 8. Shared domain package

`packages/domain` is the source of truth for business behaviour.

```text
packages/domain/src/
  schemas/
    goal.ts
    owned-item.ts
    decision.ts
    allocation.ts
    event.ts
  commands/
    capture.ts
    cooling.ts
    resolve.ts
    reuse.ts
    allocation.ts
  decision-machine.ts
  overlap.ts
  opportunity-cost.ts
  planning-capacity.ts
  product-extraction.ts
  clock.ts
  ids.ts
  seed.ts
```

### Validation

Use **Zod 4** at all untrusted boundaries:

- form submission;
- extension URL handoff;
- localStorage hydration/migration;
- AI response;
- imported demo seed.

Internal engine functions receive already parsed domain types and do not repeatedly validate the same object.

### Decision state machine

```text
draft
  -> assessed
      -> cooling
      -> bought
      -> reclassified_need

cooling
  -> ready
  -> bought
  -> reclassified_need

ready
  -> bought
  -> skipped
  -> extended -> cooling
```

Transitions run through command handlers. React components cannot assign a status string directly.

### Explainable overlap engine

Deterministic weighted rules:

```text
category match       0.45
shared use tags      0.35
colour/style match   0.10
usable condition     0.10
```

Return score plus human-readable reasons. AI may propose tags but never decides overlap or necessity.

## 9. Game-engine package

`packages/game-engine` is a deterministic, turn-based simulation engine.

```text
packages/game-engine/src/
  state.ts
  projector.ts
  event-deduplication.ts
  eligibility.ts
  projects.ts
  residents.ts
  assignments.ts
  simulate-cycle.ts
  progression.ts
  rewards.ts
  selectors.ts
  effects.ts
  invariants.ts
```

### Input contract

The engine receives immutable business events:

```ts
type BusinessEvent =
  | DecisionReviewed
  | ReuseCommitted
  | AllocationPlanned
  | ItemAddedToStuff;
```

It never reads form state or mutates a PurchaseDecision.

### Event projection

```ts
function projectBusinessEvent(
  world: WorldState,
  event: BusinessEvent,
): WorldProjectionResult
```

The projector:

1. checks `processedBusinessEventIds`;
2. derives new signals/eligibility;
3. adds fixed Reflection XP once;
4. changes relevant project from locked to available;
5. records the processed ID;
6. returns domain-independent visual effects separately.

### Project recipes

```ts
type ProjectRecipe = {
  id: ProjectId;
  locationId: LocationId;
  requiredSignals: GameSignalType[];
  residentSlots: number;
  activityId: ActivityId;
};
```

P0 recipes:

- Picnic Green requires Reflection;
- Workshop requires ReuseCommitment;
- Little Station requires PlannedAllocation for the active goal.

Signals are eligibility facts, not currencies. They are not spent, traded, purchased, or generated from item price.

### Resident scheduler

```ts
type ResidentState = {
  id: ResidentId;
  status: 'available' | 'previewing' | 'assigned' | 'active';
  projectId: ProjectId | null;
  locationId: LocationId;
  activityId: ActivityId | null;
};
```

Rules:

- seeded cycle has two available residents;
- one resident can occupy one project;
- project capacity is explicit;
- preview assignment is reversible;
- `confirmWorldPlan` validates the full assignment set atomically;
- unselected projects remain available;
- active/lived-in projects do not regress after Buy or absence.

### Cycle simulation

P0 is turn-based, not realtime:

```ts
simulateCycle(world, confirmedAssignments)
  -> nextWorldState
  -> UiEffect[]
```

The function:

- advances the cycle number;
- marks assignments active;
- moves location states to active/lived-in;
- assigns persistent resident activities;
- evaluates an XP reward milestone;
- produces an ordered effect plan.

There is no random result. Future procedural events must use a seeded PRNG to remain replayable.

### World state machine

```text
locked -> available -> assigned -> active -> lived_in
                    -> available  // cancel before confirmation
```

### Engine invariants

- Skip never changes goal progress by itself;
- allocation references a skipped decision;
- allocated source total cannot exceed decision price;
- Buy creates no negative world mutation;
- one business event is projected once;
- one decision awards Reflection XP once;
- one resident cannot be double-assigned;
- a locked project cannot receive a resident;
- exactly the confirmed projects activate;
- cosmetics never affect eligibility or money;
- Reset produces byte-equivalent canonical seed data except transient IDs where explicitly allowed.

## 10. Command transaction pipeline

The web app exposes commands rather than arbitrary Zustand setters:

```ts
captureDecision(input)
startCooling(id)
resolveDecision(id, outcome)
commitReuse(decisionId, ownedItemId, action)
planAllocation(decisionId, goalId, amount)
previewAssignment(projectId, residentId)
cancelAssignment(projectId)
confirmWorldPlan()
selectReward(rewardId)
```

Execution:

```text
UI command
  -> Zod boundary parse
  -> command guard
  -> business reducer
  -> append stable events
  -> game projector folds unseen events
  -> persist business/world/eventLog as one root object
  -> enqueue transient effects
  -> React selectors render new state
  -> SceneDirector plays effects
```

Conceptual API:

```ts
function execute(state: PersistedAppState, command: Command): TransactionResult {
  const businessResult = handleBusinessOrGameCommand(state, command);
  const withEvents = appendUniqueEvents(businessResult.state, businessResult.events);
  const worldResult = projectUnseenEvents(withEvents);
  assertInvariants(worldResult.state);
  return { state: worldResult.state, effects: worldResult.effects };
}
```

This is the central technical-complexity story for judging.

## 11. Shopping interception extension

### Stack

- **WXT**
- React + TypeScript
- WXT content script
- Shadow Root UI
- shared Zod schemas and product extractor from `packages/domain`
- WXT/browser storage only for extension preferences

### Extension modules

```text
apps/extension/
  entrypoints/
    shopping.content.tsx
    options.html
  src/
    adapters/
      json-ld.ts
      open-graph.ts
      generic-dom.ts
    purchase-intent.ts
    intervention-overlay.tsx
    handoff.ts
```

### Detection

1. Schema.org Product/Offer JSON-LD;
2. Open Graph product metadata;
3. semantic price/currency fallback;
4. accessible Add to Cart labels;
5. manual field confirmation in the web app.

Use WXT location watching/MutationObserver for SPA navigation. Mount the overlay idempotently and isolate styles through Shadow Root UI.

### Handoff

The extension does not duplicate the game store. It opens:

```text
/capture?name=...&price=...&currency=...&image=...&source=...
```

The web app treats parameters as untrusted suggestions, validates them, confirms them with the user, imports them, then removes sensitive query content from visible history where practical.

### Scope

P1 vertical slice:

- controlled demo product page or one reliable JSON-LD page;
- Add to Cart reminder;
- Pause and Continue actions;
- prefilled web Capture.

Do not claim universal retailer support or request broad browsing permissions for the demo.

## 12. Forms, dates, and utilities

### Forms

- **React Hook Form** for onboarding, Capture, and allocation sheets;
- **@hookform/resolvers** for Zod integration;
- controlled local state for tiny one-question steps.

Persist drafts explicitly only when leaving a multi-step flow; do not write to Zustand on every keystroke.

### Dates

- **date-fns** for `addHours`, display, and duration formatting;
- inject current time into domain functions;
- refresh visible countdown at a restrained interval;
- use absolute time for readiness and test timezone boundaries.

### File/image processing

- native File API;
- Canvas resize/crop/encode;
- object URLs for immediate preview;
- revoke object URLs after use;
- no OCR library in P0.

## 13. AI and server API

### P0

No AI or external runtime API is required. The complete path must work offline after the app loads.

### P1 single AI feature

Use **Groq SDK + Zod** only for product-photo attribute extraction:

```text
POST /api/ai/extract-item
```

Suggested vision model at the time of implementation:

```text
meta-llama/llama-4-scout-17b-16e-instruct
```

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

Rules:

- API key remains server-side;
- resize before upload;
- one image maximum;
- 3-5 second abort timeout;
- no more than one retry;
- Zod parse every response;
- manual entry fallback;
- user confirms all fields;
- no AI necessity, purchase, overlap, allocation, or world decision.

Do not install both Groq SDK and Vercel AI SDK.

## 14. Test stack

### Vitest

Unit-test `packages/domain` and `packages/game-engine` as pure TypeScript.

Required suites:

- every legal and illegal decision transition;
- absolute 24-hour readiness boundaries;
- overlap scoring and reasons;
- allocation capacity and duplicate allocation rejection;
- event idempotency;
- project eligibility;
- resident double-assignment rejection;
- confirm/cancel assignment behaviour;
- Buy non-punishment;
- deterministic Reset and cycle simulation;
- schema migrations.

Use table-driven tests and fixed clocks/IDs. Do not spend the hackathon writing shallow component snapshots.

### Playwright Test

Required web flows:

1. first open -> setup -> My World;
2. Capture -> genuine Cooling;
3. seeded Ready -> Skip -> Reuse -> Allocate;
4. three projects available -> assign two residents -> confirm;
5. location activation + reward choice;
6. Buy branch has no negative state;
7. Reset restores seed;
8. AI route failure falls back manually if AI exists.

Viewports:

- desktop `1440x900`;
- mobile `390x844`.

Use:

- targeted assertions for state and copy;
- ARIA snapshots for navigation/forms;
- screenshot comparison for world overview and activated scene;
- reduced-motion run;
- offline run after initial load.

### Extension test

Minimum:

- unit tests for JSON-LD/OpenGraph extraction;
- one Playwright/manual Chromium test on the controlled product page;
- verify Pause handoff parameters and Continue behaviour.

## 15. Performance and reliability

- keep critical art local under `public/world`;
- preload only the demo path;
- avoid remote image dependency for world art;
- lazy-load My Stuff and reward variants;
- narrow Zustand selectors to prevent the whole world rerendering on timer ticks;
- isolate countdown updates outside static world layers;
- do not animate width/height when transform/opacity works;
- stop resident idle loops when page is hidden where practical;
- provide a static poster fallback if a noncritical animation fails;
- add an Error Boundary around the world renderer;
- add one visible Reset Demo command in a settings menu.

## 16. Accessibility

- every project hotspot is a real button;
- tap-select/tap-target is the primary assignment interaction; drag is optional;
- visible focus state;
- complete keyboard path through Capture, review, assignment, and reward;
- status text accompanies colour/icon changes;
- `aria-live="polite"` for confirmed project/reward updates, not every animation frame;
- reduced-motion support;
- decorative art has empty alt text; meaningful item images have concise alt text;
- minimum touch target approximately 44px;
- world never becomes the only source of money/status information.

## 17. Dependency list

### Root/dev

```text
typescript
eslint
prettier
vitest
@playwright/test
```

### Web production

```text
next
react
react-dom
tailwindcss
zustand
zod
motion
date-fns
lucide-react
react-hook-form
@hookform/resolvers
sonner
```

Plus only the Radix dependencies required by selected shadcn components.

### Extension production

```text
wxt
react
react-dom
zod
```

### Optional P1

```text
groq-sdk
```

Do not install:

- Phaser, PixiJS, Three.js;
- XState, Redux, React Query;
- Firebase, Supabase;
- LangChain;
- chart libraries;
- drag-and-drop library;
- OCR library;
- push-notification SDK;
- a second AI SDK.

## 18. Implementation sequence

### Phase 1 - skeleton

1. pnpm workspace and package boundaries;
2. domain schemas, seed, command types;
3. Next shell, My World route, static scene poster;
4. Zustand persistence and Reset Demo.

### Phase 2 - business engine

1. decision state machine;
2. My Stuff overlap;
3. Cooling/Ready derivation;
4. Buy/Skip/Extend;
5. Reuse and PlannedAllocation;
6. business unit tests.

### Phase 3 - game engine

1. event log and projector;
2. project recipes/eligibility;
3. resident preview/cancel/confirm;
4. cycle simulation;
5. XP/reward rules;
6. engine unit tests.

### Phase 4 - illustrated frontend

1. typed asset manifest;
2. complete world layers;
3. business panels;
4. SceneDirector effects;
5. responsive/mobile path;
6. reduced motion and error fallback.

### Phase 5 - integration and delivery

1. Playwright happy path and screenshots;
2. Vercel deployment;
3. extension vertical slice if time remains;
4. Groq extraction only after extension/core reliability;
5. video capture from a fixed seed.

Cut order if time contracts:

1. AI extraction;
2. extension support beyond the controlled demo page;
3. supporting resident pose variants;
4. extra cosmetic rewards;
5. non-demo locations.

Do not cut domain invariants, Reset Demo, the Ready decision, resident assignment, or the main world activation sequence.

## 19. Judge-facing technical narrative

The three-minute explanation should not list libraries. Explain the system:

> Lemonade has two surfaces and one shared domain. A WXT content script detects purchase intent and hands structured product data to the Next.js app. The app runs an explicit purchase-decision state machine. Confirmed actions emit idempotent domain events, which a deterministic TypeScript simulation engine projects into project eligibility, resident scheduling, and persistent world scenes. React and Motion render the result, while Zod, Vitest, and Playwright enforce the financial and game invariants. AI is optional and only reduces photo-entry friction.

Technical complexity demonstrated:

- cross-surface product interception;
- shared typed contracts;
- state machines;
- event sourcing/projection principles;
- idempotency;
- resource-constrained scheduling;
- persistent simulation state;
- deterministic testability;
- responsive animated scene rendering;
- graceful offline/AI fallback.

## 20. Tools, skills, and MCP

### Tools

- pnpm;
- GitHub;
- Vercel;
- Playwright;
- Chrome DevTools;
- OBS/system recorder;
- Jira/Trello for team evidence.

### Skills

- `imagegen` for the approved model sheet, location-state art, residents, props, and effect cutouts;
- shadcn skill/CLI for current component installation if needed;
- Playwright CLI workflow for repeated browser validation.

### MCP

No MCP is required for the product runtime.

Optional development-only choices:

- shadcn MCP if the agent needs registry exploration;
- Playwright MCP only for persistent interactive browser exploration;
- Atlassian MCP only if the team already uses Jira/Confluence and wants automated task updates.

Do not add Supabase, Figma, GitHub, Context7, or custom Groq MCP merely to increase tool count.

## 21. Source references

- Next.js App Router and Route Handlers: [Next.js App Router](https://nextjs.org/docs/app/getting-started)
- Motion React exit/layout orchestration: [Motion AnimatePresence](https://motion.dev/docs/react-animate-presence)
- Zustand persistence: [Zustand persist middleware](https://zustand.docs.pmnd.rs/reference/middlewares/persist)
- WXT content-script UI and SPA handling: [WXT Content Scripts](https://wxt.dev/guide/essentials/content-scripts)
- WXT extension storage: [WXT Storage](https://wxt.dev/guide/essentials/storage.html)
- Zod runtime validation: [Zod](https://zod.dev/)
- Groq image inputs: [Groq Responses API](https://console.groq.com/docs/responses-api)
- Groq structured-output constraints: [Groq Structured Outputs](https://console.groq.com/docs/structured-outputs)
- Playwright visual comparisons: [Playwright screenshots](https://playwright.dev/docs/next/test-snapshots)
- Playwright accessibility snapshots: [Playwright ARIA snapshots](https://playwright.dev/docs/aria-snapshots)
