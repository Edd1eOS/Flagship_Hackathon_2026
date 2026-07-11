import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Lemonade Browser Scout",
    description:
      "Pauses high-confidence shopping intent so you can check what you already own.",
    permissions: ["storage"],
    web_accessible_resources: [
      {
        resources: ["scout-sheet.png"],
        matches: ["http://127.0.0.1/*", "http://localhost/*"],
      },
    ],
  },
});
