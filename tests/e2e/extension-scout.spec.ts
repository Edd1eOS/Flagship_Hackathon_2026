import path from "node:path";

import { chromium, expect, test } from "@playwright/test";

const extensionPath = path.resolve("apps/extension/.output/chrome-mv3");

test("high-confidence Add to Cart shows a neutral Scout intervention", async ({}, testInfo) => {
  const context = await chromium.launchPersistentContext(
    testInfo.outputPath("profile"),
    {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    },
  );
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/demo-store");
    await expect(
      page.getByRole("complementary", { name: "Lemonade Browser Scout" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: /Add Cloudstep Runner Sneakers to cart/ })
      .click();
    await expect(
      page.getByRole("dialog", { name: "Pause before buying" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Continue anyway" }).click();
    await expect(
      page.getByRole("dialog", { name: "Pause before buying" }),
    ).toBeHidden();
    await page
      .getByRole("button", { name: /Add Cloudstep Runner Sneakers to cart/ })
      .click();
    await expect(
      page.getByRole("dialog", { name: "Pause before buying" }),
    ).toBeHidden();
    expect(await page.evaluate(() => localStorage.length)).toBe(0);
  } finally {
    await context.close();
  }
});

test("Pause is tab-local and Hide suppresses repeat prompts", async ({}, testInfo) => {
  const context = await chromium.launchPersistentContext(
    testInfo.outputPath("profile"),
    {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    },
  );
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/demo-store");
    await page
      .getByRole("button", { name: /Add Cloudstep Runner Sneakers to cart/ })
      .click();
    await page.getByRole("button", { name: "Pause" }).click();
    await expect(page.getByText("Paused in this tab")).toBeVisible();
    expect(await page.evaluate(() => localStorage.length)).toBe(0);

    await page.getByRole("button", { name: "Close" }).click();
    await page.reload();
    await expect(
      page.getByRole("complementary", { name: "Lemonade Browser Scout" }),
    ).toBeHidden();
  } finally {
    await context.close();
  }
});

test("Snooze suppresses the Scout for the current site tab", async ({}, testInfo) => {
  const context = await chromium.launchPersistentContext(
    testInfo.outputPath("profile"),
    {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    },
  );
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/demo-store");
    await page
      .getByRole("button", { name: /Add Cloudstep Runner Sneakers to cart/ })
      .click();
    await page
      .getByRole("button", { name: "Snooze this site for this tab" })
      .click();
    await page.reload();
    await expect(
      page.getByRole("complementary", { name: "Lemonade Browser Scout" }),
    ).toBeHidden();
  } finally {
    await context.close();
  }
});

test("Pause hands off exactly once and survives Lemonade refresh", async ({}, testInfo) => {
  const context = await chromium.launchPersistentContext(
    testInfo.outputPath("profile"),
    {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    },
  );
  try {
    const store = await context.newPage();
    await store.goto("http://127.0.0.1:3000/demo-store");
    await store
      .getByRole("button", { name: /Add Cloudstep Runner Sneakers to cart/ })
      .click();
    const lanePromise = context.waitForEvent("page");
    await store.getByRole("button", { name: "Pause" }).click();
    const lane = await lanePromise;
    await lane.waitForURL(/\?handoff=/);
    await expect(
      lane.getByText("Scout landed. Your decision is Cooling."),
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      lane.getByRole("button", { name: /Cooling \(1\)/ }),
    ).toBeVisible();

    const importedBefore = await lane.evaluate(() => {
      const state = JSON.parse(
        localStorage.getItem("lemonade.app-state.v1") ?? "null",
      );
      return state.decisions.filter(
        (decision: { origin: string }) =>
          decision.origin === "extension_import",
      ).length;
    });
    expect(importedBefore).toBe(1);
    await lane.reload();
    await expect(
      lane.getByRole("button", { name: /Cooling \(1\)/ }),
    ).toBeVisible();
    const importedAfter = await lane.evaluate(() => {
      const state = JSON.parse(
        localStorage.getItem("lemonade.app-state.v1") ?? "null",
      );
      return state.decisions.filter(
        (decision: { origin: string }) =>
          decision.origin === "extension_import",
      ).length;
    });
    expect(importedAfter).toBe(1);
  } finally {
    await context.close();
  }
});
