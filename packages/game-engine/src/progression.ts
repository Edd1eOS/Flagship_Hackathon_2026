import type { AppState } from "@lemonade/domain";

export const XP_PER_LEVEL = 30;

// Progression is derived, never stored: fixed reflection XP totals only.
// There is no currency, shop, or purchasable reward.
export function getProgression(state: AppState): {
  totalXp: number;
  level: number;
} {
  const totalXp = state.reflections.reduce(
    (total, reflection) => total + reflection.xpAwarded,
    0,
  );
  return { totalXp, level: 1 + Math.floor(totalXp / XP_PER_LEVEL) };
}
