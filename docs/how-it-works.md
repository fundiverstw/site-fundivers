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

The navigation is a separate list, in `src/content/navigation.ts`:

```ts
export const SECTIONS: NavSection[] = [
  {
    id: 'education',
    href: '/education',
    key: 'education',
    items: [
      { href: '/courses', key: 'courses' },
      { href: '/sealife', key: 'life' },
    ],
  },
  …
]
```

Four sections, each a hub page **and** a dropdown listing what is under it. Three things
read that one list — the bar, the mobile menu, and the hub pages themselves — so a page
cannot end up in the menu and missing from its hub. `key` is a key in the `nav` block of
`src/content/text/`, so no label is written here.

The bar used to be nine flat links, which was its limit: two browser tests
(`the whole navigation fits` and `the bar stays on one row, in every language`) fail if
it runs off a 1280px screen or wraps onto a second row. Watch the second one in
particular: a Japanese label is half again as wide as its English twin, and CJK text
breaks between any two characters, so a bar that has run out of room does not overflow —
it quietly grows to two rows. Four sections leave real headroom, but a fifth is a
decision, not a line of code.

Pages that are not in any section are reached from the footer's link map, built from
`FOOTER_LINKS` in the same file:

| Page | Reached from |
| --- | --- |
| Services, Gear, Cycling, Hiking, Websites | The footer's **More** column (`src/components/Footer.svelte`); Gear, Cycling and Hiking also from the cards on the Services page |
| Quiz | The card at the top of the Sea Life page, and the Education hub — it is the same photographs |
| A single Logbook story | Its card on the feed (`/logbook/<slug>`) |

The staff roster (`/team`, under About Us) is in the bar *and* in the sign-off at the
bottom of every page ("Proudly created by the FunDivers **Team** in Taipei, Taiwan", in
`src/components/Footer.svelte`).

**If you remove a link, check what else pointed at that page first.** A page whose last
link goes is still there, still builds, still passes the type checker — and no visitor
will ever find it. `e2e/footer.spec.ts` and `e2e/sections.spec.ts` exist to catch
precisely that.

### The route table

The addresses the site answers are listed in `src/engine/routes.ts` (`ROUTE_PATHS`), and
the components that serve them are in `App.svelte`. The two are kept in step by the type
rather than by care: App's table is a `Record<RouteKey, …>`, so an address with no
component, or a component for an address that is not a route, fails `npm run check`.

The keys starting with a `:` — `:site`, `:course`, `:news`, and `:missing` for the 404 —
are the detail pages. They cannot be written as plain paths because one component serves many
addresses: `/logbook/reef-cleanup` and `/logbook/padi-conference` are
both `:news`, which reads the slug back off the address and looks the story up.

**A dive site sits at the root of the site.** `/bat-cave`, not `/sites/bat-cave` — the
list page keeps `/sites`. So a dive-site id and a page path are competing for the same
namespace, and a page wins. That means a site whose folder happened to be named `map` or
`radio` would never open: no error, no 404, just the wrong page under the right address,
with the site still listed and still linked. Nothing else can catch that, so
`src/engine/routes.test.ts` does, on every commit.

`routeKey` only sends an address to `:site` when a folder of that name actually exists —
the ids come from `src/content/dive-sites/ids.ts`, which globs the folder names without
importing what is in them. An id that does not exist gets the 404 rather than a detail
page apologising for itself, which is the better of the two answers: a search engine can
tell them apart.

### Addresses that moved

Several addresses changed when the site was reorganised, and the old ones are still in
bookmarks, in search results and on the shop's old Wix site. `MOVED` and `movedTo` in
`src/engine/router.ts` rewrite them rather than letting them 404:

| Old | New |
| --- | --- |
| `/photos` | `/sealife` |
| `/news`, `/news/<slug>`, `/surface-interval`, `/surface-interval/<slug>` | `/logbook`, `/logbook/<slug>` |
| `/testimonials`, `/reviews` | `/reputation` |
| `/sites/<id>` | `/<id>` |

The rewrite is a `replaceState`, not a push, so the Back button returns to wherever the
visitor came from rather than bouncing off the old address again. Any anchor comes with
it: `/photos#nudibranchs` lands on `/sealife#nudibranchs`. If you rename another page, add
a row there and a case to `movedTo` in `src/engine/router.test.ts`.

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
| `quiz.ts` | Builds the /quiz flashcard deck out of the gallery photos, and shuffles it. |
| `photo-pool.ts` | Decides which photo each card gets — a dive site's or course's cover, and the pool an event card draws from. Reads the `photos/` folder inside each dive site and course, plus the shared `content/photos/general` and `hikes`. |
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
