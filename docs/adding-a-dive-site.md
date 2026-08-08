# Adding a dive site

[← Back to start](index.md)

**A dive site is a folder.** Copy an existing one, rename it, edit what's inside.

```
src/content/dive-sites/turtle-cove/
  site.ts      the row behind /sites and /map — name, coordinates, region, all 3 languages
  details.ts     the write-up on /sites/turtle-cove — all 3 languages (optional)
  photos/      pictures of the site (optional)
```

Only `site.ts` is required; the rest make the page look finished. Nothing outside
the folder needs editing.

The folder name is the site's **id** and the only place it is written. Lowercase,
hyphens instead of spaces. It becomes the web address:
`fundiverstw.com/sites/turtle-cove`.

---

## Step 1 — `site.ts`

```ts
import type { DiveSiteFile } from '../types'

export const site: DiveSiteFile = {
  name: 'Turtle Cove',
  tagline: 'A gentle sandy bay where green turtles come in to feed.',
  latitude: 22.3451,
  longitude: 120.3789,
  region: 'kenting',
  dive_type: 'shore',
  wix_slug: null,
  ja: {
    name: 'タートル・コーブ',
    tagline: 'アオウミガメが餌を求めて訪れる穏やかな砂の入り江。',
  },
  'zh-TW': { name: '海龜灣', tagline: '綠蠵龜前來覓食的溫和沙灣。' },
}
```

| Field | What to put |
| --- | --- |
| `name` | What people should read. Also how the calendar recognises a trip to this site, so it stays English. |
| `tagline` | One sentence, shown on the card. |
| `latitude` / `longitude` | Where it is. Right-click the spot in Google Maps and it shows you both numbers. |
| `region` | Must be one that already exists — see below. |
| `dive_type` | `'shore'` if you walk in, `'boat'` if you ride out. |
| `wix_slug` | The page name on the old fundiverstw.com site, or `null` if there isn't one. |

Save, and the site appears on the **Sites** page and on the **Map**.

For an overseas site, add one more line: `international: true,`.

`npm run check` fails until `ja` and `'zh-TW'` are both filled in — that is how
the Japanese and Chinese pages never quietly fall back to English. If you don't
have translations yet, put the English text in for now.

### If the region doesn't exist yet

Regions live in **`src/content/dive-sites/regions.ts`** — they are not per-site
data, so they are not in the folders. Add the name to the type in
`src/content/dive-sites/types.ts`, then a label in `REGION_META`:

```ts
'penghu-north': { label: 'North Penghu' },
```

The label is all a region stores. The Sites page splits the list into Domestic
and International using the `international` flag on each site, not the region.

Translate the label under `regions:` in `REGIONS_JA` and `REGIONS_ZH_TW`, in the
same file.

If it's a **Taiwan** region, two more things. The map needs to know where to draw
it — add its centre and bounding box to `src/pages/Map.svelte` (`npm run check`
points you there by name). And the map shows a fuller name and a blurb for each
Taiwan region: add the English to `MAP_REGION_TEXT` and the translations under
`mapRegions:`, all in `regions.ts`.

---

## Step 2 — Photos

Make a `photos/` folder inside the site folder and drop a picture in:

```
src/content/dive-sites/turtle-cove/photos/whatever-you-like.webp
```

No code to change. The first photo alphabetically becomes the site's cover; the
rest are used on calendar cards. Use `.webp` or `.avif` — see
[Adding photos](adding-photos.md) for why.

---

## Step 3 — `details.ts`, the write-up

```ts
import type { DiveSiteDetailsFile } from '../types'

export const details: DiveSiteDetailsFile = {
  overview: 'Turtle Cove is a shallow, sheltered bay on the east side…',
  highlights: ['Green turtles', 'Easy shore entry', 'Good for beginners'],
  marineLife: ['Green turtle', 'Parrotfish', 'Sergeant major'],
  depthRange: '3–12 m',
  difficulty: 'Open Water',
  bestSeason: 'April – October',
  waterTemp: '24–29 °C',
  visibility: '10–20 m',
  belowSurface: 'The sand slopes gently away from the beach…',
  aboveSurface: 'The car park sits above a low cliff…',
  gettingThere: 'From Hengchun, follow Route 26 south…',
  requirements: 'Open Water certification.',
  ja: {
    /* every field above except marineLife */
  },
  'zh-TW': {
    /* the same */
  },
}
```

The last four English fields are optional — leave any of them out and that
section simply doesn't appear. Skip the whole file and the page still works; it
just shows less.

**`marineLife` does not go in the translations.** Creature names stay English
because each one links to its section of the photo gallery, and the English name
is what makes that link. The type will not let you restate it, and a test checks
it survives untouched.

---

## Step 4 — Match it to calendar trips (optional)

When a trip appears on the calendar it's just a title like *"Fun Dive — Turtle
Cove"*. To make that card use your new photos, add a pattern to
`EVENT_TITLE_MATCHERS` at the bottom of
**`src/content/dive-sites/index.ts`**:

```ts
{ id: 'turtle-cove', re: /turtle\s*cove/i },
```

`/turtle\s*cove/i` means *"the word turtle, then any spaces, then cove, in upper
or lower case"*. Put more specific patterns **above** more general ones.

This one list is deliberately not split into the folders: the order *between*
sites is the whole point, and an order cannot be written one folder at a time.

Skip this and the card gets a generic dive photo. Nothing breaks.

---

## Before you publish

```bash
npm run verify
```

This checks the types, runs the linter, and opens the site in a real browser. The
tests know about dive sites specifically: they will tell you if the region does
not exist, if the coordinates land in the wrong ocean, if a folder holds no
`site.ts`, or if a `details.ts` has a field its translation is missing. See
[How we check the site still works](testing.md).

The most common mistakes, and what they look like:

| The error mentions… | You probably… |
| --- | --- |
| `Type '\'turtle-cove\'' is not assignable to type 'Region'` | used an id where a region goes, or invented a region without adding it to the list |
| `Property 'latitude' is missing` | forgot a field |
| `no dive site is called 'turtle_cove'` | the folder name is not a valid id — check hyphens |
| `turtle-cove has no site.ts` | made the folder but not the file |
| `dive-site-details/ja does not match the English shape` | a field missing from the `ja` block; the message names it |
| `expected 22.3 to be less than 30` | latitude and longitude are the wrong way round |

---

## Deleting a dive site

Delete the folder. The row, the write-up, all three languages and the photos go
with it. If a calendar matcher still names it, the tests say so.
