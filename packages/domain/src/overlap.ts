import type { OwnedItem } from "./schemas/owned-item";

export type MatchCandidate = {
  name: string;
  category: string;
  job: string;
};

export type MatchConfidence = "none" | "low" | "medium" | "high";

export type OwnedItemMatch = {
  item: OwnedItem;
  score: number;
  confidence: MatchConfidence;
  reasons: string[];
};

const JOB_WEIGHT = 0.55;
const CATEGORY_WEIGHT = 0.25;
const CONDITION_WEIGHTS: Record<OwnedItem["condition"], number> = {
  good: 0.15,
  worn: 0.08,
  repairable: 0.12,
  broken: 0,
  unknown: 0.05,
};

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

export function scoreOwnedItemMatch(
  candidate: MatchCandidate,
  item: OwnedItem,
): { score: number; reasons: string[] } {
  // Matching is job-led: an item that does not cover the same job is never
  // suggested, no matter how similar its category looks.
  const job = normalise(candidate.job);
  if (!item.useTags.some((tag) => normalise(tag) === job)) {
    return { score: 0, reasons: [] };
  }

  const reasons: string[] = [`Already covers the same job: ${candidate.job}`];
  let score = JOB_WEIGHT;

  if (normalise(item.category) === normalise(candidate.category)) {
    score += CATEGORY_WEIGHT;
    reasons.push(`Same category: ${item.category}`);
  }

  score += CONDITION_WEIGHTS[item.condition];
  if (item.condition === "good") {
    reasons.push("In good condition and ready to use");
  } else if (item.condition === "repairable" && item.repairNote) {
    reasons.push(`Repairable: ${item.repairNote}`);
  } else if (item.condition === "worn") {
    reasons.push("Worn but still usable");
  }

  return { score: Math.min(1, score), reasons };
}

export function getMatchConfidence(score: number): MatchConfidence {
  if (score >= 0.8) return "high";
  if (score >= 0.6) return "medium";
  if (score >= 0.35) return "low";
  return "none";
}

export function findSameJobMatches(
  candidate: MatchCandidate,
  items: readonly OwnedItem[],
): OwnedItemMatch[] {
  return items
    .map((item) => {
      const { score, reasons } = scoreOwnedItemMatch(candidate, item);
      return { item, score, confidence: getMatchConfidence(score), reasons };
    })
    .filter((match) => match.confidence !== "none")
    .sort((a, b) => b.score - a.score);
}

export function explainMatch(match: OwnedItemMatch): string {
  return match.reasons[0] ?? `May help with the same job as ${match.item.name}`;
}
