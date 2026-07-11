# Lemonade Pocket World and Art Direction

> Date: 2026-07-11  
> Status: town and Pocket Mouse art direction remain current; combined town/Scout layout and P0 asset scope are defined in `13-town-dashboard-uiux.md`  
> Reference: `docs/style.png`

## 1. World scale

Do not build a city. Use a **pocket neighbourhood**: one character's home and a few nearby places where meaningful moments happen.

Working world names:

- `Lemonade Lane` - recommended; small, social, and directly connected to the brand;
- `Little Lemon Town` - cuter but more childish;
- `The Lemonade Nook` - warm but sounds like a single room;
- `Lemonade Grove` - soft and organic but weaker for varied activities.

Recommended structure:

- **Home Nook** - character home and personalisation hub;
- **Picnic Green** - friends, meals, concerts, and community moments;
- **Little Station** - travel and exploration goals;
- **Workshop Corner** - learning, repair, making, and skill goals;
- **Quiet Garden** - savings, security, and debt milestones represented calmly.

The hackathon build should show Home plus three surrounding places. The world is a single screen, not a scrollable city map.

## 2. Design thesis

Buildings are not the reward. **Visible life inside the places is the reward.**

Every location must show at least one activity:

- a character packing beside the station;
- friends laying out a picnic;
- someone repairing an existing object at the workshop;
- a character reading or learning at a desk;
- plants and lights changing around a security milestone.

This keeps the project about experiences, relationships, repair, and stability instead of property accumulation.

## 3. Visual language

Use a **hand-drawn paper-diorama / sticker world** viewed at a soft three-quarter angle.

- thick, slightly imperfect dark ink outlines;
- simple flat colour fills with very limited soft shading;
- off-white main canvas with cream used only for local paper shapes;
- lemon yellow as the brand accent;
- leaf green, coral, sky blue, and dark ink to avoid a one-note palette;
- rounded, asymmetrical silhouettes instead of rectangular office-like buildings;
- oversized friendly props such as a teapot, picnic rug, backpack, bicycle, plant, and station sign;
- no gradients, glassmorphism, purple glow, bokeh, or realistic city textures;
- avoid emoji as production assets.

The result should feel like an editorial children's-book diorama made for young adults, not a preschool game.

## 3.1 Character direction: Pocket Mice

Do not model human characters or build a 3D character system. Use a small community of stylised **pocket mice** made from layered 2D sticker sprites.

Why mice are the recommended choice:

- the round ears, droplet-shaped body, thin tail, and tiny limbs form a stable silhouette;
- one shared body template can support all residents;
- their scale naturally explains a pocket-sized neighbourhood;
- rooms and places can be built from repaired or reused household objects;
- props can hide most limb articulation, reducing animation work;
- different scarves, satchels, patches, and colours distinguish residents without a character creator.

The reuse theme can appear directly in the world:

- bottle-cap tables;
- a repaired teacup shelter;
- a matchbox bed or storage chest;
- fabric-offcut picnic rugs;
- paper-ticket station signs;
- jars and tins reused as planters;
- visible stitched patches and repair marks.

This must remain visually curated rather than looking dirty or post-apocalyptic. Reuse is shown as inventive, cared-for, and desirable.

### Character asset rules

- one base body and fixed head/body proportions;
- front three-quarter and side views only;
- main resident plus two palette/accessory variants;
- three main poses: idle, carrying/packing, and working/celebrating;
- separate eye layer for blinking;
- optional separate forearm/prop layer for short actions;
- no lip sync, skeletal rig, walk cycle, or free avatar creator in P0;
- use translation, rotation, squash, and crossfade to imply movement.

Alternative if the team wants the absolute simplest silhouette: small duck residents. Ducks are easier to draw but connect less strongly to reuse and the miniature household-object world. Cats, rabbits, and capybaras are familiar but require more pose and limb consistency, so they are not recommended for the 24-hour build.

### Pitch copy: why mice

> We chose pocket mice because they see possibility in what humans overlook. In Lemonade Lane, a bottle cap becomes a table, a fabric scrap becomes a picnic rug, and an old teacup becomes a station. They embody Lemonade's core idea: before buying something new, recognise the value and possibility already around you.

Chinese working copy:

> 小鼠把人类忽略和丢弃的东西变成生活：瓶盖成为桌子，碎布成为野餐毯，旧茶杯成为车站。这正是 Lemonade 的理念——在购买新的东西以前，重新看见身边已有事物的价值与可能性。

## 3.2 Production-grade character pipeline

The final character must not be assembled from visible CSS circles or primitive geometry. Use a hybrid of finished raster illustrations, hidden cutout rigging, and a small number of full-pose replacements.

### Stage 1 - master model sheet

Create one high-resolution master sheet before producing animation assets. It must contain:

- front three-quarter, side, and back three-quarter views;
- exact head-to-body ratio and silhouette;
- five facial expressions;
- colour swatches with hex references;
- the lemon scarf, green satchel, and one repair patch;
- line-weight and paper-texture samples;
- size comparison beside Home props;
- one carrying pose and one working pose.

The sheet is the identity reference for every later image-generation edit. Do not regenerate a character from a text prompt alone after this point.

### Stage 2 - final pose library

Produce complete, fully illustrated poses rather than reconstructing anatomy in code:

- `idle-front`;
- `idle-side`;
- `carry-side`;
- `work-front`;
- `pack-front`;
- `celebrate-front`;
- `sit-front`.

Each pose must preserve the master silhouette, costume, palette, outline, camera angle, and light direction. Supporting residents only need idle, carry, and activity poses.

### Stage 3 - hidden animation layers

Only separate parts that materially improve motion:

- open and closed eye layers;
- foreground arm/prop layer;
- tail layer with a hidden root pivot;
- optional ear layer;
- ground/contact shadow;
- full-body finished pose underneath.

The user always sees a finished illustration. The layers are an implementation detail, not visible geometric construction.

### Stage 4 - hybrid animation

- **Idle:** finished idle pose plus subtle body translation, blink swap, and tail rotation;
- **Travel:** finished side pose follows a path with two restrained hop arcs and a dust/paper puff; no full walk cycle;
- **Carry:** crossfade/snap to the completed carry pose, with the prop already composed correctly;
- **Repair/pack:** alternate between two complete key poses while the foreground tool or suitcase moves;
- **Celebrate:** switch to the finished celebration pose, use one squash-and-settle motion, then return to idle;
- **Expression:** replace the face/eye overlay without redrawing the body.

This avoids both a stiff paper puppet and the cost of a 12-frame hand-drawn walk cycle.

### Stage 5 - raster production and cleanup

Use the approved `style.png` and master model sheet as references for every generated asset. Generate simple opaque illustrations on a flat removable chroma-key background, then remove the key locally and inspect the alpha edges.

Because Lemonade uses green, choose a flat magenta key rather than green for most character assets. Avoid realistic fur, loose hair, translucent fabric, glow, and soft cast shadows; these make clean extraction unreliable and conflict with the sticker style.

Manually validate and, where necessary, correct:

- ear and tail count;
- scarf and satchel side;
- eye spacing;
- outline thickness;
- limb continuity;
- accessory colour;
- transparent-edge fringe;
- scale consistency between poses.

Reject inconsistent generations rather than trying to hide them with animation.

## 3.3 Scene-state production

Do not construct a location from dozens of independently generated props at runtime. Draw each micro-scene as a coherent finished illustration with three controlled state replacements:

- `locked` - paper marker and a few recognisable props;
- `ready` - outlined plan with resident anticipation;
- `active` - completed place with one visible activity.

The entire place illustration crossfades/builds between states. Only residents, one foreground prop, effects, and interaction markers remain separate. This preserves composition, perspective, lighting, and line consistency.

For the demo, the production set is:

| Asset group | Final illustrations |
|---|---:|
| Main resident | 7 poses + face layers |
| Two supporting residents | 3 poses each |
| Home Nook | 2 states |
| Three locations | 3 states each |
| Decision item | 2-3 cutouts |
| Cosmetic rewards | 3 cutouts |
| Effect sprites | 4-6 |

This is approximately 30-35 finished raster outputs, but only the hero character and one demo location require the highest pose coverage. If time contracts, reduce supporting poses and inactive locations before reducing the hero sequence.

## 4. Making places feel cute rather than architectural

Use inhabited micro-scenes instead of standalone buildings:

- Home is a cutaway room with a character and recognisable belongings;
- Station is a tiny platform, bench, clock, luggage, and one carriage edge;
- Picnic Green is a rug, tree, food basket, portable speaker, and two friends;
- Workshop is an open awning with tools, repaired objects, and a workbench;
- Quiet Garden uses a small greenhouse, stepping stones, water bowl, and sheltered seat.

Each scene should fit inside a clear sticker silhouette so it reads at dashboard scale. Human activity, props, and expression carry more visual weight than walls and roofs.

## 5. Asset production plan

### Phase A - art bible

Create one reference board containing:

- colour palette;
- line weight;
- camera angle;
- one complete character;
- Home Nook;
- one outdoor place;
- five common props;
- a daytime lighting reference.

Do not generate final assets until this sheet is accepted. It is the consistency anchor for later image generation.

### Phase B - world layers

Generate or draw the following raster layers at 2x display resolution:

1. transparent base ground/paper island;
2. Home Nook;
3. Picnic Green;
4. Little Station;
5. Workshop or Quiet Garden;
6. locked/unbuilt placeholders for each place;
7. three characters with two to three poses each;
8. a small prop sheet;
9. foreground foliage and paper-shadow overlays.

Prefer transparent PNG/WebP cutouts. Keep each location separate so the application can animate and replace it without regenerating the whole world.

### Phase C - interface assets

- cooling item tray;
- decision/event cards;
- reflection reward choices;
- goal tokens and location markers;
- three milestone badges.

Standard controls continue to use Lucide icons; generated illustrations are reserved for the game world and rewards.

## 6. Animation and effects

### World construction

- paper placeholder folds upward;
- two or three dust-puff stickers appear;
- place overshoots to `1.04` scale and settles to `1`;
- props pop in with 60-100 ms staggering;
- characters enter after the place settles.

Duration target: 700-1100 ms. It should feel tactile, not like a long cutscene.

### Planned allocation

- a lemon-shaped planning token follows a curved path from the decision panel to the selected location;
- the destination outline pulses once;
- a label explicitly says `planned`, avoiding a claim that money moved;
- the location then changes state.

### Character life

- idle breathing/bobbing at very low amplitude;
- occasional blink or two-frame expression change;
- short loops such as packing, watering, repairing, or setting a picnic;
- no continuous movement everywhere, which would make the dashboard noisy.

### Decision outcomes

- `Buy`: item enters My Stuff/Home storage neutrally; no damage, wilt, or sad character;
- `Keep cooling`: item returns to a small illustrated cooler tray and the timer updates;
- `Skip`: item fades into the decision archive; no fake money animation;
- `Allocate`: the separate planning-token effect advances the selected place.

### Reflection reward

- three large sticker choices fan onto the screen;
- selected reward lifts, squashes slightly, and snaps into Home;
- use a small sparkle cluster, not full-screen confetti;
- reward remains cosmetic and does not change budget outcomes.

### Interaction feedback

- hover: 2-3 px lift plus outline emphasis;
- press: brief `0.97` scale;
- valid target: warm outline and subtle paper shadow;
- invalid action: short horizontal nudge plus explanatory text;
- selected location: stable ring/outline that does not change layout size.

Support `prefers-reduced-motion`; reduced mode uses crossfades and immediate state changes.

## 7. Technical implementation

Use a fixed-aspect-ratio DOM stage instead of a canvas game engine:

- one responsive world container;
- absolutely positioned image layers using percentage coordinates;
- stable `aspect-ratio` and max dimensions;
- Motion for layout, path, scale, opacity, and stagger effects;
- Zustand/pure reducers for simulated state;
- WebP for opaque assets and PNG/WebP alpha for cutouts;
- preload all demo-critical images;
- CSS shadows only where needed to separate paper layers.

This preserves normal DOM accessibility and is faster to debug with Playwright than Phaser, Pixi, or Three.js.

## 8. Minimum asset budget

For a reliable hackathon vertical slice:

- 1 ground layer;
- 1 Home Nook;
- 3 location scenes with `locked` and `active` variants;
- 1 main character with 3 poses;
- 2 supporting characters;
- 8-12 props;
- 3 cosmetic rewards;
- 4 effect sprites.

Approximately 25-30 small assets is the upper bound. Consistency matters more than quantity.

## 9. Scope safeguards

Do not add:

- a large pannable city;
- roads, traffic, zoning, taxes, utilities, or population simulation;
- dozens of building levels;
- free-form furniture placement;
- an infinite cosmetic catalogue;
- character combat or arcade minigames;
- time-based deterioration that punishes absence;
- a visual effect that treats `Skip` itself as money transferred.

The simulation depth comes from meaningful world choices and visible resident activity, not from geographical scale.
