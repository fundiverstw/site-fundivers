# Adding photos

[← Back to start](index.md)

There are two separate places photos live, depending on what the photo is *for*.

| The photo is… | It goes in | Do you edit any code? |
| --- | --- | --- |
| on a **card** — a dive site, a course, a calendar trip | `src/content/photos/` | **No.** Just drop the file in. |
| in the **Photos gallery** page | `public/imgs/gallery/` | Yes, one line. |

---

## Card photos — just drop the file in

```
src/content/photos/
  dive-sites/
    bat-cave/          ← photos of Bat Cave
    turtle-island/
  courses/             ← photos of classes
  general/             ← anything; used when nothing better fits
```

Put a picture in the right folder and it appears. There is no list to update. The site
scans these folders when it builds.

- To give a **dive site** its cover photo, make a folder named exactly the site's `id`
  and put a photo in it. The first photo alphabetically becomes the cover.
- A trip on the calendar with no matching site photo falls back to `general/`, so it
  never shows an empty box.

---

## Gallery photos — drop the file in, then list it

**Step 1.** Put the file in `public/imgs/gallery/reef/` or
`public/imgs/gallery/nudibranchs/`.

**Step 2.** Open `src/content/photo-gallery.ts` and add its path to the matching list:

```ts
const reef: string[] = [
  '/imgs/gallery/reef/b37fef_f39cba46f8f04ec5ba15f50a680e51ba_mv2.avif',
  '/imgs/gallery/reef/my-new-photo.avif',      // ← added
]
```

Note the path starts at `/imgs/`, **not** at `public/`. That's not a typo — everything in
`public` is served from the top of the website.

---

## Getting the file right

**Use `.webp` or `.avif`.** A photo straight off a camera can be 5 MB; the same photo as
`.webp` is around 200 KB and looks the same on a screen. A visitor on a phone connection
waits far less time for it, and the whole project is only about 17 MB today.

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

## Course cover photos

These work differently. They are the pictures from the shop's old website, stored in
`public/imgs/media/` with long machine-generated names, and referenced in
`src/content/courses.ts` like this:

```ts
image: img('b37fef_9c73f7e0bb244570a119812991ef0ab9~mv2.jpg'),
```

The `img(…)` bit turns that long name into the local file. If you want to change a
course's photo, the simplest path is to put your own file in `public/imgs/media/` and
replace the whole call with the plain path:

```ts
image: '/imgs/media/my-open-water-photo.webp',
```

---

## Check it worked

```bash
npm run dev
```

Look at the page. A photo that doesn't appear almost always means one of:

- the folder name doesn't exactly match the dive site's `id` (check hyphens);
- the path in `photo-gallery.ts` starts with `public/` instead of `/imgs/`;
- the file extension is `.JPG` and the code expects `.jpg` — rename it lowercase.
