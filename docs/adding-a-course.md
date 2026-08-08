# Adding a course

[← Back to start](index.md)

A course is spread across six files. That sounds like a lot, and it is the price of
having every course page exist in three languages with a photo, a write-up and a link to
the calendar. Work top to bottom and the tests will tell you what you forgot.

Every one of the six is keyed by the same string — the course's **id**. Pick it once,
before you start.

---

## Step 0. Choose the id

The id is the whole identity of a course. It is:

- the address: `fundiverstw.com/courses/<id>`
- the key into `course-guides.ts`, where the long write-up lives
- the key into the Japanese and Chinese overlays
- the folder name for that course's photos, `src/content/photos/courses/<id>/`

Lowercase letters, numbers and hyphens only. Match the existing ones:
`padi-deep-diver-specialty`, `padi-wreck-specialty`, `padi-efr-course`.

**Once a course is live, changing its id changes its web address**, so anyone who
bookmarked or linked the old one lands on the Not Found page. Pick it carefully now
rather than tidying it later.

---

## Step 1. The card — `src/content/courses.ts`

This is the tile on the `/courses` grid. Add an entry where you want it to appear; the
grid follows the order of this list.

```ts
{
  title: 'PADI Wreck Specialty',
  id: 'padi-wreck-specialty',
  image: img('wreck_specialty'),
  desc: 'Explore sunken ships and structures safely, survey a wreck, map it, and dive it with a plan.',
},
```

`desc` is one line — it is clamped to three lines on the card, and it is also what the
detail page shows if the guide has no `intro`.

### The photo

`img('…')` looks up a file in `src/content/photos/media/` **by its filename**, minus the
extension, with every character that is not a letter or a number turned into `_`. So a
file called `wreck-specialty.webp` can never be found by `img('wreck-specialty')` — the
hyphen becomes an underscore in the lookup and matches nothing. Name the file with
underscores: `wreck_specialty.webp`, `img('wreck_specialty')`.

Get this wrong and there is no error. The card just renders the "image coming soon"
placeholder — which is why `courses.test.ts` checks that every course resolves a photo,
and names the course that doesn't.

See [Adding photos](adding-photos.md) for the rest.

---

## Step 2. The write-up — `src/content/course-guides.ts`

This is the detail page. Copy the nearest existing specialty and edit it — the shape is
fiddly and copying is faster than reading the type.

Three fields are not prose and deserve a thought each:

| Field | What it does |
| --- | --- |
| `depth` | Only set it when the certification itself carries a depth limit (Open Water 18 m, Deep 40 m). A specialty you dive within your existing limits gets `null`, which hides the row rather than printing an empty one. |
| `next` | Two course ids, shown as "where to next" at the bottom of the page. They must exist, and must not be this course. |
| `matchCodes` | How the page finds its own dates in the calendar — see below. |

`subsections` controls how the blocks are staggered down the page against the four
photos. Leave it out and the page uses a sensible default.

### `matchCodes`, and why most specialties have none

Upcoming sessions come from the booking app, where each one carries a short code typed
by hand in `admin_title` — `OW`, `aow`, `deep`. `matchCodes` lists the codes that belong
to this course, lowercase.

Most specialties have `matchCodes: []`, because the shop does not schedule them as named
classes — they run on request. That is deliberate, and it means the page always says "no
scheduled dates". If a course *is* scheduled and its page still says that, the code is
missing or misspelled here. Ask whoever runs the booking app what they actually type.

Two courses must never claim the same code, or one session shows up on both pages. A test
enforces that.

---

## Step 3. The translations — four more files

| File | What goes in it |
| --- | --- |
| `courses.ja.ts` / `courses.zh-TW.ts` | The card's title and one-line description |
| `course-guides.ja.ts` / `course-guides.zh-TW.ts` | The whole write-up, prose only |

Unlike news posts, course translations are **not optional**. `npm run test:unit` fails if
an overlay is missing an entry, missing a field, blank, or has an array of a different
length than the English. This is on purpose: a half-translated course page renders a
paragraph of English in the middle of a Japanese page, and nobody notices.

The overlays carry prose only. `subsections`, `matchCodes`, `next` and `depth` stay in
the English file and are merged in — the type will not let you put them in an overlay,
and a test checks they survive the merge unchanged.

---

## Step 4. Check it

```bash
npm run verify
```

What each failure means:

| It says | You forgot |
| --- | --- |
| `these courses would render an empty detail page` | Step 2 — the guide |
| `padi-… has no cover photo` | Step 1 — the filename/`img()` mismatch above |
| `course-guides/ja does not match the English shape` | Step 3, and it names the field |
| `…next points at '…', which is not a course` | A typo in `next` |
| `'deep' is claimed by both … and …` | Two courses want the same `matchCodes` |

Then look at it: `npm run dev`, open `/courses`, click the new card, and switch the
language with the globe in the top bar. Check all three.

---

## Optional: photos on the detail page

The detail page staggers four photos down the write-up. By default it uses the cover plus
three stable picks from the shared course photo pool.

To give a course its own, make `src/content/photos/courses/<id>/` and drop photos in. No
manifest, no code change — the folder is found at build time.

You can also pin all four explicitly with an `images: [...]` field on the card, which is
what the Open Water course does.
