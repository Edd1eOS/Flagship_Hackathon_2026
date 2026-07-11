import { expect, test, type Page } from "@playwright/test";

async function expectStableDashboard(page: Page) {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/");
  await expect(page.getByText("Lemonade", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Home Nook/ })).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Home Nook with the decision cooler" }),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
  expect(
    consoleErrors,
    "dashboard should hydrate without console errors",
  ).toEqual([]);
}

test("desktop town dashboard is stable and keyboard reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await expectStableDashboard(page);

  await page.getByRole("button", { name: /Workshop/ }).focus();
  await expect(page.getByRole("button", { name: /Workshop/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Workshop" })).toBeVisible();

  await expect(page).toHaveScreenshot("town-dashboard-desktop.png", {
    animations: "disabled",
    fullPage: true,
  });
});

test("mobile town dashboard keeps world, sheet, and navigation in view", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expectStableDashboard(page);

  const bottomNav = page.getByRole("navigation", { name: "Primary" });
  await expect(bottomNav).toBeVisible();
  const navBox = await bottomNav.boundingBox();
  expect(navBox?.y).toBeGreaterThanOrEqual(0);
  expect((navBox?.y ?? 844) + (navBox?.height ?? 0)).toBeLessThanOrEqual(844);

  const sheet = page.locator("[data-snap-state]");
  await expect(sheet).toHaveAttribute("data-snap-state", "half");
  await page.getByRole("button", { name: "Expand today panel fully" }).click();
  await expect(sheet).toHaveAttribute("data-snap-state", "full");
  await page.getByRole("button", { name: "Collapse today panel" }).click();
  await expect(sheet).toHaveAttribute("data-snap-state", "collapsed");
  await page.getByRole("button", { name: "Expand today panel" }).click();

  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByLabel("Always reduce motion").check();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.getByRole("button", { name: "Settings" }).click();

  await expect(page).toHaveScreenshot("town-dashboard-mobile.png", {
    animations: "disabled",
    fullPage: true,
  });
});

test("manual capture creates persistent Cooling beside seeded Ready", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await page.getByRole("button", { name: "I'm tempted" }).click();
  await expect(
    page.getByRole("heading", { name: "What are you tempted by?" }),
  ).toBeVisible();
  const capture = page.getByRole("complementary", {
    name: "Capture a purchase decision",
  });
  await capture.getByRole("button", { name: "Photo" }).click();
  await capture.getByLabel("Product photo").setInputFiles({
    name: "walking-shoes.png",
    mimeType: "image/png",
    buffer: Buffer.from("demo-photo"),
  });
  await expect(capture.getByText("walking-shoes.png")).toBeVisible();
  await expect(
    capture.getByText("Trail running shoes", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pause for 24 hours" }).click();

  await expect(
    page.getByRole("heading", { name: "Give it 24 hours" }),
  ).toBeVisible();
  await expect(
    page.getByText("Nothing has been bought or counted as saved."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to town" }).click();
  await expect(
    page.getByRole("button", { name: /Cooling \(1\)/ }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Ready \(1\)/ })).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("button", { name: /Cooling \(1\)/ }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Ready \(1\)/ })).toBeVisible();
});

for (const scenario of [
  {
    name: "Buy remains neutral",
    action: "Buy — neutral",
    expectedStatus: "bought",
    expectedDock: /Ready \(0\)/,
  },
  {
    name: "Use existing records reuse",
    action: "What I own solved it",
    expectedStatus: "skipped",
    expectedDock: /Ready \(0\)/,
  },
  {
    name: "Extend returns to Cooling",
    action: "Wait another 24 hours",
    expectedStatus: "cooling",
    expectedDock: /Cooling \(1\)/,
  },
] as const) {
  test(scenario.name, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Review now" }).click();
    const review = page.getByRole("complementary", { name: "Ready review" });
    await review.getByRole("button", { name: scenario.action }).click();
    await review.getByRole("button", { name: "Today" }).click();
    await expect(
      page.getByRole("button", { name: scenario.expectedDock }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Decisions" }).first().click();
    const decisions = page.getByRole("complementary", { name: "Decisions" });
    if (scenario.expectedStatus === "cooling") {
      await expect(decisions.getByText("Retro court sneakers")).toBeVisible();
    } else {
      await expect(
        decisions.getByText(scenario.expectedStatus, { exact: true }),
      ).toBeVisible();
    }
  });
}

test("Ready repair unlocks Workshop, records mission, allocation, and history", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Review now" }).click();
  const review = page.getByRole("complementary", { name: "Ready review" });
  await expect(
    review.getByText("White canvas sneakers", { exact: true }),
  ).toBeVisible();
  await review.getByRole("button", { name: "I repaired it" }).click();
  await expect(
    review.getByText(/Workshop activity is now available/),
  ).toBeVisible();
  await review
    .getByRole("button", { name: "Plan part of the skipped price" })
    .click();
  await review.getByLabel("Planned amount (AUD)").fill("25.00");
  await review
    .getByRole("button", { name: "Confirm planned allocation" })
    .click();
  await expect(review.getByText(/no money was transferred/)).toBeVisible();
  await review.getByRole("button", { name: "Today" }).click();
  await expect(
    page.getByRole("button", { name: /Workshop — Available/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Missions \(1\/2\)/ }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Decisions" }).first().click();
  const decisions = page.getByRole("complementary", { name: "Decisions" });
  await expect(decisions.getByText("Retro court sneakers")).toBeVisible();
  await expect(decisions.getByText("skipped", { exact: true })).toBeVisible();
});

test("My Stuff Quick Add and invalid import fallback remain usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?import=invalid-demo-token");
  await expect(
    page.getByText(
      /This import link is not valid.*Manual Capture is still available/,
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Dismiss" }).click();
  await page.getByRole("button", { name: "My Stuff" }).first().click();
  const stuff = page.getByRole("complementary", { name: "My Stuff" });
  await stuff.getByRole("button", { name: "Quick Add" }).click();
  await stuff.getByLabel("Name").fill("Rain shell");
  await stuff.getByLabel("Category").fill("clothing");
  await stuff.getByLabel("What job does it do?").fill("rain protection");
  await stuff.getByRole("button", { name: "Add to My Stuff" }).click();
  await expect(stuff.getByText("Rain shell", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "My Stuff" }).first().click();
  await expect(
    page
      .getByRole("complementary", { name: "My Stuff" })
      .getByText("Rain shell", { exact: true }),
  ).toBeVisible();
});
