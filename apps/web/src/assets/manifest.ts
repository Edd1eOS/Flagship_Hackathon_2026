import type { LocationId } from "@lemonade/domain";

// Typed asset manifest. Art files land in Stage 13; until then every entry
// declares `src: null` and components render the labelled fallback block so
// a missing image can never break the layout.
export type WorldAssetId =
  | "world.town.base"
  | "world.home.active"
  | "world.browser-gate"
  | "world.workshop.locked"
  | "world.workshop.ready"
  | "world.workshop.active"
  | "world.picnic.ready"
  | "world.picnic.active-or-static"
  | "world.station.ready"
  | "world.station.active-or-static";

export type AssetEntry = {
  id: WorldAssetId;
  src: string | null;
  alt: string;
  preload: boolean;
  fallbackTint: string;
  sprite?: { columns: number; rows: number; column: number; row: number };
};

export const ASSET_MANIFEST: Record<WorldAssetId, AssetEntry> = {
  "world.town.base": {
    id: "world.town.base",
    src: "/art/lemonade-lane-town.png",
    alt: "",
    preload: true,
    fallbackTint: "#f6efdd",
  },
  "world.home.active": {
    id: "world.home.active",
    src: "/art/home-nook.png",
    alt: "Home Nook with the decision cooler",
    preload: true,
    fallbackTint: "#f7d84a",
  },
  "world.browser-gate": {
    id: "world.browser-gate",
    src: "/art/browser-gate.png",
    alt: "Browser Gate where the Scout returns",
    preload: true,
    fallbackTint: "#6fa8c9",
  },
  "world.workshop.locked": {
    id: "world.workshop.locked",
    src: "/art/workshop-residents-sheet.png",
    alt: "Workshop, locked",
    preload: true,
    fallbackTint: "#d8d0c0",
    sprite: { columns: 3, rows: 2, column: 0, row: 0 },
  },
  "world.workshop.ready": {
    id: "world.workshop.ready",
    src: "/art/workshop-residents-sheet.png",
    alt: "Workshop, ready for a resident",
    preload: true,
    fallbackTint: "#4f8a50",
    sprite: { columns: 3, rows: 2, column: 1, row: 0 },
  },
  "world.workshop.active": {
    id: "world.workshop.active",
    src: "/art/workshop-residents-sheet.png",
    alt: "Workshop with repair activity",
    preload: true,
    fallbackTint: "#4f8a50",
    sprite: { columns: 3, rows: 2, column: 2, row: 0 },
  },
  "world.picnic.ready": {
    id: "world.picnic.ready",
    src: "/art/picnic-green.png",
    alt: "Picnic Green, ready",
    preload: false,
    fallbackTint: "#4f8a50",
  },
  "world.picnic.active-or-static": {
    id: "world.picnic.active-or-static",
    src: "/art/picnic-green.png",
    alt: "Picnic Green with friends",
    preload: false,
    fallbackTint: "#4f8a50",
  },
  "world.station.ready": {
    id: "world.station.ready",
    src: "/art/little-station.png",
    alt: "Little Station, ready",
    preload: false,
    fallbackTint: "#6fa8c9",
  },
  "world.station.active-or-static": {
    id: "world.station.active-or-static",
    src: "/art/little-station.png",
    alt: "Little Station with a planned trip",
    preload: false,
    fallbackTint: "#6fa8c9",
  },
};

export type CharacterAssetId =
  | "scout.idle"
  | "scout.peek"
  | "scout.carry"
  | "scout.cooler"
  | "scout.acknowledge"
  | "scout.celebrate"
  | "mender.idle"
  | "mender.repair"
  | "host.activity";

export const CHARACTER_MANIFEST: Record<
  CharacterAssetId,
  { src: string; sprite: NonNullable<AssetEntry["sprite"]>; alt: string }
> = {
  "scout.idle": {
    src: "/art/scout-sheet.png",
    sprite: { columns: 3, rows: 2, column: 0, row: 0 },
    alt: "Scout mouse at home",
  },
  "scout.peek": {
    src: "/art/scout-sheet.png",
    sprite: { columns: 3, rows: 2, column: 1, row: 0 },
    alt: "Scout mouse peeking",
  },
  "scout.carry": {
    src: "/art/scout-sheet.png",
    sprite: { columns: 3, rows: 2, column: 2, row: 0 },
    alt: "Scout carrying a sneaker decision",
  },
  "scout.cooler": {
    src: "/art/scout-sheet.png",
    sprite: { columns: 3, rows: 2, column: 0, row: 1 },
    alt: "Scout checking the cooler",
  },
  "scout.acknowledge": {
    src: "/art/scout-sheet.png",
    sprite: { columns: 3, rows: 2, column: 1, row: 1 },
    alt: "Scout acknowledging a decision",
  },
  "scout.celebrate": {
    src: "/art/scout-sheet.png",
    sprite: { columns: 3, rows: 2, column: 2, row: 1 },
    alt: "Scout celebrating quietly",
  },
  "mender.idle": {
    src: "/art/workshop-residents-sheet.png",
    sprite: { columns: 3, rows: 2, column: 0, row: 1 },
    alt: "Mender ready to help",
  },
  "mender.repair": {
    src: "/art/workshop-residents-sheet.png",
    sprite: { columns: 3, rows: 2, column: 1, row: 1 },
    alt: "Mender repairing a shoe",
  },
  "host.activity": {
    src: "/art/workshop-residents-sheet.png",
    sprite: { columns: 3, rows: 2, column: 2, row: 1 },
    alt: "Host preparing a picnic",
  },
};

// Stable hotspot rectangles in percentages of the world stage. Positioned
// independently of image alpha bounds so art changes never move buttons.
export type HotspotRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export const LOCATION_HOTSPOTS: Record<
  LocationId,
  { rect: HotspotRect; label: string; blurb: string }
> = {
  picnic_green: {
    rect: { left: 4, top: 8, width: 26, height: 24 },
    label: "Picnic Green",
    blurb: "Friends and honest reflection",
  },
  little_station: {
    rect: { left: 68, top: 6, width: 27, height: 24 },
    label: "Little Station",
    blurb: "Planned experiences leave from here",
  },
  workshop: {
    rect: { left: 8, top: 40, width: 26, height: 26 },
    label: "Workshop",
    blurb: "Repair and reuse what you own",
  },
  quiet_garden: {
    rect: { left: 70, top: 40, width: 24, height: 22 },
    label: "Quiet Garden",
    blurb: "A future quiet place",
  },
  home_nook: {
    rect: { left: 30, top: 68, width: 26, height: 26 },
    label: "Home Nook",
    blurb: "The cooler and decision history",
  },
  browser_gate: {
    rect: { left: 66, top: 70, width: 26, height: 24 },
    label: "Browser Gate",
    blurb: "Where the Scout returns from patrol",
  },
};
