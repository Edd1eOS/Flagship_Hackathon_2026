import { LOCATION_HOTSPOTS } from "../../assets/manifest";
import type { LocationId, LocationState } from "@lemonade/domain";
import { LOCATION_STATE_LABEL } from "./location-state-label";

export type LocationHotspotProps = {
  locationId: LocationId;
  state: LocationState;
  selected: boolean;
  eligible: boolean;
  onSelect: (locationId: LocationId) => void;
};

// A real, keyboard-reachable button per town location. Positioned by a
// stable percentage rectangle that never depends on image alpha bounds, so
// hotspots stay put even before real art exists.
export function LocationHotspot({
  locationId,
  state,
  selected,
  eligible,
  onSelect,
}: LocationHotspotProps) {
  const hotspot = LOCATION_HOTSPOTS[locationId];

  // Highlighting lives on the compact label badge, not a box spanning the
  // full (deliberately generous, imprecise) click rect - a hard-edged
  // rectangle over hand-drawn art reads as a UI bug, not a button.
  const badgeStateClass = eligible
    ? "border-[var(--color-leaf)] bg-[var(--color-leaf)]/30"
    : selected
      ? "border-[var(--color-lemon)] bg-[var(--color-lemon)]/30"
      : state === "locked"
        ? "border-dashed border-white/70 bg-[var(--color-paper)]/70"
        : "border-transparent bg-[var(--color-paper)]/85 group-hover:border-[var(--color-leaf)] group-hover:bg-[var(--color-leaf)]/20";

  return (
    <button
      type="button"
      onClick={() => onSelect(locationId)}
      aria-pressed={selected}
      aria-label={
        eligible
          ? `${hotspot.label} — ${LOCATION_STATE_LABEL[state]} — tap to assign`
          : `${hotspot.label} — ${LOCATION_STATE_LABEL[state]}`
      }
      title={hotspot.label}
      style={{
        left: `${hotspot.rect.left}%`,
        top: `${hotspot.rect.top}%`,
        width: `${hotspot.rect.width}%`,
        height: `${hotspot.rect.height}%`,
      }}
      className="group absolute flex min-h-11 min-w-11 flex-col items-center justify-end pb-2 text-center"
    >
      <span
        className={`flex flex-col gap-0.5 rounded-lg border-2 px-2 py-1 shadow-sm transition-all group-hover:shadow-md ${badgeStateClass}`}
      >
        <span className="font-[family-name:var(--font-display)] text-sm text-[var(--color-ink)] sm:text-base">
          {hotspot.label}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink)]/70 sm:text-xs">
          {LOCATION_STATE_LABEL[state]}
        </span>
      </span>
    </button>
  );
}
