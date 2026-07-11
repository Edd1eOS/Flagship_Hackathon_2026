import { LOCATION_HOTSPOTS } from "../../assets/manifest";
import type { LocationId, LocationState } from "@lemonade/domain";
import { LOCATION_STATE_LABEL } from "./location-state-label";

export type LocationHotspotProps = {
  locationId: LocationId;
  state: LocationState;
  selected: boolean;
  onSelect: (locationId: LocationId) => void;
};

// A real, keyboard-reachable button per town location. Positioned by a
// stable percentage rectangle that never depends on image alpha bounds, so
// hotspots stay put even before real art exists.
export function LocationHotspot({
  locationId,
  state,
  selected,
  onSelect,
}: LocationHotspotProps) {
  const hotspot = LOCATION_HOTSPOTS[locationId];

  return (
    <button
      type="button"
      onClick={() => onSelect(locationId)}
      aria-pressed={selected}
      aria-label={`${hotspot.label} — ${LOCATION_STATE_LABEL[state]}`}
      title={hotspot.label}
      style={{
        left: `${hotspot.rect.left}%`,
        top: `${hotspot.rect.top}%`,
        width: `${hotspot.rect.width}%`,
        height: `${hotspot.rect.height}%`,
      }}
      className={`absolute flex min-h-11 min-w-11 flex-col items-center justify-end gap-1 rounded-lg border-2 bg-transparent px-2 pb-2 text-center transition-colors ${
        selected
          ? "border-[var(--color-lemon)] bg-[var(--color-lemon)]/20"
          : state === "locked"
            ? "border-dashed border-white/60 opacity-80"
            : "border-transparent hover:border-[var(--color-leaf)]"
      }`}
    >
      <span className="rounded bg-[var(--color-paper)]/85 px-1 font-[family-name:var(--font-display)] text-sm text-[var(--color-ink)] sm:text-base">
        {hotspot.label}
      </span>
      <span className="rounded bg-[var(--color-paper)]/85 px-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink)]/70 sm:text-xs">
        {LOCATION_STATE_LABEL[state]}
      </span>
    </button>
  );
}
