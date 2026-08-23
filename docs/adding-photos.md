# Adding photos

[← Back to start](index.md)

A photo lives **with the thing it is a photo of**. Pictures of Bat Cave sit in
Bat Cave's folder; pictures of the Open Water course sit in the Open Water
course's folder. The site scans these folders when it builds, so in almost every
case you drop the file in and it appears — no list of filenames to keep in sync.

| The photo is… | It goes in | Do you edit any code? |
| --- | --- | --- |
| of a **dive site** | `src/content/dive-sites/<site-id>/photos/` | **No.** Just drop the file in. |
| of a **course** | `src/content/courses/<course-id>/photos/` | **No.** |
| of a **news event** | `src/content/news/<folder>/` | Only to caption it — see [Adding a news post](adding-news.md). |
| for the **Photos gallery** page | `src/content/photos/gallery/<creature>/` | **No.** The section already exists. |
| a **calendar trip** with no site of its own | `src/content/photos/general/` | **No.** |
| a **team headshot** | `src/content/photos/team/` | Yes — one line in `src/content/team.ts`. |

```
src/content/
  dive-sites/
    bat-cave/
      site.ts
      details.ts
      photos/          ← photos of Bat Cave
  courses/
    padi-open-water-course/
      card.ts
      details.ts
      photos/          ← photos of that class
  photos/
    general/           ← anything; used when nothing better fits
    hikes/
    cycling/           ← the one bike-tour photo
    team/              ← headshots
    gallery/
      nudibranchs/     ← the Photos-page gallery, one folder per creature
        photos.yaml    ← what each picture is (optional, see below)
      reef/
```

The folders left under `photos/` are the ones that belong to no single dive site
or course: the shared fallbacks, the gallery, and the handful a page names
directly.

---

## Card photos — just drop the file in

Put a picture in the right folder and it appears. There is no list to update.

- To give a **dive site** or a **course** its cover photo, put a photo in `photos/`
  inside that site's or course's folder. The first one alphabetically becomes the cover,
  so name the one you want on the tile to sort first (`…_0.jpg`).
- A trip on the calendar with no matching site photo falls back to `general/`, so it
  never shows an empty box.

---

## Gallery photos — just drop the file in

The Photos page already has a section for **every creature a dive site’s `details.ts` can
mention** — about sixty of them. Most say *"Photos coming soon"*, because there are no
pictures in them yet. Your job is to fill them.

Each section is a folder named after the creature, lowercased with underscores:

| The chip on a dive-site page | The folder to create | The link it answers |
| --- | --- | --- |
| Moray eels | `gallery/moray_eels/` | `/photos#moray_eels` |
| Sea fans | `gallery/sea_fans/` | `/photos#sea_fans` |
| Shrimp and crabs | `gallery/shrimp_and_crabs/` | `/photos#shrimp_and_crabs` |

Make the folder, drop photos in, and the section stops saying "coming soon" by itself.
**There is no code to edit** — not even for a creature nobody has photographed yet,
because the section is already there waiting.

The full list of creatures, and the exact folder name each one wants, is
`src/content/marine-life.ts`. Adding a *new* creature to that list is the one thing that
does touch code, and it has to come first: a `details.ts` may only use wording that
appears there, and a test fails the build if it doesn't. That is what keeps every chip on
a dive-site page clickable.

If you name a folder something no section expects — `moray-eels` with a hyphen, say — the
photos silently never appear. A test catches that too: run `npm test`.

---

## Telling people what they're looking at

Beside the photos, add a **`photos.yaml`**. When somebody opens a picture, whatever you
put here appears next to it: what the animal is, where and when you took it, what camera
settings you used.

```yaml
# src/content/photos/gallery/moray_eels/photos.yaml
giant-moray-longdong.webp:
  species: Gymnothorax javanicus
  commonName: Giant moray
  site: Long Dong (82.5)
  taken: 2025-08-14
  depth: 12 m
  camera: Olympus TG-6
  lens: 60 mm macro
  settings: f/8 · 1/160 s · ISO 200
  photographer: Ming
  notes: 'Free-swimming at dusk, which this species rarely does in daylight.'
```

Every field is optional — leave out what you don't know and that row just doesn't show.
The whole file is optional too; without it the photos still appear, just with no caption.
Each folder starts with a commented-out example you can copy.

**Two rules, and they are the only two:**

1. The key must be the filename **exactly**, extension included. Rename the photo and the
   caption stops finding it.
2. If a value contains **a colon followed by a space**, put quotes around it. Otherwise
   YAML reads the rest of the line as a new field and the build stops with an error naming
   the file.

---

## Getting the file right

**The build handles the sizing. Give it the big copy.**

When the site is built, every photo you have added is re-saved at several widths — 384,
480, 640, 768, 960 and 1216 pixels — and each `<img>` on the page is given the whole set
to choose from. A phone showing a small tile takes the 384; a laptop showing a hero takes
the 1216. Nobody downloads pixels they are not going to paint, which is most of why the
site is quick on a phone.

So the old advice to shrink a photo before adding it is now exactly backwards: shrinking it
to 1600 and then letting the build shrink it again just loses detail twice. What the build
cannot do is invent detail that was never there — it never enlarges a photo past its own
width, so a 600px file stays a 600px file and looks soft on a large screen.

**Add the largest good copy you have, at least 1216 pixels wide.** Straight off the camera
is fine. If the file is enormous and you want it smaller first, keep the width and go easy
on the quality:

```bash
# keep the width, just take the weight off — the build does the rest
magick photo.jpg -resize 2400x -quality 88 photo.webp
```

You do not need to match anything about the format or the quality to the rest of the site.
The build re-encodes everything to AVIF at its own settings; your file is the source it
works from, not the thing that gets sent.

**Never copy the same photo into two folders.** If a picture needs to move, *move* it —
don't leave a copy behind:

```bash
git mv src/content/photos/general/shark.webp src/content/dive-sites/bat-cave/photos/
```

Two copies means two downloads for every visitor and twice the storage, forever. Git
keeps the old copy even after you delete it.

---

## The few photos a page names outright

Almost everything is a folder scan. The exceptions are the one-off pictures that
belong to a single page — a team headshot, the bike-tour hero — and those are
imported by name, straight from the file:

```ts
import fabio from './photos/team/fabio.jpg?responsive'
```

`?responsive` is what turns the file into the set of sized copies every `<img>` on
the site expects; without it you get a bare URL and the page will not accept it.
To change one of these pictures, either drop the new file in beside it and change
the import, or replace the file keeping its name.

The home page's tiles and its reef row are **not** in this category: each one asks
for the cover of the thing it links to (`courseImage('padi-open-water-course')`,
`siteImage('palau')`, `galleryCover('octopus')`), so filling those folders is all
it takes to change what the front page shows.

Everything the shop's old Wix site used to supply is gone — there is no longer a
`media/` folder or an id lookup. If you find `mediaIdLocal` anywhere, it is stale.

---

## Check it worked

```bash
npm run dev
```

Look at the page. A photo that doesn't appear almost always means one of:

- the photos went next to `site.ts` instead of inside that site's `photos/` folder;
- a gallery folder name doesn't match the creature's slug in `src/content/marine-life.ts`
  (`moray_eels`, not `moray-eels` or `Moray eels`);
- a caption doesn't show because its key isn't the filename exactly;
- the file extension is `.JPG` and the code expects `.jpg` — rename it lowercase.
