# Adding a dive site

[← Back to start](index.md)

Four steps. Only the first is required; the rest make the site look finished.

Pick an **id** first and use the same one everywhere. It must be lowercase, with hyphens
instead of spaces, e.g. `turtle-cove`. It becomes the web address of the page:
`fundiverstw.com/sites/turtle-cove`.

---

## Step 1 — Put it on the list

Open **`src/content/dive-sites.ts`**. Copy an existing block and change it:

```ts
{
  id: 'turtle-cove',
  name: 'Turtle Cove',
  tagline: 'A gentle sandy bay where green turtles come in to feed.',
  latitude: 22.3451,
  longitude: 120.3789,
  region: 'kenting',
  dive_type: 'shore',
  wix_slug: null,
},
```

| Field | What to put |
| --- | --- |
| `id` | The id you picked. Lowercase, hyphens. |
| `name` | What people should read. |
| `tagline` | One sentence, shown on the card. |
| `latitude` / `longitude` | Where it is. Right-click the spot in Google Maps and it shows you both numbers. |
| `region` | Must be one that already exists — see below. |
| `dive_type` | `'shore'` if you walk in, `'boat'` if you ride out. |
| `wix_slug` | The page name on the old fundiverstw.com site, or `null` if there isn't one. |

That's it — save, and the site appears on the **Sites** page and on the **Map**.

For an overseas site, add one more line: `international: true,`.

### Then translate the name and tagline

Add the same id to **`src/content/dive-sites.zh-TW.ts`** and **`src/content/dive-sites.ja.ts`**,
under `sites:`, with the translated name and tagline:

```ts
// in dive-sites.zh-TW.ts
'turtle-cove': { name: '海龜灣', tagline: '綠蠵龜前來覓食的溫和沙灣。' },

// in dive-sites.ja.ts
'turtle-cove': { name: 'タートル・コーブ', tagline: 'アオウミガメが餌を求めて訪れる穏やかな砂の入り江。' },
```

`npm run check` fails until both are there — that is how the Japanese and Chinese pages
never quietly fall back to English. If you don't have translations yet, put the English text
in for now.

### If the region doesn't exist yet

Regions are the list at the top of the same file (`keelung`, `kenting`, `palau`…). To add
one, add its name to the type, then add a label for it in `REGION_META`:

```ts
'penghu-north': { label: 'North Penghu' },
```

The label is all a region stores. The Sites page splits the list into Domestic and
International using the `international` flag on each dive site, not the region.

A new region also needs its label translated: add it under `regions:` in
`dive-sites.zh-TW.ts` and `dive-sites.ja.ts`.

If it's a **Taiwan** region, two more things. The map needs to know where to draw it —
add its centre and bounding box to `src/pages/Map.svelte` (`npm run check` points you there
by name). And the map shows a fuller name and a blurb for each Taiwan region: add the
English to `MAP_REGION_TEXT` in `dive-sites.ts`, then the translations under `mapRegions:`
in the two overlay files.

---

## Step 2 — Give it a photo

Make a folder named **exactly the id** and drop a picture in:

```
src/content/photos/dive-sites/turtle-cove/whatever-you-like.webp
```

No code to change. The first photo (alphabetically) becomes the site's cover. Add more
and they'll be used on calendar cards. Use `.webp` or `.avif` — see
[Adding photos](adding-photos.md) for why.

---

## Step 3 — Write the page

Open **`src/content/dive-site-guides.ts`** and add a block keyed by the same id:

```ts
'turtle-cove': {
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
},
```

The last five are optional — leave any of them out and that section simply doesn't
appear. Skip this whole step and the page still works; it just shows less.

Then add the same block to **`src/content/dive-site-guides.zh-TW.ts`** and
**`src/content/dive-site-guides.ja.ts`**, keyed by the same id — the same fields, in the
other language, **without the `marineLife` line** (creature names stay English so their
photo links keep working). `npm run check` and the tests will name any field you miss.

---

## Step 4 — Match it to calendar trips (optional)

When a trip appears on the calendar it's just a title like *"Fun Dive — Turtle Cove"*.
To make that card use your new photos, add a pattern at the **bottom of
`src/content/dive-sites.ts`**, in `EVENT_TITLE_MATCHERS`:

```ts
{ id: 'turtle-cove', re: /turtle\s*cove/i },
```

`/turtle\s*cove/i` means *"the word turtle, then any spaces, then cove, in upper or lower
case"*. Put more specific patterns **above** more general ones.

Skip this and the card gets a generic dive photo. Nothing breaks.

---

## Before you publish

```bash
npm run verify
```

This checks the types, runs the linter, and opens the site in a real browser. The tests
know about dive sites specifically: they will tell you if the id is repeated, if the
region does not exist, if the coordinates land in the wrong ocean, if the photo folder is
misspelled, or if the guide is keyed to a site that is not there. See
[How we check the site still works](testing.md).

If nothing is red, you're good. Then see [Publishing](publishing.md).

The most common mistakes, and what they look like:

| The error mentions… | You probably… |
| --- | --- |
| `Type '\'turtle-cove\'' is not assignable to type 'Region'` | used an id where a region goes, or invented a region without adding it to the list |
| `Property 'latitude' is missing` | forgot a field, or left a trailing comma in the wrong place |
| Your site doesn't appear at all | forgot the comma after the previous `}` in the list |
| The photo doesn't show | the folder name doesn't exactly match the `id` |
| `no dive site with id '…'` | the guide in `dive-site-guides.ts` is keyed to a misspelled id |
| `expected 22.3 to be less than 30` | latitude and longitude are the wrong way round |
