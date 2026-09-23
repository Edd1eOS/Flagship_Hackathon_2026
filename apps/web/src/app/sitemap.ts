import type { MetadataRoute } from "next";

const ORIGIN = "https://web-seven-pied-41.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: ORIGIN, priority: 1 },
    { url: `${ORIGIN}/demo-store`, priority: 0.6 },
  ];
}
