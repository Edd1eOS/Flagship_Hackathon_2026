# Lemonade — Mindful Spending

> Not affiliated with Lemonade Insurance (Lemonade, Inc., lemonade.com). "Lemonade" is a hackathon project name; this repository, its GitHub page, its demo website, and its demo video are all subtitled **Mindful Spending** to keep that distinct.

**Live demo:** [web-seven-pied-41.vercel.app](https://web-seven-pied-41.vercel.app) — Lemonade Lane works there directly. The Browser Scout extension also activates on that domain's `/demo-store` page once loaded locally (see [Loading the extension](#loading-the-extension)); no local web server is required to see either half of the product.

## Problem

Most "don't overspend" tools intervene after the fact — a budget dashboard, a bank alert, a spreadsheet nobody opens. By the time they say anything, the purchase already happened. The moment that actually matters is earlier: the instant someone is about to buy something they may already own an equivalent of.

## Value proposition

Lemonade is a pre-purchase reuse companion. It catches high-confidence shopping intent *before* checkout, pauses it for 24 hours, and checks whether something the person already owns can do the same job. If it can, that's a repair/reuse mission instead of a purchase. If it can't, buying is treated as a normal, non-punitive outcome — Lemonade never blocks a purchase or claims a "skip" as savings.

The product has two connected surfaces:

- **Lemonade Browser Scout** — a WXT browser extension that detects high-confidence shopping intent on a controlled demo storefront (JSON-LD/Open Graph product data) and offers Pause / Continue anyway / Snooze / Hide. It never sees payment, address, account, or purchase-history data, and only ever runs on the controlled demo page (`http://localhost`, `http://127.0.0.1`, or the deployed demo domain above) — it is not a general-purpose retailer extension.
- **Lemonade Lane** — the town dashboard where a paused decision continues: 24-hour Cooling, an honest Ready review (Buy / already-own reuse / repair / real-need / extend), same-job matching against what the person already owns, and a persistent town (Workshop, Picnic Green, Little Station, Home Nook, Browser Gate) that visualises reuse/repair missions as resident activity.

No AI decides necessity, outcome, same-job matching, or eligibility — those are deterministic domain rules, unit-tested in `packages/domain` and `packages/game-engine`. The full business loop works entirely offline after the page loads (no backend, no external API).

## Demo flow

```text
controlled sneaker page
-> Scout detects
-> Add to Cart
-> Pause
-> Scout returns through Browser Gate
-> same-job owned shoes
-> repair/try-existing mission
-> genuine Cooling confirmation
-> seeded Ready check-in
-> confirmed reuse/repair
-> Workshop available
-> assign Mender + Host
-> Workshop active/lived-in
-> closing value proposition
```

## Architecture

Monorepo managed with pnpm workspaces (Corepack), TypeScript throughout.

| Package | Role |
| --- | --- |
| `packages/domain` | React-free core: Zod schemas, the command/transaction/event system, the decision and mission state machines, same-job matching, the seed dataset. Zod is its only runtime dependency. |
| `packages/game-engine` | React-free town simulation: eligibility rules, resident assignment, event projection, world invariants. Depends only on `@lemonade/domain`. |
| `apps/web` | Next.js (App Router, Turbopack) app. Renders Lemonade Lane, persists state to `localStorage` via `WebLocalRepository`, hosts the controlled demo storefront at `/demo-store`. |
| `apps/extension` | WXT + React browser extension (Manifest V3). Detects product intent on the controlled storefront and hands a paused decision off to the web app via `chrome.storage`. |
| `tests/e2e` | Playwright end-to-end tests covering both apps together in a real Chromium browser. |

UI components dispatch commands and render selectors; they never mutate domain/game state directly. See [`docs/production/03-dependency-map.md`](./docs/production/03-dependency-map.md) for the full contract map.

## Local setup

Requirements: Node.js ≥ 22, pnpm ≥ 11 (managed via Corepack). No environment variables are required for the demo loop — `.env.example` documents one optional P1-only key that the P0 demo never needs.

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev:web        # Lemonade Lane at http://localhost:3000
```

Other useful commands (see root `package.json`):

```bash
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test           # Vitest, all packages
corepack pnpm test:e2e       # Playwright, requires the web dev server (started automatically)
corepack pnpm build          # builds every package, including the extension
```

## Loading the extension

1. `corepack pnpm --filter @lemonade/extension build` (outputs to `apps/extension/.output/chrome-mv3`), or download and unzip the pre-built artifact from `apps/extension/.output/lemonadeextension-0.0.0-chrome.zip` after running `corepack pnpm --filter @lemonade/extension zip`.
2. In Chrome, open `chrome://extensions`, enable Developer mode, click **Load unpacked**, and select `apps/extension/.output/chrome-mv3`.
3. Open the demo storefront and click "Add Cloudstep Runner Sneakers to cart" to trigger the Scout - either the deployed one (`https://web-seven-pied-41.vercel.app/demo-store`, no local server needed) or, with the web app running locally (`corepack pnpm dev:web`), `http://localhost:3000/demo-store`.

The extension only requests the `storage` permission and only runs on the three demo origins listed in `apps/extension/src/allowed-origins.ts` (`http://localhost/*`, `http://127.0.0.1/*`, and the deployed demo domain) — it cannot activate on any real website.

## Seed / demo-data disclaimer

The persona ("Alex"), goal ("Japan trip fund"), owned items, and the one seeded Ready decision ("Retro court sneakers") are fixed fictional demo data created for this hackathon, not real user data. The "Cloudstep Runner Sneakers" storefront at `/demo-store` is a controlled demo page built for this project — it is not a real retailer, has no checkout, payment, account, or delivery form, and is not affiliated with any real brand.

## Privacy limits

- The extension requests only the `storage` permission — no `tabs`, no `activeTab`, no host permissions beyond the three demo origins it is scoped to.
- Product detection reads only public on-page structured data (JSON-LD / Open Graph); it never reads payment fields, addresses, accounts, or purchase history.
- Pause / Continue anyway / Snooze / Hide are always available and always tab-local until an explicit handoff.
- A paused decision is handed off to the web app at most once (idempotent, command-ID deduped) and is acknowledged so it cannot be replayed.

## Source references

- [`docs/production/README.md`](./docs/production/README.md) — index of all production documentation (source of truth for implementation).
- [`docs/production/01-implementation-roadmap.md`](./docs/production/01-implementation-roadmap.md) — staged delivery plan and exit criteria.
- [`docs/production/02-change-log.md`](./docs/production/02-change-log.md) — full change history with verification evidence for every stage.
- [`docs/production/06-agent-handoff.md`](./docs/production/06-agent-handoff.md) — current implementation state.
- [`docs/13-town-dashboard-uiux.md`](./docs/13-town-dashboard-uiux.md) — UI/UX specification the dashboard was built against.

## Team & roles

_To be completed by the team before submission._
