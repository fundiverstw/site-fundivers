# Adding photos

[← Back to start](index.md)

Every photo on the site lives in **one place**: `src/content/photos/`, in a subfolder
that says what the photo is *for*. The site scans these folders when it builds, so in
almost every case you just drop the file in the right folder and it appears — no list of
filenames to keep in sync.

| The photo is… | It goes in | Do you edit any code? |
| --- | --- | --- |
| on a **card** — a dive site, a course, a calendar trip | `src/content/photos/{dive-sites,courses,general}/` | **No.** Just drop the file in. |
| in the **Photos gallery** page | `src/content/photos/gallery/<creature>/` | **No.** The section already exists. |
| a **course cover** or **team/home** photo from the old site | `src/content/photos/media/` | Only to point a page at a different file. |

```
src/content/photos/
  dive-sites/
    bat-cave/          ← photos of Bat Cave (folder = the site's id)
    turtle-island/
  courses/             ← photos of classes
  general/             ← anything; used when nothing better fits
  gallery/
    nudibranchs/       ← the Photos-page gallery, one folder per creature
      photos.yaml      ← what each picture is (optional, see below)
    reef/
  media/               ← old-site photos referenced by id (courses, team, home)
```

---

## Card photos — just drop the file in

Put a picture in the right folder and it appears. There is no list to update.

- To give a **dive site** its cover photo, make a folder named exactly the site's `id`
  and put a photo in it. The first photo alphabetically becomes the cover.
- A trip on the calendar with no matching site photo falls back to `general/`, so it
  never shows an empty box.

---

## Gallery photos — just drop the file in

The Photos page already has a section for **every creature a dive-site guide can
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
does touch code, and it has to come first: a dive-site guide may only use wording that
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

**Use `.webp` or `.avif`.** A photo straight off a camera can be 5 MB; the same photo as
`.webp` is around 200 KB and looks the same on a screen. A visitor on a phone connection
waits far less time for it.

To convert one, on most machines:

```bash
# a card photo, resized to a sensible width
magick photo.jpg -resize 1600x -quality 82 photo.webp

# a gallery photo
magick photo.jpg -resize 2000x -quality 60 photo.avif
```

**Never copy the same photo into two folders.** If a picture needs to move, *move* it —
don't leave a copy behind:

```bash
git mv src/content/photos/general/shark.webp src/content/photos/dive-sites/bat-cave/
```

Two copies means two downloads for every visitor and twice the storage, forever. Git
keeps the old copy even after you delete it.

---

## Course, team and home photos

These are the pictures from the shop's old website. They live in
`src/content/photos/media/` under long machine-generated names, and pages refer to them
by that name (its **id**), not by a folder scan. In `src/content/courses.ts`:

```ts
image: img('b37fef_9c73f7e0bb244570a119812991ef0ab9~mv2.jpg'),
```

`img(…)` looks the id up among the files in `media/` and returns the bundled photo. The
simplest way to change one is to **replace the file in `media/`, keeping its filename** —
the same `img('…')` call then resolves to your new picture. (If you add a new file, its
name minus the extension, with every non-letter/number turned into `_`, must match the id
you pass to `img('…')`.)

---

## Check it worked

```bash
npm run dev
```

Look at the page. A photo that doesn't appear almost always means one of:

- the folder name doesn't exactly match the dive site's `id` (check hyphens);
- a gallery folder name doesn't match the creature's slug in `src/content/marine-life.ts`
  (`moray_eels`, not `moray-eels` or `Moray eels`);
- a caption doesn't show because its key isn't the filename exactly;
- the file extension is `.JPG` and the code expects `.jpg` — rename it lowercase.
