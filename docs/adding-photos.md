# Adding photos

[← Back to start](index.md)

Every photo on the site lives in **one place**: `src/content/photos/`, in a subfolder
that says what the photo is *for*. The site scans these folders when it builds, so in
almost every case you just drop the file in the right folder and it appears — no list of
filenames to keep in sync.

| The photo is… | It goes in | Do you edit any code? |
| --- | --- | --- |
| on a **card** — a dive site, a course, a calendar trip | `src/content/photos/{dive-sites,courses,general}/` | **No.** Just drop the file in. |
| in the **Photos gallery** page | `src/content/photos/gallery/<section>/` | **No,** unless you add a whole new section. |
| a **course cover** or **team/home** photo from the old site | `src/content/photos/media/` | Only to point a page at a different file. |

```
src/content/photos/
  dive-sites/
    bat-cave/          ← photos of Bat Cave (folder = the site's id)
    turtle-island/
  courses/             ← photos of classes
  general/             ← anything; used when nothing better fits
  gallery/
    nudibranchs/       ← the Photos-page gallery, one folder per section
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

Put the file in `src/content/photos/gallery/reef/` or
`src/content/photos/gallery/nudibranchs/`. It shows up on the Photos page automatically,
ordered by filename within its section — there is no path to type out anymore.

The one time you touch code is if you add a **brand-new section** (say, `wrecks/`): make
the folder, drop photos in, then add its name to `SECTION_ORDER` in
`src/content/photo-gallery.ts` so the page knows where to show it. A matching label goes
in the three `src/content/text/*.ts` files under `photos.sections`.

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
- a new gallery **section** folder wasn't added to `SECTION_ORDER`;
- the file extension is `.JPG` and the code expects `.jpg` — rename it lowercase.
