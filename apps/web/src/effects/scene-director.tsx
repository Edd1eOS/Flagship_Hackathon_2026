"use client";

import { useEffect, useState } from "react";

import { CHARACTER_MANIFEST } from "../assets/manifest";
import { useLemonade } from "../repositories/repository-provider";
import { AssetTile } from "../components/world/asset-tile";

export function SceneDirector() {
  const effect = useLemonade((state) => state.uiEffects[0] ?? null);
  const consume = useLemonade((state) => state.consumeUiEffect);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!effect) return;
    const enter = window.setTimeout(() => setEntered(true), 10);
    const leave = window.setTimeout(() => setEntered(false), 700);
    const remove = window.setTimeout(consume, 1000);
    return () => {
      window.clearTimeout(enter);
      window.clearTimeout(leave);
      window.clearTimeout(remove);
    };
  }, [consume, effect]);

  if (!effect) return null;
  const isWorkshop = "locationId" in effect && effect.locationId === "workshop";
  const art =
    CHARACTER_MANIFEST[
      effect.type === "RESIDENT_TRAVELLED" ||
      effect.type === "LOCATION_ACTIVATED" ||
      effect.type === "LOCATION_LIVED_IN"
        ? "mender.repair"
        : "scout.acknowledge"
    ];
  const label =
    effect.type === "PROJECT_AVAILABLE"
      ? `${isWorkshop ? "Workshop" : "Town project"} is ready`
      : effect.type === "RESIDENT_TRAVELLED"
        ? "A resident is on the way"
        : effect.type === "LOCATION_ACTIVATED"
          ? `${isWorkshop ? "Workshop" : "Town project"} activated`
          : `${isWorkshop ? "Workshop" : "Town project"} is lived in`;

  return (
    <div
      role="status"
      className={`pointer-events-none fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-lg border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-4 py-2 shadow-lg transition-all duration-300 ${
        entered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <AssetTile
        src={art.src}
        sprite={art.sprite}
        alt=""
        tint="transparent"
        className="h-16 w-16"
      />
      <span className="text-sm font-bold">{label}</span>
    </div>
  );
}
