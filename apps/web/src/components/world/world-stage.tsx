import type { LocationId, LocationState, TownLocation } from "@lemonade/domain";

import {
  ASSET_MANIFEST,
  CHARACTER_MANIFEST,
  LOCATION_HOTSPOTS,
  type WorldAssetId,
} from "../../assets/manifest";
import { AssetTile } from "./asset-tile";
import { LocationHotspot } from "./location-hotspot";

function worldAssetForLocation(
  locationId: LocationId,
  state: LocationState,
): WorldAssetId | null {
  switch (locationId) {
    case "home_nook":
      return "world.home.active";
    case "browser_gate":
      return "world.browser-gate";
    case "workshop":
      if (state === "locked") return "world.workshop.locked";
      if (state === "active" || state === "lived_in")
        return "world.workshop.active";
      return "world.workshop.ready";
    case "picnic_green":
      if (state === "locked") return null;
      if (state === "active" || state === "lived_in")
        return "world.picnic.active-or-static";
      return "world.picnic.ready";
    case "little_station":
      if (state === "locked") return null;
      if (state === "active" || state === "lived_in")
        return "world.station.active-or-static";
      return "world.station.ready";
    case "quiet_garden":
      return null;
  }
}

export type WorldStageProps = {
  locations: TownLocation[];
  selectedLocationId: LocationId | null;
  onSelectLocation: (locationId: LocationId) => void;
};

// The town is the dashboard itself: an unframed, full-bleed diorama, not a
// card floating inside another surface.
export function WorldStage({
  locations,
  selectedLocationId,
  onSelectLocation,
}: WorldStageProps) {
  const base = ASSET_MANIFEST["world.town.base"];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AssetTile
        src={base.src}
        alt={base.alt}
        tint={base.fallbackTint}
        className="absolute inset-0 h-full w-full"
      />
      {locations.map((location) => {
        const assetId = worldAssetForLocation(location.id, location.state);
        const asset = assetId ? ASSET_MANIFEST[assetId] : null;
        if (!asset) return null;
        const rect = LOCATION_HOTSPOTS[location.id].rect;
        return (
          <AssetTile
            key={location.id}
            src={asset.src}
            alt={asset.alt}
            tint={asset.fallbackTint}
            sprite={asset.sprite}
            className="pointer-events-none absolute rounded-xl opacity-60"
            style={{
              left: `${rect.left}%`,
              top: `${rect.top}%`,
              width: `${rect.width}%`,
              height: `${rect.height}%`,
            }}
          />
        );
      })}
      {locations.map((location) => (
        <LocationHotspot
          key={location.id}
          locationId={location.id}
          state={location.state}
          selected={selectedLocationId === location.id}
          onSelect={onSelectLocation}
        />
      ))}
      <AssetTile
        src={CHARACTER_MANIFEST["scout.idle"].src}
        sprite={CHARACTER_MANIFEST["scout.idle"].sprite}
        alt={CHARACTER_MANIFEST["scout.idle"].alt}
        tint="transparent"
        className="pointer-events-none absolute bottom-[3%] left-[51%] h-[18%] w-[12%]"
      />
    </div>
  );
}
