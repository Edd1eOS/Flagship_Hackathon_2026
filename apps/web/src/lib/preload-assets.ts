import { ASSET_MANIFEST, CHARACTER_MANIFEST } from "../assets/manifest";

// Locked locations (Picnic Green, Little Station) render a tinted fallback
// and never mount an <img>, so their real art is only fetched the instant a
// project unlocks mid-session. Eagerly warming the browser cache for every
// manifest image up front means that unlock never depends on the network
// being reachable at that moment, matching the "must work offline after the
// app loads" requirement.
export function preloadWorldImages(): void {
  const sources = new Set<string>();
  for (const entry of Object.values(ASSET_MANIFEST)) {
    if (entry.src) sources.add(entry.src);
  }
  for (const entry of Object.values(CHARACTER_MANIFEST)) {
    sources.add(entry.src);
  }
  for (const src of sources) {
    const image = new Image();
    image.src = src;
  }
}
