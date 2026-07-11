import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  reactStrictMode: true,
  transpilePackages: ["@lemonade/domain", "@lemonade/game-engine"],
};

export default nextConfig;
