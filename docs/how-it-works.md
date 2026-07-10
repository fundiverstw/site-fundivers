# How it works

[← Back to start](index.md)

You don't need this page to change the site. It's here for when you get curious, or when
something breaks in a way the step-by-step guides do not cover.

---

## What kind of program is this?

It's a **single-page app**. The browser downloads one page and a bundle of JavaScript,
and from then on the JavaScript swaps the content when you click a link. That's why
moving between pages feels instant and the background never flashes.

It's written in **Svelte**, built by **Vite**, styled with **Tailwind**, and hosted on
**Cloudflare**. Files ending in `.svelte` are pieces of the page: a `<script>` block at
the top for logic, HTML underneath for what you see.

---

## The database that does not belong to this site

This is the single most important boundary in the project, and the source of most
confusion.

There is a second program, **`app-fundivers`**, where customers log in, book trips, and
pay. It owns a Supabase database. This website reads a few public tables out of that
database, with a read-only key, and shows them:

| This site shows | Read from | Owned by |
| --- | --- | --- |
| The calendar of trips and classes | `EO_dives`, `EO_courses` | the booking app |
| Prices | `EO_prices` | the booking app |
| Travel destination covers | `travel_destinations` | the booking app |

Everything else — dive sites, course descriptions, photos, the words on every page — is
**static content bundled into this project**, in `src/content/`.

Two consequences worth remembering:

1. **You cannot fix a price by editing this repository.** Fix it in the booking app.
2. **Don't move marketing content into the database to "share" it.** The database serves
   the booking app first. If a schema change there breaks a query here, this site's pages
   go blank and nobody finds out until a customer says so.

The read-only key that does this lives in `.env` and is safe to ship to browsers —
row-level security in Supabase only exposes those public rows to it.

---

## What each file in `src/engine/` does

Roughly in order of how likely you are to need it.

| File | What it does |
| --- | --- |
| `router.ts` | Decides which page to show for a web address. About 40 lines, no library. |
| `supabase.ts` | Opens the read-only connection to the booking app's database. |
| `events.ts` | Fetches trips and classes for the calendar and joins their prices on. |
| `destinations.ts` | Fetches the travel destinations. |
| `i18n.ts` | Remembers which language the visitor picked. The words themselves are in `content/text/`. |
| `format.ts` | Turns `2026-07-14T09:00` into `Jul 14, 9:00 am`. |
| `photo-pool.ts` | Decides which photo each card gets. Reads `content/photos/`. |
| `images.ts` | Turns the old website's photo names into local file paths. |
| `event-colors.ts` | Which colour a calendar entry gets (blue for Open Water, and so on). |
| `calendar-layout.ts` | The maths that stops overlapping trips from covering each other on the month grid. |
| `map-layout.ts` | The maths that turns latitude and longitude into a position on the Taiwan map. |
| `taiwan.geo.json` | The outline of Taiwan, as coordinates. |
| `links.ts` | Builds links out to the old fundiverstw.com pages. |
| `game.ts` | Six lines. Remembers whether the octopus's game is open. |

---

## The `$content` in an import line

At the top of a file you'll see:

```ts
import { CONTACT } from '$content/settings'
import { formatEventSpan } from '$engine/format'
```

Those `$` names are shortcuts for folders, so you never write `../../../`. They're
defined in **two** places, which must agree:

- `vite.config.ts` — so the site builds
- `tsconfig.json` — so the editor and `npm run check` understand them

If you add a folder shortcut to one and forget the other, you get a confusing "cannot
find module" error. Add it to both.

---

## Why the stylesheet has an `@source` line

`src/styles/app.css` contains:

```css
@source "../";
```

Tailwind only includes a class in the finished stylesheet if it literally sees that class
written somewhere in your files. This line tells it to read everything under `src/`.

Without it, Tailwind would look only in the folder holding the stylesheet
(`src/styles/`), find no class names, and ship a site with no styling at all.

This is also why you can't build class names out of pieces — see the last section of
[Changing how it looks](changing-look.md).

---

## The octopus and the maze

The little octopus that pops out of the logo is a button. Clicking it opens **Wreck
Maze**, a quiz game hidden in `src/components/game/WreckMaze.svelte`. Its 52 questions
are content, and live in `src/content/quiz-questions.ts` — you can add more without
touching the game itself.

Two known problems, if you want to fix them:

- The octopus is `hidden xl:block`, so **on a phone or tablet there is no way to open the
  game at all.**
- The game's questions and buttons are **English only**, while the rest of the site
  speaks three languages.

---

## Where things get built

`npm run build` produces a `dist/` folder. That folder is what Cloudflare serves. It is
generated, it is not in git, and **editing it is always a mistake** — the next build
overwrites it.
