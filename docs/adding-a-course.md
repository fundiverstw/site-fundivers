# Adding a course

[← Back to start](index.md)

**A course is a folder.** Copy an existing one, rename it, edit two files.

```
src/content/courses/padi-wreck-specialty/
  card.ts      the tile on /courses — title, blurb, cover photo, all 3 languages
  details.ts     the write-up on /courses/<id> — all 3 languages
  photos/      optional: pictures for the detail page
```

Nothing outside the folder needs editing. The build finds it, and the grid
reorders itself.

---

## Step 0. Choose the folder name

The folder name is the course's **id**, and it is the only place that id is
written. It is:

- the address: `fundiverstw.com/courses/<id>`
- how `details.ts` is matched to `card.ts`
- what other courses point at in their `next` list

Lowercase letters, numbers and hyphens only. Match the existing ones:
`padi-deep-diver-specialty`, `padi-wreck-specialty`, `padi-efr-course`.

**Once a course is live, renaming its folder changes its web address**, so anyone
who bookmarked or linked the old one lands on the Not Found page. Pick it
carefully now rather than tidying it later.

---

## Step 1. `card.ts` — the tile on /courses

```ts
import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 140,
  title: 'PADI Wreck Specialty',
  image: mediaIdLocal('wreck_specialty'),
  desc: 'Explore sunken ships and structures safely, survey a wreck, map it, and dive it with a plan.',
  ja: {
    title: 'PADIレック・スペシャルティ',
    desc: '沈船や水中構造物を安全に探検。レックをサーベイし、地図を描き、計画を立てて潜ります。',
  },
  'zh-TW': {
    title: 'PADI 沉船專長',
    desc: '安全探索沉船與水下構造物，學會勘查沉船、繪製地圖，並依計畫下潛。',
  },
}
```

`desc` is one line — it is clamped to three lines on the card, and it is also
what the detail page shows if `details.ts` has no `intro`.

**`order`** is where the tile sits on the grid. Folders come off the disk
alphabetically, which is not the order the shop wants to sell in, so the sequence
has to be stated. They are spaced by ten, so to slot a course between 130 and 140
give it 135 and leave everything else alone. No two courses may share a number —
a test says so, and names both.

### The cover photo

`mediaIdLocal('…')` looks up a file in `src/content/photos/media/` **by its
filename**, minus the extension, with every character that is not a letter or a
number turned into `_`. So a file called `wreck-specialty.webp` can never be
found by `mediaIdLocal('wreck-specialty')` — the hyphen becomes an underscore in
the lookup and matches nothing. Name the file with underscores.

Get this wrong and there is no error. The card just renders the "image coming
soon" placeholder — which is why the tests check that every course resolves a
photo, and name the course that doesn't.

---

## Step 2. `details.ts` — the detail page

Copy the nearest existing specialty and edit it. The shape is fiddly and copying
is faster than reading the type.

The English fields come first, then a `ja:` block and a `'zh-TW':` block holding
the same prose. All three languages in one file, so a rewrite is one file to
open.

Four fields are not prose and deserve a thought each:

| Field | What it does |
| --- | --- |
| `depth` | Only set it when the certification itself carries a depth limit (Open Water 18 m, Deep 40 m). A specialty you dive within your existing limits gets `null`, which hides the row rather than printing an empty one. |
| `next` | Two course ids, shown as "where to next" at the bottom of the page. They must exist, and must not be this course. |
| `matchCodes` | How the page finds its own dates in the calendar — see below. |
| `subsections` | How the blocks are staggered down the page against the photos. Leave it out for a sensible default. |

Those four stay in the English part only. **Do not repeat them inside `ja` or
`'zh-TW'`** — the type will not let you, and a test checks they survive
untouched. A translation that restated `next` would send a Japanese reader to the
Not Found page while the page still looked right.

### `matchCodes`, and why most specialties have none

Upcoming sessions come from the booking app, where each one carries a short code
typed by hand in `admin_title` — `OW`, `aow`, `deep`. `matchCodes` lists the
codes that belong to this course, lowercase.

Most specialties have `matchCodes: []`, because the shop does not schedule them
as named classes — they run on request. That is deliberate, and it means the page
always says "no scheduled dates". If a course *is* scheduled and its page still
says that, the code is missing or misspelled here. Ask whoever runs the booking
app what they actually type.

Two courses must never claim the same code, or one session shows up on both
pages. A test enforces that.

---

## Step 3. Photos on the detail page (optional)

The detail page staggers four photos down the write-up. By default it uses the
cover plus three stable picks from the shared course photo pool.

To give a course its own, make a `photos/` folder inside the course folder and
drop pictures in. No manifest, no code change — the folder is found at build
time.

You can also pin all four explicitly with an `images: [...]` field in `card.ts`,
which is what the Open Water course does.

---

## Step 4. Check it

```bash
npm run verify
```

What each failure means:

| It says | You forgot |
| --- | --- |
| `these courses would render an empty detail page` | `details.ts` |
| `padi-… has no cover photo` | The filename/`mediaIdLocal()` mismatch above |
| `course-details/ja does not match the English shape` | A field in the `ja:` block, and it names which |
| `two courses claim order 140` | Step 1 — pick a free number |
| `…next points at '…', which is not a course` | A typo in `next` |
| `'deep' is claimed by both … and …` | Two courses want the same `matchCodes` |

Unlike a news post, a course cannot ship half-translated: the tests fail if a
`ja` or `'zh-TW'` block is missing a field, is blank, or has a list of a
different length than the English. That is on purpose — a half-translated course
page renders a paragraph of English in the middle of a Japanese page, and nobody
notices.

Then look at it: `npm run dev`, open `/courses`, click the new card, and switch
the language with the globe in the top bar. Check all three.

---

## Deleting a course

Delete the folder. That is the whole job — the card, the write-up, all three
languages and the photos go with it, and nothing is left pointing at a course
that no longer exists.

The one thing to check: if another course listed this one in its `next`, the
tests will tell you, by name.
