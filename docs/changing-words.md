# Changing words

[← Back to start](index.md)

Almost every word on the site lives in **`src/content/text/`**. There are three files:

```
src/content/text/en.ts       English   ← always edit this one first
src/content/text/zh-TW.ts    中文
src/content/text/ja.ts       日本語
```

---

## Changing a word that already exists

Say the navigation bar says **Gear** and you want it to say **Shop**.

Open `src/content/text/en.ts` and find the line:

```ts
nav: { courses: 'Courses', sites: 'Sites', map: 'Map', photos: 'Photos', travel: 'Travel', calendar: 'Calendar', team: 'Team', gear: 'Gear' },
```

Change only the part inside the quotes:

```ts
nav: { courses: 'Courses', ..., gear: 'Shop' },
```

Save. The page in your browser updates instantly. That's the whole job.

> **Keep the name on the left, change the words on the right.**
> `gear:` is the *name* the code uses to find this word. `'Gear'` is what a visitor
> reads. Renaming `gear:` will break the site; changing `'Gear'` will not.

### If your text has an apostrophe

`'It's great'` confuses the computer, because the middle `'` looks like the end of the
text. Use the curly apostrophe `’` instead:

```ts
tagline: 'It’s great',
```

The rest of the site already uses `’`, so you'll be in good company.

---

## Adding a brand-new piece of text

This is the one place the site is strict with you, on purpose.

**Step 1.** Add it to `en.ts`:

```ts
gear: {
  title: 'Gear Sales, Service & Rental',
  newNotice: 'Closed for stocktake on the 3rd.',   // ← your new line
},
```

**Step 2.** Add the *same name* to `zh-TW.ts` and to `ja.ts`:

```ts
// in zh-TW.ts
newNotice: '3 日盤點公休。',

// in ja.ts
newNotice: '3日は棚卸しのため休業します。',
```

**Step 3.** Use it in the page. Open `src/pages/Gear.svelte` and write `$t.gear.newNotice`
where you want it to appear:

```svelte
<p>{$t.gear.newNotice}</p>
```

`$t` means "the words, in whichever language the visitor picked".

> **What if I skip step 2?**
> `npm run check` will stop you with an error naming the missing language. This is
> deliberate: it is how a half-translated page never reaches a visitor. Add the missing
> line and the error goes away. If you truly don't have a translation yet, put the
> English text in the other two files for now.

---

## The long write-ups

Some text is too long to live in the dictionary, so it sits in its own file — and it is
**English only**.

| Text | File |
| --- | --- |
| The paragraphs on a dive-site page (*Below the Surface*, *Above the Surface*, *How to Get There*) | `src/content/dive-site-guides.ts` |
| The paragraphs on a course page | `src/content/course-guides.ts` |
| The one-line summary on a dive-site card | `tagline` in `src/content/dive-sites.ts` |
| The one-line summary on a course card | `desc` in `src/content/courses.ts` |

In `dive-site-guides.ts`, each dive site is a block that starts with its id:

```ts
'bat-cave': {
  overview: 'Bat Cave is an excellent site suitable for all experience levels…',
  belowSurface: 'Schools of fusiliers and glassfish…',
  aboveSurface: 'The cave is home to a colony of bats…',
  gettingThere: 'Drive north from Keelung…',
  requirements: 'Open Water certification.',
  depthRange: '5–18 m',
  …
},
```

Edit any of the sentences. To start a new paragraph inside one, put a blank line in the
middle by typing `\n\n`:

```ts
overview: 'The first paragraph.\n\nThe second paragraph.',
```

---

## Words you can't change here

Trip names, class dates and prices on the Calendar come from the booking app's database,
not from this project. Changing text here will not change them. See
[How it works](how-it-works.md).
