# site-fundivers

Public marketing site for **FunDivers TW** — a fast static SPA built with **Svelte + Vite**, deployed to **Cloudflare**. It reads public catalog data (dive sites, dives, courses, prices) from the **same Supabase project as [`app-fundivers`](../app-fundivers)** via the anon key, and links out to that app for booking and login.

Structured to mirror [fundiverstw.com](https://www.fundiverstw.com/): **Courses · Sites · Photos · Calendar · Team**.

## Stack

- **Svelte 5** (runes) + **Vite 7** — client-rendered SPA
- **Tailwind CSS 4** (via `@tailwindcss/vite`, no config file)
- **@supabase/supabase-js** — read-only anon client, no auth
- **Wrangler** — Cloudflare deploy with SPA fallback
- Tiny dependency-free history router (`src/engine/router.ts`)

## Maintainer's guide

**→ [fundiverstw.github.io/site-fundivers](https://fundiverstw.github.io/site-fundivers/)**

Plain-language instructions for changing the site — the words, the colours, the dive
sites, the photos — aimed at someone new to the codebase, including a from-zero
explainer of what a server, Cloudflare and Svelte are. Source in [`docs/`](docs/).

## Project layout

`src/` is split so that each folder answers one question. Imports name the folder they
come from (`$content/dive-sites`, `$engine/router`), so you never count `../../`.

| Folder | Holds | Edited |
| ------ | ----- | ------ |
| `src/content/` | The words, facts, links and photos. Text is per-language in `content/text/`. | Constantly |
| `src/styles/`  | `theme.css` (colours, fonts), `components.css` (`.glass`, `.waybar`), `background.css` | Sometimes |
| `src/pages/`   | One component per route | Sometimes |
| `src/components/` | Shared UI, plus `game/` (the Wreck Maze easter egg) | Sometimes |
| `src/engine/`  | Router, Supabase client, layout maths, photo pool | Rarely |

Marketing content is deliberately **not** in the shared database: that database is
app-first, and a schema change in `app-fundivers` must not be able to blank a page here.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in values (defaults already point at the prod project)
npm run dev            # http://localhost:5173
```

### Scripts

| Command                | What it does                                                     |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server                                        |
| `npm run verify`       | **The gate.** Types, lint, formatting, unit tests, browser tests |
| `npm run check`        | Type-check only (`svelte-check`)                                 |
| `npm run lint`         | ESLint (`lint:fix` to autofix)                                   |
| `npm run format`       | Prettier (`format:check` to verify only)                         |
| `npm run test:unit`    | Vitest — pure functions + content integrity                      |
| `npm run test:e2e`     | Playwright — the built site in a real browser                    |
| `npm run build`        | Type-check then build `dist/`                                    |
| `npm run preview`      | Preview the production build locally                             |
| `npm run deploy`       | `verify`, build, then `wrangler deploy` to Cloudflare            |

CI (`.github/workflows/ci.yml`) runs `verify` on every push and pull request. It needs no
secrets: the browser tests intercept every Supabase call, so placeholder env vars suffice.
The flip side is that **nothing here proves the site can read the live database** — a
breaking migration in `app-fundivers` will pass CI and blank the calendar.

## Environment

| Var                      | Purpose                                                        |
| ------------------------ | ------------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Shared Supabase project URL (same DB as `app-fundivers`)      |
| `VITE_SUPABASE_ANON_KEY` | Public anon key — RLS limits it to read-only public catalog   |
| `VITE_APP_URL`           | The booking app that "Book Now" / "Enroll" CTAs link to       |

The anon key is safe to ship to the browser: Row Level Security exposes only public
catalog rows (`dive_sites`, `EO_dives`, `EO_courses`, `EO_prices`, `cert_levels`) to `anon`.
This site never authenticates anyone — all booking/login happens in `app-fundivers`.

## Data sources

| Page     | Source                                                    |
| -------- | --------------------------------------------------------- |
| Calendar | Month grid (ported from app-fundivers) — `EO_dives` + `EO_courses`, priced via `EO_prices`, dive trip/local color from `eo_dive_destinations`/`TravelDestinations` |
| Sites    | Static catalog in `src/content/dive-sites.ts`, grouped North / South / Outlying Islands / International (the shared `dive_sites` table was dropped upstream) |
| Courses  | Static PADI catalog + live upcoming course sessions       |
| Photos   | Self-hosted gallery under `public/imgs/gallery/`, listed in `src/content/photo-gallery.ts` |
| Team     | Placeholder roster (swap in real names/photos)            |

Live data access lives in `src/engine/events.ts`; the static dive-site catalog is
`src/content/dive-sites.ts`.

## Deploy (Cloudflare)

`wrangler.toml` serves `./dist` with `not_found_handling = "single-page-application"`
so client routes like `/calendar` resolve on direct load. The Worker is named
`site-fundiverstw` and deploys to the **same Cloudflare account as app-fundivers**.

```bash
npm run deploy   # build + dotenv -e .env -- wrangler deploy
```

`npm run deploy` injects `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` from `.env`
(same account/token as `app-fundivers`) so wrangler authenticates non-interactively —
no `wrangler login` needed. Both vars are documented in `.env.example`.

### URL

With no custom domain or routes configured, the first deploy publishes to the
account's workers.dev subdomain:

```
https://site-fundiverstw.<your-account-subdomain>.workers.dev
```

To put it on a custom domain (e.g. `www.fundiverstw.com`), add a route / custom
domain in the Cloudflare dashboard or a `routes` entry in `wrangler.toml` — same
as how `app-fundivers` maps to `app.fundiverstw.com`.

## Notes

- Routing is history-based with clean URLs; the Cloudflare SPA fallback handles reloads.
- Booking, accounts, payments, and admin all live in `app-fundivers` — this site is read-only.
