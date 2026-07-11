import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  reactStrictMode: true,
  transpilePackages: ["@lemonade/domain", "@lemonade/game-engine"],
  async headers() {
    return [
      {
        // Town art is a fixed set shipped with the build, not user content,
        // so once preloadWorldImages() has fetched a file the browser must
        // never need to revalidate it - the default `max-age=0` this app
        // would otherwise inherit forces a network round-trip on every use,
        // which defeats preloading and breaks the offline-after-load path.
        source: "/art/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
