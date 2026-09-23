import { ASSET_MANIFEST, CHARACTER_MANIFEST } from "../assets/manifest";

// Locked locations (Picnic Green, Little Station) render a tinted fallback
// and never mount an <img>, so their real art is only fetched the instant a
// project unlocks mid-session. Eagerly warm those state-dependent files. The
// base town is excluded because next/image loads an appropriately sized,
// optimized version immediately.
export function preloadWorldImages(): void {
  const sources = new Set<string>();
  for (const entry of Object.values(ASSET_MANIFEST)) {
    if (entry.id !== "world.town.base" && entry.src) sources.add(entry.src);
  }
  for (const entry of Object.values(CHARACTER_MANIFEST)) {
    sources.add(entry.src);
  }
  for (const src of sources) {
    const image = new Image();
    image.src = src;
  }
}
