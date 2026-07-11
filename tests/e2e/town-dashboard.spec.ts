import { expect, test, type Page } from "@playwright/test";

// Every test in this file is asserted to raise zero uncaught console errors
// or page exceptions, regardless of which flow it exercises.
let consoleErrors: string[] = [];

test.beforeEach(async ({ page }) => {
  consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(String(error)));
  // Every test except the onboarding one itself starts with the welcome
  // modal already dismissed, so it doesn't block interaction with the rest
  // of the dashboard.
  await page.addInitScript(() => {
    window.localStorage.setItem("lemonade.onboarding-dismissed", "true");
  });
});

test.afterEach(() => {
  expect(consoleErrors, "no uncaught console errors or exceptions").toEqual([]);
});

async function expectStableDashboard(page: Page) {
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
}

test("first open shows the canonical seed with no action taken", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await expectStableDashboard(page);

  await expect(page.getByText("Japan trip fund")).toBeVisible();
  await expect(page.getByRole("button", { name: /Ready \(1\)/ })).toBeVisible();

  await expect(
    page.getByRole("button", { name: /Home Nook — Lived in/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Browser Gate — Available/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Workshop — Locked/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Picnic Green — Locked/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Little Station — Locked/ }),
  ).toBeVisible();

  await page.getByRole("button", { name: "My Stuff" }).first().click();
  const stuff = page.getByRole("complementary", { name: "My Stuff" });
  await expect(stuff.getByRole("listitem")).toHaveCount(10);
});

test("desktop town dashboard is stable and keyboard reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await expectStableDashboard(page);

  await expect(page.getByRole("complementary", { name: "Today" }))
    .toMatchAriaSnapshot(`
    - complementary "Today":
      - heading "Today" [level=2]
      - region "Ready now":
        - heading "Ready now" [level=3]
        - paragraph: Retro court sneakers
        - button "Review now"
      - region "Active mission":
        - heading "Active mission" [level=3]
        - paragraph: No active mission yet.
      - region "Town plan":
        - heading "Town plan" [level=3]
        - list:
          - listitem:
            - button "Mender Unassigned"
          - listitem:
            - button "Host Unassigned"
      - region "Patrol":
        - heading "Patrol" [level=3]
        - paragraph: Extension not connected
      - button "I'm tempted"
  `);

  await page.getByRole("button", { name: /Workshop/ }).focus();
  await expect(page.getByRole("button", { name: /Workshop/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Workshop" })).toBeVisible();

  await expect(page.getByRole("complementary", { name: "Location details" }))
    .toMatchAriaSnapshot(`
    - complementary "Location details":
      - button "Today"
      - heading "Workshop" [level=2]
      - paragraph: Repair and reuse what you own
      - term: State
      - definition: Locked
  `);

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
  await expect(capture).toMatchAriaSnapshot(`
    - complementary "Capture a purchase decision":
      - button "Today"
      - heading "What are you tempted by?" [level=2]
      - button "Manual" [pressed]
      - button "Photo"
      - button "Scout" [disabled]
      - text: Item name
      - textbox "Item name": Everyday walking sneakers
      - text: Price (AUD)
      - textbox "Price (AUD)": "149.95"
      - text: Category
      - textbox "Category": footwear
      - text: What job should it do?
      - textbox "What job should it do?": daily walking
      - group "How does this feel?":
        - text: How does this feel?
        - radio "need"
        - text: need
        - radio "replacement"
        - text: replacement
        - radio "want" [checked]
        - text: want
      - paragraph: Same-job check
      - paragraph: Trail running shoes
      - paragraph: "Already covers the same job: daily walking"
      - paragraph: +2 more possible matches
      - button "Pause for 24 hours"
  `);
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

test("business loop keeps working with the network fully offline after load", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  const failedRequests: string[] = [];
  page.on("requestfailed", (request) => failedRequests.push(request.url()));

  await page.goto("/");
  await expect(page.getByRole("button", { name: /Ready \(1\)/ })).toBeVisible();
  await page.waitForLoadState("networkidle");

  await context.setOffline(true);

  await page.getByRole("button", { name: "I'm tempted" }).click();
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
  await page.getByRole("button", { name: "Pause for 24 hours" }).click();
  await expect(
    page.getByRole("heading", { name: "Give it 24 hours" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to town" }).click();
  await expect(
    page.getByRole("button", { name: /Cooling \(1\)/ }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Review now" }).click();
  const review = page.getByRole("complementary", { name: "Ready review" });
  await review.getByRole("button", { name: "Buy — neutral" }).click();
  await review.getByRole("button", { name: "Today" }).click();
  await expect(page.getByRole("button", { name: /Ready \(0\)/ })).toBeVisible();

  expect(
    failedRequests,
    "no network request should even be attempted once the app has loaded",
  ).toEqual([]);

  await context.setOffline(false);
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
  await expect(review).toMatchAriaSnapshot(`
    - complementary "Ready review":
      - button "Today"
      - paragraph: Ready review
      - heading "Retro court sneakers" [level=2]
      - term: Original job
      - definition: daily walking
      - term: Original motive
      - definition: trend
      - paragraph: Best same-job match
      - paragraph: White canvas sneakers
      - paragraph: "Already covers: daily walking"
      - button "What I own solved it"
      - button "I repaired it"
      - button "Buy — neutral"
      - button "It is a real need"
      - button "Wait another 24 hours"
  `);
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

test("Assigning Mender and Host confirms the town plan and activates Workshop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Review now" }).click();
  const review = page.getByRole("complementary", { name: "Ready review" });
  await review.getByRole("button", { name: "I repaired it" }).click();
  await expect(
    review.getByText(/Workshop activity is now available/),
  ).toBeVisible();
  await review.getByRole("button", { name: "Today" }).click();

  await expect(
    page.getByRole("button", { name: /Workshop — Available/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Picnic Green — Available/ }),
  ).toBeVisible();

  const today = page.getByRole("complementary", { name: "Today" });
  await today.getByRole("button", { name: /Mender/ }).click();
  await expect(
    page.getByRole("button", { name: /Workshop.*tap to assign/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Picnic Green.*tap to assign/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Workshop.*tap to assign/ }).click();
  await expect(
    today.getByRole("button", { name: /Mender.*Previewed — Workshop/ }),
  ).toBeVisible();

  await today.getByRole("button", { name: /Host/ }).click();
  await page
    .getByRole("button", { name: /Picnic Green.*tap to assign/ })
    .click();
  await expect(
    today.getByRole("button", { name: /Host.*Previewed — Picnic Green/ }),
  ).toBeVisible();

  await today.getByRole("button", { name: "Confirm plan" }).click();
  await expect(
    page.getByRole("button", { name: /Workshop — Active/ }),
  ).toBeVisible();
  await expect(
    today.getByRole("button", { name: /Mender.*Active — Workshop/ }),
  ).toBeVisible();
  await expect(
    today.getByRole("button", { name: /Host.*Active — Picnic Green/ }),
  ).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("button", { name: /Workshop — Active/ }),
  ).toBeVisible();
});

test("Cancelling a previewed assignment frees the location before confirming", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Review now" }).click();
  const review = page.getByRole("complementary", { name: "Ready review" });
  await review.getByRole("button", { name: "I repaired it" }).click();
  await review.getByRole("button", { name: "Today" }).click();

  const today = page.getByRole("complementary", { name: "Today" });
  await today.getByRole("button", { name: /Mender/ }).click();
  await page.getByRole("button", { name: /Workshop.*tap to assign/ }).click();
  await expect(
    today.getByRole("button", { name: /Mender.*Previewed — Workshop/ }),
  ).toBeVisible();

  await today.getByRole("button", { name: "Cancel" }).click();
  await expect(
    today.getByRole("button", { name: /Mender.*Unassigned/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Workshop — Available/ }),
  ).toBeVisible();
  await expect(
    today.getByRole("button", { name: "Confirm plan" }),
  ).toBeHidden();
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

test("Goal tab shows real progress beside the town, not a placeholder", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Goal" }).click();
  await expect(
    page.getByText("This section opens later in the build."),
  ).toHaveCount(0);
  const goal = page.getByRole("complementary", { name: "Goal" });
  await expect(
    goal.getByRole("heading", { name: "Japan trip fund" }),
  ).toBeVisible();
  await expect(
    goal.getByText("$350.00 of $1,800.00 tracked (19%)"),
  ).toBeVisible();
  await expect(goal.getByRole("progressbar")).toBeVisible();
  await expect(goal.getByText("No planned allocations yet.")).toBeVisible();
  // The world stays the dashboard - Goal is a side panel, not a full takeover.
  await expect(page.getByRole("button", { name: /Home Nook/ })).toBeVisible();
});

test("Welcome modal shows on first visit, dismisses, persists, and reopens from Help", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Override the file-wide "already dismissed" init script for this test
  // only, so the modal actually appears as it would for a first-time visit.
  await page.addInitScript(() => {
    window.localStorage.removeItem("lemonade.onboarding-dismissed");
  });
  await page.goto("/");

  const modal = page.getByRole("dialog", { name: "Welcome to Lemonade Lane" });
  await expect(modal).toBeVisible();
  await expect(modal.getByText("Try this first")).toBeVisible();
  await modal.getByRole("button", { name: "Got it, let's explore" }).click();
  await expect(modal).toBeHidden();

  // Dismissal persists via localStorage (checked directly rather than via a
  // real reload, since this test's own init-script override above would
  // otherwise re-clear the flag on every navigation, masking the real value).
  const dismissedFlag = await page.evaluate(() =>
    window.localStorage.getItem("lemonade.onboarding-dismissed"),
  );
  expect(dismissedFlag).toBe("true");

  await page.getByRole("button", { name: "How this works" }).click();
  await expect(modal).toBeVisible();
});

test("Level badge reflects reflection XP after a decision review", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.getByText("Lv 1", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Review now" }).click();
  const review = page.getByRole("complementary", { name: "Ready review" });
  await review.getByRole("button", { name: "Buy — neutral" }).click();

  await expect(page.getByText("Lv 1", { exact: true })).toBeVisible();
  await expect(
    page.getByTitle(/10\/30 XP toward the next level \(10 XP total\)/),
  ).toBeVisible();
});
