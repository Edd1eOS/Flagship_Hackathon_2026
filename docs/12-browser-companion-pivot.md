# Lemonade Browser Companion Pivot

> Date: 2026-07-11  
> Status: intermediate companion specification based on an incorrect replace-town assumption; companion detection/mission details remain useful, but the combined current layout is `13-town-dashboard-uiux.md`  
> Correction: the browser companion extends Lemonade Lane and returns into it; it does not replace the town-management dashboard  
> Keeps: purchase state machine, My Stuff, repair/reuse experiment, Cooling, honest review, optional planned allocation

## 1. Final product definition

Lemonade is a **pre-purchase browser companion** that appears at the moment of online shopping, reminds the user what they already own, and turns a 24-hour pause into a concrete reuse or repair mission before they reconsider buying.

It is not primarily:

- a budgeting dashboard;
- a savings-goal tracker;
- a city builder;
- an AI shopping coach;
- a payment blocker;
- an operating-system desktop pet.

The mouse is a floating browser-page companion injected by a WXT extension. The web application is its Home Nook, My Stuff library, mission history, and decision-review surface.

## 2. Final value proposition

### Category

> A pre-purchase reuse companion.

### Primary value proposition

> Before you buy something new, Lemonade helps you see whether something you already own can do the same job.

### Full pitch line

> Most budgeting apps tell you where your money went. Lemonade appears before it leaves: a pocket mouse detects a product page, brings back what you already own, and turns the 24-hour pause into a real reuse or repair mission before you decide freely.

### Supporting line

> Use what you have. Repair what still works. Buy only when the new item solves a real unmet need.

### Existing tagline

`Spend on moments, not stuff.` remains a closing/emotional line, not the primary explanation of the product.

## 3. Why the mouse belongs in the product

The companion is not a decorative mascot added after the workflow.

- It lives at the shopping moment where intervention is needed.
- It carries visual reminders of owned items into the product page.
- It starts and tracks Cooling/reuse missions.
- Its Home is built from repaired human objects, reinforcing reuse.
- Its behaviour changes according to the type of mindful action, not the amount of money skipped.

Pitch copy:

> Pocket mice see possibility in what humans overlook. Lemonade's mouse brings that same perspective to online shopping: before something new enters the cart, it asks what the user already has, what can be repaired, and what job the new product is really meant to solve.

## 4. Experience surfaces

### Browser companion

Injected into supported shopping pages as a small illustrated mouse/tab.

Responsibilities:

- detect high-confidence product pages;
- extract name, displayed price, image, currency, and source;
- show a restrained presence on page load;
- respond to Add to Cart intent;
- offer `Pause with Lemonade` and `Continue anyway`;
- show a matching owned item when available;
- start/open a mission through the website/extension state bridge.

### Web Home Nook

Directly usable from the required website link, with or without the extension.

Responsibilities:

- first setup or seeded demo;
- My Stuff capability library;
- Cooling and Ready decisions;
- mission selection and completion;
- review history;
- bounded cosmetic rewards;
- privacy/settings/extension status;
- Reset Demo.

### Future mobile surface

A share sheet can send a product into the same Capture flow. It is not P0.

## 5. Detection confidence

The extension must not pop up on every page containing a price.

```ts
type DetectionConfidence = 'none' | 'low' | 'medium' | 'high';
```

Evidence:

- Schema.org `Product` + `Offer`;
- product Open Graph metadata;
- visible currency/price;
- product image;
- accessible `Add to Cart` or `Buy now` action;
- merchant adapter on a controlled demo page.

Suggested rule:

```text
high    = structured Product + price + purchase action
medium  = product metadata + price or purchase action
low     = purchase-like button/price without product identity
none    = insufficient evidence
```

Behaviour:

- high: mouse appears quietly and Add to Cart can trigger the prompt;
- medium: small manual mouse tab only, no automatic modal;
- low/none: no automatic intervention;
- user can manually invoke Lemonade from the extension action.

AI is not used for page detection.

## 6. Companion state machine

```text
hidden
  -> peeking             // high-confidence product detected
  -> curious             // user hovers/clicks mouse
  -> prompting           // Add to Cart intent or manual open
  -> comparing           // My Stuff capability match
  -> mission_offer       // reuse/repair/wait options
  -> cooling             // mission + decision waiting
  -> ready               // review time reached
  -> reflecting          // outcome review
  -> idle/home
```

Escape paths:

- any visible intervention -> dismissed/snoozed;
- prompting -> Continue anyway;
- cooling -> report Buy/reclassify;
- all outcomes -> neutral idle, never sad/injured.

The companion state is presentation derived from business state. It cannot award XP or change a decision directly.

## 7. Mission simulation engine

The game changes from town management to a **light companion/mission simulation**.

### Mission types

```ts
type MissionType =
  | 'TRY_EXISTING'
  | 'CLEAN_OR_RESTYLE'
  | 'REPAIR'
  | 'BORROW_OR_SHARE'
  | 'WAIT_AND_REFLECT';
```

### Mission examples

- wear the existing shoes tomorrow;
- clean/restyle the existing pair;
- inspect or replace the insole;
- ask to borrow an occasion item;
- wait 24 hours and record whether the original need remains.

### Mission state

```text
offered -> accepted -> active -> ready_for_checkin -> completed
                  `-> cancelled
```

### Meaningful game constraint

The companion has two mission slots. The user chooses which real-world experiments to run rather than collecting unlimited quests.

- one PurchaseDecision can link to one active mission in P0;
- the same owned item cannot be assigned to conflicting active missions;
- mission readiness derives from timestamps/checklist state;
- completed Reflection grants fixed XP regardless of Buy/Skip;
- completing a real reuse/repair action unlocks a matching Home activity/prop;
- mission cancellation has no punishment;
- no hunger, health decay, death, failure streak, coin, shop, or loot box.

### Home activity mapping

| Confirmed mission/outcome | Companion Home feedback |
|---|---|
| Try existing | mouse prepares and reuses the remembered item |
| Clean/restyle | small wash/design activity |
| Repair | workbench repair loop |
| Borrow/share | mouse prepares a shared parcel/picnic exchange |
| Wait/reflect | mouse rests beside the illustrated cooler |
| Optional experience allocation | postcard or packed bag appears |
| Buy | neutral record; optional Add to My Stuff |

The game reflects the action type, not a calculated amount of waste avoided.

## 8. End-to-end loop

```text
Open online product page
  -> high-confidence detection
  -> mouse peeks from page edge
  -> Add to Cart intent
  -> Pause with Lemonade / Continue anyway
  -> identify underlying job
  -> My Stuff same-job match
  -> choose a reuse/repair/wait mission
  -> mission enters Cooling
  -> mouse returns to quiet cooling pose
  -> Ready review after real time / seeded demo record
  -> did the mission solve the job?
  -> Use existing / Repair / Buy / Extend
  -> honest Reflection XP
  -> Home activity/prop reflects confirmed action
  -> optional planned allocation as secondary outcome
```

## 9. Storage and cross-surface architecture

### With extension installed

Use extension storage as the canonical local source:

```text
shopping content script
  <-> WXT messaging/background
  <-> browser.storage.local
  <-> Lemonade-site bridge content script
  <-> web React app
```

The deployed Lemonade domain receives a narrowly scoped content script that exposes a typed request/response bridge. The website never accesses arbitrary extension APIs directly.

### Without extension

The website uses a localStorage adapter and remains fully usable with manual Capture and the seeded demo.

### Shared interface

```ts
interface LemonadeRepository {
  load(): Promise<PersistedAppState>;
  transact(command: Command): Promise<TransactionResult>;
  subscribe(listener: (state: PersistedAppState) => void): () => void;
}
```

Adapters:

- `WebLocalRepository`;
- `ExtensionBridgeRepository`;
- in-memory repository for tests.

Do not add cloud sync/auth for P0.

## 10. WXT implementation

```text
apps/extension/
  entrypoints/
    shopping.content.tsx        # detector + floating mouse
    lemonade-site.content.ts    # restricted website bridge
    background.ts               # messages/storage
    options.html                # supported sites, snooze, privacy
  src/
    detect/
      json-ld.ts
      open-graph.ts
      purchase-actions.ts
      confidence.ts
    companion/
      companion-root.tsx
      companion-machine.ts
      intervention-card.tsx
    bridge/
      messages.ts
      repository.ts
```

Use Shadow Root UI for the floating mouse so retailer styles do not alter it. Watch SPA location/DOM changes and mount idempotently.

## 11. Art scope

The pivot significantly reduces art requirements.

### Floating companion

- hidden/edge tab;
- peeking;
- curious;
- holding an owned-item card;
- cooler/waiting;
- workbench/repair;
- reflection/celebration;
- neutral Continue/Buy acknowledgment.

### Home Nook

- one complete base illustration;
- cooler activity overlay;
- workbench activity overlay;
- reuse/try-existing activity overlay;
- three bounded cosmetic rewards.

Use full finished raster poses and scene overlays from the existing art pipeline. No CSS primitive animal and no full town asset set.

## 12. Privacy and irritation controls

- parse product metadata locally;
- send/store the product only after `Pause with Lemonade`;
- never read checkout fields, card data, addresses, accounts, or full browsing history;
- automatic prompt only at high confidence;
- `Continue anyway`, `Snooze this site`, and `Hide companion` always available;
- user chooses supported sites/permission scope;
- no shame copy, sad animation, alarm, or repeated prompt in the same page session;
- no product recommendations or affiliate links.

## 13. Problem-statement correction

The pivot improves alignment:

- **everyday life:** companion appears in the actual online-shopping context;
- **mindful purchasing:** intervention occurs before cart/checkout;
- **unwanted goods:** My Stuff capability is brought into the decision;
- **upgrade/repair rather than replace:** Cooling becomes an executable mission;
- **reduce materialism:** success can be use/repair/borrow, not only saving money;
- **waste:** extending use is visible without inventing carbon/landfill metrics.

The product must still avoid claiming universal detection or proven waste reduction.

## 14. Scoring correction

### Innovation & Creativity

Stronger than a savings-town concept because the pet lives at the purchase moment and actively reconnects the user with existing objects.

### Technical Complexity & Completeness

Meaningful complexity comes from:

- product-page detection confidence;
- Shadow Root content UI;
- cross-context messaging/storage bridge;
- decision + mission state machines;
- same-job overlap;
- timers and idempotent transactions;
- web fallback without extension.

The narrower art/game scope improves completeness.

### UX & Design

The intervention is contextual and recognizable. Confidence gating, snooze, and Continue are mandatory to prevent annoyance.

### Practicality & Usability

Manual web Capture still works; extension improves timing but does not become a hard dependency. Permission/privacy limits remain explicit.

### Presentation & Pitch

The demo becomes one continuous visual story from Add to Cart to the mouse's repair mission. It is easier to understand in three minutes than a finance dashboard plus town-management explanation.

## 15. P0 vertical slice

### Must build

- deployed Next web Home Nook;
- WXT extension on one controlled storefront and generic high-confidence JSON-LD path;
- product detection for name/price/image;
- floating mouse + Pause/Continue;
- same-job My Stuff match;
- one mission type: `REPAIR` or `TRY_EXISTING`;
- one genuine new Cooling record and one seeded Ready record;
- Buy/Use existing/Repair/Extend review outcomes;
- companion mission state and one Home activity animation;
- local persistence, Reset Demo, reduced motion;
- domain/mission unit tests and web happy-path Playwright.

### Secondary

- optional planned allocation/postcard;
- second/third mission type;
- three cosmetic rewards;
- generic additional retailer support.

### Remove from P0

- town map, three buildings, multiple residents, resident scheduling;
- full financial dashboard;
- AI extraction/coach;
- universal retailer support;
- OS-level desktop overlay;
- cloud sync/auth;
- virtual currency/shop.

## 16. Demo sequence

1. Open controlled sneaker product page.
2. Mouse peeks in; product is recognised.
3. Click Add to Cart; choose `Pause with Lemonade`.
4. Mouse shows an owned pair with the same walking/travel job.
5. Choose `Try and repair the existing pair`.
6. Mission moves to the cooler/workbench with a real deadline.
7. Open a separate seeded Ready mission.
8. Confirm the repaired pair solved the need.
9. Mouse performs the repair/reuse Home activity and Reflection XP advances.
10. Close with: `Before you buy new, meet what you already have.`

## 17. Final strategic statement

> The extension creates the moment of intervention. My Stuff provides the alternative. The mission makes the alternative executable. The mouse makes the behaviour worth repeating.
