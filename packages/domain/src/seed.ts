import type { Clock } from "./clock";
import { toIsoTimestamp } from "./clock";
import type { IdGenerator } from "./ids";
import type { AppState } from "./schemas/app-state";
import { appStateSchema } from "./schemas/app-state";
import type { OwnedItem } from "./schemas/owned-item";
import { CURRENT_SCHEMA_VERSION } from "./schemas/primitives";

const HOUR_MS = 3_600_000;

function hoursBefore(now: Date, hours: number): string {
  return toIsoTimestamp(new Date(now.getTime() - hours * HOUR_MS));
}

type SeedOwnedItemInput = Omit<OwnedItem, "id">;

// 8-12 items; the first three are the same-job shoe candidates for the
// seeded sneakers decision ("daily walking").
const SEED_OWNED_ITEMS: readonly SeedOwnedItemInput[] = [
  {
    name: "White canvas sneakers",
    category: "footwear",
    colour: "white",
    useTags: ["daily walking", "casual"],
    condition: "worn",
    imageRef: "product.sneakers.owned",
  },
  {
    name: "Trail running shoes",
    category: "footwear",
    colour: "grey",
    useTags: ["running", "daily walking", "travel"],
    condition: "good",
  },
  {
    name: "Leather ankle boots",
    category: "footwear",
    colour: "brown",
    useTags: ["daily walking", "smart casual"],
    condition: "repairable",
    repairNote: "Sole edge lifting at the toe; needs re-glue.",
  },
  {
    name: "Denim jacket",
    category: "clothing",
    colour: "blue",
    useTags: ["casual", "layering"],
    condition: "good",
  },
  {
    name: "Insulated water bottle",
    category: "kitchen",
    useTags: ["hydration", "travel"],
    condition: "good",
  },
  {
    name: "Canvas backpack",
    category: "bags",
    colour: "olive",
    useTags: ["commute", "travel"],
    condition: "worn",
  },
  {
    name: "Over-ear headphones",
    category: "electronics",
    useTags: ["music", "focus"],
    condition: "good",
  },
  {
    name: "Yoga mat",
    category: "fitness",
    useTags: ["exercise", "home workout"],
    condition: "good",
  },
  {
    name: "Compact umbrella",
    category: "accessories",
    useTags: ["rain", "commute"],
    condition: "good",
  },
  {
    name: "Ceramic travel mug",
    category: "kitchen",
    useTags: ["coffee", "commute"],
    condition: "good",
  },
];

export function createSeedState(clock: Clock, ids: IdGenerator): AppState {
  const now = clock.now();
  const ownedItems = SEED_OWNED_ITEMS.map((item) => ({
    id: ids.nextId("item"),
    ...item,
  }));
  const shoeCandidateIds = ownedItems.slice(0, 3).map((item) => item.id);

  const seed: AppState = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    profile: {
      id: ids.nextId("user"),
      displayName: "Alex",
      currency: "AUD",
      monthlyDiscretionaryPlan: 600,
      coachingTone: "gentle",
    },
    goals: [
      {
        id: ids.nextId("goal"),
        type: "experience",
        name: "Japan trip fund",
        targetAmount: 1800,
        startingAmount: 350,
        plannedAllocationTotal: 0,
      },
    ],
    ownedItems,
    decisions: [
      // Clearly seeded demo decision: captured 26h ago, review window already
      // passed, so it opens Ready without faking a fresh Cooling timer.
      {
        id: ids.nextId("dec"),
        name: "Retro court sneakers",
        imageRef: "product.sneakers.candidate",
        merchant: "Demo Sneaker Store",
        price: 129.99,
        currency: "AUD",
        category: "footwear",
        job: "daily walking",
        motive: "trend",
        status: "ready",
        origin: "seeded_demo",
        createdAt: hoursBefore(now, 26),
        reviewAt: hoursBefore(now, 2),
        overlapItemIds: shoeCandidateIds,
      },
    ],
    missions: [],
    reuseCommitments: [],
    plannedAllocations: [],
    reflections: [],
    captureTemplates: [
      {
        id: ids.nextId("tpl"),
        name: "Cloudstep runner sneakers",
        price: 149.95,
        currency: "AUD",
        category: "footwear",
        job: "daily walking",
        motive: "trend",
        merchant: "Controlled Demo Store",
        imageRef: "product.sneakers.candidate",
      },
    ],
    town: {
      locations: [
        { id: "home_nook", state: "lived_in" },
        { id: "browser_gate", state: "available" },
        { id: "workshop", state: "locked" },
        { id: "picnic_green", state: "locked" },
        { id: "little_station", state: "locked" },
        { id: "quiet_garden", state: "locked" },
      ],
      residents: [
        {
          id: ids.nextId("res"),
          role: "scout",
          assignable: false,
          locationId: "home_nook",
          projectId: null,
          activityId: null,
        },
        {
          id: ids.nextId("res"),
          role: "mender",
          assignable: true,
          locationId: "home_nook",
          projectId: null,
          activityId: null,
        },
        {
          id: ids.nextId("res"),
          role: "host",
          assignable: true,
          locationId: "home_nook",
          projectId: null,
          activityId: null,
        },
      ],
      scoutMode: "patrol",
    },
    events: [],
    processedEventIds: [],
  };

  return appStateSchema.parse(seed);
}

export function parseSeedData(raw: unknown): AppState {
  return appStateSchema.parse(raw);
}
