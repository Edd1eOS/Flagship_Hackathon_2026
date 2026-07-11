# Lemonade Simulation Game Direction

> **演进记录：** 本文的 Two Futures Simulator 是从 Packing Puzzle 转向 simulation 的中间方案。团队随后明确需要 world-management simulation，当前方案已发展为 Lemonade Lane；开发以 `10-business-and-game-logic.md` 为准。

> Date: 2026-07-11  
> Status: proposal for team discussion; not yet frozen  
> Target gamification: 7/10

## 1. Revised judgement on virtual consumption

Virtual rewards are not equivalent to real material consumption. They use no physical inventory, create no direct landfill, and may provide a lower-harm substitute for the anticipation and acquisition involved in an impulse purchase. Therefore Lemonade should not reject virtual items merely because they are collectible or attractive.

The remaining product risks are narrower:

- a feed, scarcity timer, loot box, or infinite catalogue can reproduce the same compulsive browsing loop;
- awarding currency in proportion to self-reported `money saved` is easy to farm and falsely treats a skipped item as banked money;
- making `Buy` harm the character encourages dishonest logging;
- a cosmetic economy can become more prominent than the real decision intervention;
- judges may reasonably ask whether the product solves shopping by adding another shop.

Decision: **cute virtual acquisition is allowed as a harm-reduction mechanism**, subject to these constraints:

1. no real-money purchases or purchasable currency;
2. no loot boxes, artificial scarcity, limited-time sales, or rarity pressure;
3. rewards come from completing an honest reflection/review, not from the price of a skipped item;
4. `Buy` and `Skip` can both earn reflection credit; only an explicit planned allocation advances a money goal;
5. the reward catalogue is small and bounded for the MVP;
6. cosmetics have no financial or gameplay power;
7. the decision simulator remains the main interaction, not the reward shop.

## 2. Recommended concept: Two Futures Simulator

### One-line description

> Lemonade lets users play through two possible near futures before they buy: one where the impulse enters their life, and one where they wait or redirect the budget.

### Genre

Light life simulation + branching decision game.

This is a simulation only if state changes over time. A room that automatically gains decoration is progression feedback, not a simulation. The proposed engine has:

- state variables;
- player decisions;
- a time horizon;
- deterministic consequences;
- two comparable branches;
- persistent history after the decision.

### Simulated state

- discretionary budget remaining;
- physical space or clutter slots;
- goal readiness milestones;
- owned-item overlap;
- scheduled experience moments;
- optional character states such as `connection`, `growth`, `security`, and `joy`.

Character-state effects must be presented as an illustrative model based on user inputs, not a scientific prediction of happiness.

## 3. Core encounter

Example: the user logs `$180 sneakers` while already owning three similar pairs and saving for Japan.

1. Lemonade creates a `Buy` future and a `Wait/Redirect` future.
2. Both start from the same room, character, budget, owned items, and goal state.
3. The player scrubs or plays from Day 0 to Day 30.
4. In the `Buy` branch, the sneakers appear in the room, budget capacity falls, and a concrete Japan preparation milestone is displaced or delayed.
5. In the `Wait` branch, nothing financial changes automatically.
6. If the player chooses `Redirect`, they place a planned allocation into a real goal; the other branch then shows the corresponding hostel, rail pass, or event milestone becoming ready.
7. The player chooses `Buy`, `Keep cooling`, or `Skip`, with no punishment animation.

The simulator does not claim to know the correct choice. It makes the trade-off visible and lets the user decide.

### Minimum condition for 7/10 gamification

One `Buy/Skip` click followed by a predetermined animation is an interactive comparison, not a 7/10 simulation game. The demo therefore needs a short three-turn scenario in each branch:

1. **Day 0 - impulse:** buy, cool, or redirect the sneakers;
2. **Day 10 - interruption:** respond to a seeded event such as a friend activity or an essential replacement;
3. **Day 24 - goal checkpoint:** decide which remaining budget/space is committed to the experience goal.

The first decision must change the later legal or affordable choices. For example, buying the sneakers does not punish the character, but it may mean the player cannot select both the friend activity and the hostel milestone without changing another plan. This creates a real stateful consequence rather than a moralised ending.

The scenario does not need a win/lose score. Its playable challenge is to build the future that best matches the user's stated priorities under finite budget, space, and time.

## 4. Character space

The character space becomes the stage on which consequences appear:

- owned products occupy visible, finite storage positions;
- duplicates appear beside comparable existing items;
- goal preparation appears as meaningful props such as a packed bag, rail pass, calendar event, or debt/safety milestone;
- the character performs short activities rather than merely standing beside a progress bar;
- previous decisions leave small memory entries that can be revisited.

This preserves the teammate PRD's attractive `cozy nook` idea while giving the space a functional role.

## 5. Cute reward layer

Reflection XP may unlock one of several cosmetic choices at milestones:

- character expression or idle action;
- room colour accent;
- sticker or postcard from an experience goal;
- plant, lamp, cushion, or desk prop;
- short character interaction.

For the hackathon demo, use a choice of three rewards rather than a shop. This creates anticipation and ownership without requiring a currency balance, pricing economy, inventory system, or large asset catalogue.

Future research may compare a bounded reward choice with a non-purchasable cosmetic catalogue. A full virtual marketplace is not part of the 24-hour build.

## 6. Demo climax

The strongest 20-second sequence is:

1. upload `$180 sneakers`;
2. My Stuff finds three similar pairs;
3. the screen splits into two animated versions of the same illustrated room;
4. drag or scrub the timeline to Day 30;
5. the left branch adds another shoe box and displaces `one hostel night`;
6. the right branch keeps the money unallocated until the user deliberately places it into the Japan goal;
7. the scene transforms into packing for the trip;
8. a reflection milestone offers one of three cute cosmetic rewards.

This is visually stronger than a conventional chart or progress bar because the consequence is staged as a playable before/after world.

## 7. Technical shape for the MVP

Implement one deterministic, data-driven simulation rather than a general life simulator.

```ts
type SimState = {
  day: number;
  discretionaryRemaining: number;
  spaceUsed: number;
  ownedItemIds: string[];
  plannedGoalAmount: number;
  unlockedMilestones: string[];
  scheduledMoments: SimMoment[];
};

type SimEvent =
  | { type: 'BUY_ITEM'; itemId: string; amount: number }
  | { type: 'WAIT' }
  | { type: 'PLAN_ALLOCATION'; goalId: string; amount: number }
  | { type: 'ADVANCE_DAY'; days: number };
```

Required engine functions:

- clone a common initial state into two branches;
- apply typed events with pure reducers;
- derive displaced milestones and overlaps;
- generate a Day 0/7/14/30 event timeline;
- reset to the seeded demo state;
- test budget conservation and the rule that `Skip` alone does not allocate money.

Use React, Zustand persistence, CSS layers, and Motion. Do not add Phaser, Three.js, a physics engine, or a backend for this prototype.

## 8. Scope boundary

### P0

- one character room;
- one seeded goal;
- one generic impulse capture flow plus the seeded sneaker scenario;
- two future branches;
- four timeline checkpoints;
- one three-turn seeded scenario whose first choice changes later options;
- three visible state variables;
- one milestone transformation;
- one three-choice cosmetic reward.

### Cut first

- free placement of furniture;
- currency and prices for cosmetics;
- multiple rooms;
- avatar creator;
- minigame arcade;
- real rewards;
- procedural event generation;
- multiplayer or friends;
- claims that the simulation predicts real happiness.

## 9. Comparison with Budget Packing Puzzle

| Dimension | Packing Puzzle | Two Futures Simulator |
|---|---:|---:|
| Immediate rules clarity | stronger | medium |
| Visual/pitch impact | strong | **very strong** |
| Fits teammate request for simulation | weak | **strong** |
| Behavioural explanation | strong | **very strong** |
| 24-hour implementation risk | medium | higher |
| Asset demand | medium | high |
| Risk of becoming a progress bar | low | low if time/state are real |

Recommendation: if the team explicitly wants a simulation, replace the Packing Puzzle as the demo's core game instead of building both. Reuse the existing allocation and overlap engines underneath. A reduced packing interaction may survive only as the way a displaced goal is selected; it should not become a second full game.

## 10. Open team question

Clarify what the teammate means by `simulation`:

- life/room simulation;
- budget-management simulation;
- business/tycoon simulation;
- character/pet simulation;
- future-consequence simulation.

The recommendation above assumes **future-consequence life simulation**, because it best supports the product thesis and the three-minute pitch.
