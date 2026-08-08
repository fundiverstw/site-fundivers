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

### Pages arrive one at a time

`src/App.svelte` does not import the pages. It holds a list of `() => import(...)`
functions, one per address, and fetches a page the first time somebody opens it. So
reading a dive site no longer downloads the Taiwan map's coordinates and every course
write-up as well.

Two things follow from that, and both are already handled:

- Moving the pointer over a link starts fetching that page before the click, so the wait
  is usually over before it begins.
- A page that never touches the database also never downloads the database library.

If you add a page, add it to that list in `App.svelte`. Nothing else changes.

### A page existing is not the same as a page being reachable

`App.svelte` decides which addresses **work**. It does not put a link to any of them
anywhere. Adding a page there and stopping means a page only somebody who types the
address can ever see.

The navigation bar is a separate list, at the top of `src/components/Nav.svelte`:

```ts
let leftLinks = $derived([
  { href: '/courses', label: $t.nav.courses },
  …
])
```

Eight links fit beside the logo, and that is the limit — a browser test (`the whole
navigation fits`) fails if the bar runs off a 1280px screen. **Adding a ninth means
taking one out.** So several pages are deliberately reached from somewhere else instead:

| Page | Reached from |
| --- | --- |
| **Team** | The sign-off at the bottom of every page — "Proudly created by the FunDivers **Team** in Taipei, Taiwan", in `src/components/Footer.svelte` |
| Gear, Cycling, Hiking, FunDive, Websites | The cards on the Services page (`src/pages/Services.svelte`); Gear also from the Home page |
| A single news story | Its card on the News page (`/news/<slug>`) |

**If you remove a link, check what else pointed at that page first.** The Team page has
exactly one link into it; delete the footer sign-off and the page is still there, still
builds, still passes the type checker, and no visitor will ever find it. `e2e/footer.spec.ts`
exists to catch precisely that.

The keys in `App.svelte` starting with a `:` — `:site`, `:course`, `:news`, and `:missing`
for the 404 — are the detail pages. They cannot be written as plain paths because one
component serves every address underneath a prefix: `/news/reef-cleanup` and
`/news/padi-conference` are both `:news`, which reads the slug back off the address and
looks the story up.

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

Inside `content`, anything with a page of its own is a folder named after its address —
`dive-sites/bat-cave/`, `courses/padi-efr-course/`, `news/2026-06-14-womens-dive-day/` —
holding that thing's data, its write-up, its photos and all three languages. A barrel
(`index.ts`) globs the folders into the list the pages import. Two consequences worth
knowing: the folder name is the id, so it cannot fall out of step with itself, and there
is no catalogue file to edit when you add or remove one.

The write-ups live in a second barrel (`details.ts`) rather than the same one, so the list
pages — which show only names and photos — do not download every write-up in three
languages to render a grid.

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
| `db-columns.ts` | The names of the database columns this site reads — checked by the contract test so a rename upstream is caught early. |
| `radio.ts` | Whether the shop's live radio stream is on air, for the nav's radio player. |
| `i18n.ts` | Remembers which language the visitor picked. The words themselves are in `content/text/`. |
| `format.ts` | Turns `2026-07-14T09:00` into `Jul 14, 9:00 am`. |
| `photo-pool.ts` | Decides which photo each card gets. Reads the `photos/` folder inside each dive site and course, plus the shared `content/photos/general` and `hikes`. |
| `images.ts` | Resolves the old website's photo ids to bundled photos in `content/photos/media/`. |
| `event-colors.ts` | Which colour a calendar entry gets (blue for Open Water, and so on). |
| `calendar-layout.ts` | The maths that stops overlapping trips from covering each other on the month grid. |
| `map-layout.ts` | The maths that turns latitude and longitude into a position on the Taiwan map. |
| `taiwan.geo.json` | The outline of Taiwan, as coordinates. |
| `links.ts` | Builds links out to the old fundiverstw.com pages. |

---

## The `$content` in an import line

At the top of a file you'll see:

```ts
import { CONTACT } from '$content/settings'
import { formatEventSpan } from '$engine/format'
```

Those `$` names are shortcuts for folders, so you never write `../../../`. The list lives
in **`vite.alias.ts`**, and it has to be repeated in one more place, which must agree:

- `vite.alias.ts` — the one real list, read by both the build (`vite.config.ts`) and the
  tests (`vitest.config.ts`)
- `tsconfig.json` — the same shortcuts again, so the editor and `npm run check` understand
  them

If you add a folder shortcut to `vite.alias.ts` and forget `tsconfig.json` (or the other
way round), you get a confusing "cannot find module" error. Add it to both.

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

## Where things get built

`npm run build` produces a `dist/` folder. That folder is what Cloudflare serves. It is
generated, it is not in git, and **editing it is always a mistake** — the next build
overwrites it.
