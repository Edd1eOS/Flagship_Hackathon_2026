# Lemonade Town Dashboard UI/UX

> Date: 2026-07-11  
> Status: current game layout and interaction specification  
> Product structure: Lemonade Lane remains the dashboard/game terminal; the browser companion is an additional patrol surface

## 1. Product-space model

Lemonade has two continuous surfaces:

```text
Shopping page
  -> Scout mouse patrols in a floating WXT window
  -> product detected / Pause selected
  -> Scout carries the decision back
  -> deployed website opens Lemonade Lane
  -> Scout jumps through the Browser Gate into town
  -> decision enters Cooling / mission selection
  -> town residents execute the selected projects
```

The mouse in the extension and the Scout in town are the same character and state identity.

### Character roles

- **Scout:** main pocket mouse; patrols shopping pages, carries captured product cards, returns to Home. It is never consumed as a town action slot.
- **Mender:** assignable resident specialised visually around Workshop/reuse activities.
- **Host:** assignable resident specialised visually around Picnic/Station/community activities.

P0 has two assignable residents plus Scout. Shopping protection never competes with town assignment.

## 2. Information priority

The first screen must communicate, in this order:

1. this is Lemonade and the user's living pocket town;
2. whether a purchase decision needs attention now;
3. what the user already owns / can try or repair;
4. what the town can do with confirmed real-world actions;
5. optional goal/planned progress;
6. secondary history/settings.

The Japan goal is visible but does not dominate the first viewport. `Ready decision` and active reuse/repair mission receive higher priority.

## 3. Desktop layout

Reference viewport: `1440 x 900`.

```text
┌──────────────────────────────── Top Bar 64 ────────────────────────────────┐
│ Lemonade        Current intention / goal       Patrol • sound • settings │
├──────┬──────────────────────────────────────────────┬─────────────────────┤
│ Nav  │                                              │                     │
│ Rail │              Lemonade Lane                   │    Command Deck     │
│ 64px │              World Stage                     │      336px          │
│      │                                              │                     │
│      │                                              │                     │
│      ├──────────────── Decision Dock 112 ───────────┤                     │
│      │ Ready • Cooling • Active Missions            │                     │
└──────┴──────────────────────────────────────────────┴─────────────────────┘
```

### Dimensions

- Top Bar: 64px fixed height;
- Nav Rail: 64px fixed width;
- Command Deck: 336px, can expand to 400px for Review/Capture;
- Decision Dock: 112px stable height;
- World area uses the remaining space with a fixed internal aspect ratio;
- minimum supported desktop width: approximately 1024px, at which Command Deck becomes an overlay sheet.

The world stage is unframed and full within its area. It is not placed inside a decorative card.

## 4. Top Bar

### Left

- Lemonade wordmark;
- small `Mindful Spending` descriptor only when width permits.

### Centre

One compact current-intention line:

```text
Make my travel kit last
```

Optional secondary planned-goal amount appears beneath or on hover/detail, not as a giant progress bar.

### Right

- Patrol status: `On / Snoozed / Extension not connected`;
- sound toggle icon;
- reduced-motion follows system, manual override in settings;
- settings icon;
- compact profile/demo indicator.

Patrol uses a shield/radar icon plus text status. Do not present it as a promotional pill.

## 5. Navigation Rail

Icon buttons with tooltips and visible selected state:

- Town/Home;
- Decisions;
- My Stuff;
- Goal/Plans;
- Extension/Patrol status near the bottom.

Use Lucide icons for controls. The custom mouse illustration is not used as a replacement for common navigation icons.

Desktop rail is icon-first; mobile uses a bottom navigation bar with short labels.

## 6. World layout

The town is a one-screen paper-diorama neighbourhood.

```text
┌──────────────────────────────────────────────────────────┐
│ Picnic Green                         Little Station      │
│ friends / reflection                 experience goal     │
│                                                          │
│          Workshop        Crossroads        Quiet Garden  │
│          repair/reuse                       wait/security  │
│                                                          │
│                     Home Nook         Browser Gate        │
│                     cooler/history    Scout return point  │
└──────────────────────────────────────────────────────────┘
```

### Placement rationale

- Home Nook is foreground/centre because every flow returns there.
- Browser Gate is foreground/right so the Scout can enter from the browser/window edge without crossing UI panels.
- Workshop sits left-centre and remains visible during the repair demo climax.
- Picnic and Station are farther back, creating depth without a scrollable map.
- Quiet Garden is a future/secondary location and can remain a light locked silhouette in P0.
- Crossroads remains visually open for project markers and resident movement.

### Location states

```text
locked -> available -> assigned -> active -> lived_in
```

Each location uses complete illustrated state replacements. Hotspots are stable invisible/outlined buttons positioned independently of image alpha bounds.

## 7. Browser Gate and Scout return

### Return trigger

The extension/web bridge opens the website with a captured decision ID or import token. After state hydration:

1. Browser Gate outline pulses once;
2. Scout appears at the right edge in `carry-side` pose;
3. Scout follows two short jump arcs into town;
4. product card remains visibly carried;
5. Scout lands beside Home cooler;
6. product card snaps into the Capture/Cooling interaction;
7. Command Deck opens the relevant next action.

Duration: approximately 800-1100 ms. The user may interact immediately after landing; do not add a long cutscene.

Reduced motion: Scout and product crossfade at Browser Gate and Home with no path movement.

### Normal entry

When the website opens without an extension handoff, Scout is already in town performing a restrained idle/patrol loop.

### State truth

The handoff transaction persists before the return animation. Animation failure cannot lose or duplicate the captured product.

## 8. Command Deck

The right panel is one contextual command surface, not a stack of cards.

### Default: Today

Sections separated by rules/whitespace:

1. **Ready now** - highest priority decision row and Review button;
2. **Active mission** - repair/try-existing status and next check-in;
3. **Town plan** - two resident assignments and confirm/edit action;
4. **Patrol** - current extension connection/status;
5. primary `I'm tempted` command fixed at the bottom.

### Location context

Clicking Workshop/Picnic/Station changes the panel title and actions:

- current location state;
- why the project is available;
- required/linked real-world action;
- resident assignment controls;
- activity preview;
- confirm/cancel.

The world remains visible. Do not navigate to a separate full page for routine town management.

### Decision context

Review/Capture expands the deck to approximately 400px or opens a modal sheet on narrower screens. Evidence is progressive:

1. original job/motive;
2. best same-job My Stuff match;
3. repair/reuse mission;
4. goal/frequency secondary evidence;
5. outcome controls.

Do not show four warning cards at once.

## 9. Decision Dock

The 112px bottom band keeps decision state visible without covering the town.

Three stable zones:

### Ready

- count;
- highest-priority item thumbnail;
- concise `Review now` action.

### Cooling

- illustrated cooler icon;
- up to two item thumbnails;
- nearest review time;
- overflow count rather than horizontal scrolling.

### Active Missions

- two fixed mission slots;
- mission type icon/illustration;
- linked existing item;
- status/check-in time.

Clicking a zone updates the Command Deck. The dock does not expand vertically and cannot resize the world stage.

## 10. Town-management interaction

### Availability

Confirmed business events make projects available:

- Reflection -> Picnic;
- Reuse/repair commitment -> Workshop;
- Planned experience allocation -> Station;
- Wait/security reflection -> Quiet Garden in future.

### Resident assignment

The Command Deck shows Mender and Host as fixed resident selectors.

Desktop:

- click resident;
- eligible town hotspots highlight;
- click location;
- resident preview appears there;
- reselect/cancel before confirmation.

Mobile:

- tap resident row;
- tap eligible location on world;
- bottom sheet shows preview and confirm.

Drag-and-drop may be added as polish but is never required.

### Scout rule

Scout is not assignable. It automatically moves between Browser Gate, Home, cooler, and the current decision/mission context. This preserves the companion continuity without interfering with the two-resident management constraint.

## 11. Primary screen states

### A. Idle town

- Scout at Home/patrol route;
- residents in lived-in activity loops;
- Decision Dock visible;
- Today panel shows next useful action.

### B. Product returning

- Browser Gate active;
- Scout carries product into Home;
- Capture/mission panel opens after landing;
- other world motion becomes quieter but does not blur.

### C. Cooling

- product appears in Home cooler and Decision Dock;
- Scout has a short cooler-check idle;
- no XP or town upgrade.

### D. Ready review

- cooler receives a small ready marker;
- Scout stands nearby with neutral attention pose;
- Command Deck prioritises Review;
- no alarm or sad expression.

### E. Town planning

- eligible locations use outlined highlights;
- resident selectors become active;
- Dock remains stable;
- confirm is disabled until assignment set is valid.

### F. Project activation

- selected location swaps from ready to active;
- resident travels and enters complete activity pose;
- unselected project remains warm/available;
- Scout acknowledges but does not celebrate Skip as money saved.

## 12. Mobile layout

Reference viewport: `390 x 844`.

```text
┌──────────── Top Bar 56 ────────────┐
│ Lemonade             Patrol status │
├────────────────────────────────────┤
│                                    │
│        World Stage 40-46vh         │
│                                    │
├──────────── Sheet Handle ──────────┤
│ Context / Today bottom sheet       │
│ Ready, mission, decision actions   │
│                                    │
├────────── Bottom Nav 64 ───────────┤
│ Town  Decisions  My Stuff  Goal    │
└────────────────────────────────────┘
```

Rules:

- world remains visible during every routine action;
- Decision Dock collapses into three status buttons above the sheet handle;
- bottom sheet has `collapsed / half / full` snap states;
- no desktop 336px rail squeezed onto mobile;
- all assignment works by tap;
- the return jump enters from top/right within the world stage;
- text and controls never cover Home, Scout, or selected location;
- mobile world uses the same composition with slightly cropped decorative margins, not rearranged landmarks.

## 13. Visual hierarchy and style

- white application canvas;
- cream/paper tones limited mainly to the illustrated world;
- lemon yellow for focus/brand;
- leaf green for reuse/available;
- coral for Ready attention, not errors;
- sky blue for Cooling/reflective states;
- dark ink for outlines and text;
- handwritten display font only for Lemonade, town/location labels, and milestones;
- clean sans for Command Deck, money, timers, and forms;
- 6-8px UI radii;
- no gradients, glassmorphism, purple glow, bokeh, floating card sections, or nested cards.

## 14. Effects

### Scout return

- two restrained jump arcs;
- product card remains anchored to carry pose;
- small paper dust at landing;
- one squash/settle;
- product snaps to cooler or panel.

### Product detection

- Scout peeks 12-20px from page edge;
- subtle ear/tail motion;
- no screen dim until user interacts;
- Add to Cart prompt uses one short paper-pop transition.

### Cooling

- cooler lid closes once;
- timer appears in standard UI, not inside unreadable art;
- no frost overlay covering the product.

### Location ready/active

- ready outline appears;
- paper state folds/crossfades upward;
- props stagger 60-100 ms;
- resident enters after location settles;
- total approximately one second.

### Feedback boundaries

- Buy: neutral acknowledgement;
- Skip alone: archive transition only;
- confirmed repair/reuse: Workshop activity;
- planned allocation: labelled token/Station activity;
- no coin shower or full-screen confetti.

## 15. Accessibility and reliability

- every hotspot is a real button with an accessible name;
- location state is repeated in Command Deck text;
- focus ring visible over illustrated backgrounds;
- tap targets at least approximately 44px;
- no drag-only interaction;
- reduced-motion alternative for every effect;
- Scout animation is decorative after state commit;
- return/Capture can be recovered from Decisions if animation or bridge fails;
- product image failure uses a styled placeholder without moving layout.

## 16. P0 art and UI scope

### World

- one complete town base;
- Home active;
- Workshop locked/ready/active;
- Picnic ready/active or static secondary state;
- Station ready/active or static secondary state;
- Browser Gate;
- one Quiet Garden silhouette optional.

### Characters

- Scout: idle, peek, carry, cooler, acknowledge, celebrate/reflect;
- Mender: idle + repair;
- Host: idle + one Picnic/Station activity.

### Product/UI

- one sneakers cutout;
- one existing-shoes cutout;
- one cooler;
- two mission-slot visuals;
- one planned token;
- paper dust/spark effect set.

### Cut first

- Quiet Garden active art;
- third resident;
- free town camera/pan;
- multiple building levels;
- cosmetic shop/inventory;
- day/night/weather;
- additional patrol animations;
- non-demo project variants.

Do not cut Browser Gate, Scout return, Home cooler, Workshop activation, the two resident slots, or the Command Deck.

## 17. Demo UI sequence

1. Start on a controlled sneaker product page.
2. Scout peeks from the edge.
3. Click Add to Cart; choose Pause.
4. Website opens with Lemonade Lane already hydrated.
5. Scout jumps through Browser Gate carrying sneakers.
6. Command Deck shows the underlying job and existing-shoes match.
7. Choose a repair/try-existing mission; product enters Cooling.
8. Open a separate seeded Ready item from Decision Dock.
9. Confirm existing item solved the job and create repair/reuse commitment.
10. Workshop becomes available.
11. Assign Mender to Workshop and Host to one other available project.
12. Confirm plan; Workshop activates and repair animation plays.
13. End on the lived-in town with Scout returning to patrol status.

## 18. Core UX statement

> The Scout catches the impulse where it happens. The dashboard brings the decision home. The town turns confirmed reuse, repair, reflection, and planning into a persistent life the user wants to return to.
