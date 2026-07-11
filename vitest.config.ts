import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "apps/**/*.test.{ts,tsx}",
      "packages/**/*.test.ts",
      "tests/unit/**/*.test.{ts,tsx}",
    ],
  },
});
