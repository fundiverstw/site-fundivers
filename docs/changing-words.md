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
nav: { courses: 'Courses', sites: 'Sites', map: 'Map', photos: 'Photos', travel: 'Travel', calendar: 'Calendar', news: 'News', gear: 'Gear', services: 'Services', radio: 'Radio show' },
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

The rest of the site already uses `’`.

---

## Text with a `{word}` in curly brackets

A few sentences have something in curly brackets:

```ts
proudly: 'Proudly created by the FunDivers {team} in Taipei, Taiwan',
day: 'Day {n}',
sent: 'If it didn’t, email {email} directly.',
fromPrice: 'From {price}',
```

That is a **hole the code fills in**. `{team}` becomes a link to the Team page, `{n}`
becomes the day number, `{email}` becomes the shop's address as a clickable link,
`{price}` becomes the formatted amount. They are not words a visitor ever reads.

**You may move a `{word}` anywhere in the sentence, and you must keep it.** Moving it is
the point — Japanese and Chinese put the team in a different place than English does:

```ts
// en.ts
proudly: 'Proudly created by the FunDivers {team} in Taipei, Taiwan',
// ja.ts
proudly: '台湾・台北で FunDivers {team} が心を込めて制作',
// zh-TW.ts
proudly: '由 FunDivers {team}在台灣台北用心打造',
```

`{price}` is the clearest case of why the hole exists at all: English says "From NT$8,000"
and puts the amount last, while Japanese and Chinese say "NT$8,000〜" and "NT$8,000起" and
put it first. A plain word like `From` could not be translated correctly, because there is
no one place to print it.

Delete one by accident and the sentence still reads perfectly — with the link silently
gone. For `{team}` that would leave the Team page with **no way to reach it**, in that
language only. `npm run test:unit` checks every translation keeps the same holes as the
English, so this cannot reach a visitor, but it is worth knowing why the test shouts at
you.

Also do not translate the word *inside* the brackets. `{team}` is a name the code looks
for; `{團隊}` is just text.

---

## Adding a brand-new piece of text

This is the one place where `npm run check` will stop you, on purpose.

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

Some text is too long to live in the dictionary, so it sits with the thing it describes.
**Its translations sit in the same file, right below the English** — one file to open, one
file to review.

| Text | Where |
| --- | --- |
| A dive site's name and one-line summary | `src/content/dive-sites/<id>/site.ts` |
| The paragraphs on a dive-site page (*Below the Surface*, *Above the Surface*, *How to Get There*) | `src/content/dive-sites/<id>/details.ts` |
| A course's title and one-line summary | `src/content/courses/<id>/card.ts` |
| The paragraphs on a course page | `src/content/courses/<id>/details.ts` |
| A news post's headline, summary and write-up | `src/content/news/<folder>/article.ts` — **allowed to be incomplete**, see [Adding a news post](adding-news.md) |
| A team member's bio | `src/content/team.ts` |
| The creature names on the Photos page and the dive-site chips | `src/content/marine-life.ts` |
| A region's label and the map blurb | `src/content/dive-sites/regions.ts` |

The English comes first, then a `ja` block and a `'zh-TW'` block holding the same fields:

```ts
export const details: DiveSiteDetailsFile = {
  overview: 'Bat Cave is an excellent site suitable for all experience levels…',
  belowSurface: 'Schools of fusiliers and glassfish…',
  aboveSurface: 'The cave is home to a colony of bats…',
  marineLife: ['Moray eels', 'Nudibranchs'],
  …
  ja: {
    overview: 'バットケーブは、どの経験レベルの方にも適した…',
    belowSurface: 'タカサゴやスカシテンジクダイの群れが…',
    …
  },
  'zh-TW': {
    …
  },
}
```

To start a new paragraph inside a sentence, put a blank line in the middle by typing
`\n\n`:

```ts
overview: 'The first paragraph.\n\nThe second paragraph.',
```

**Change one language, change all three.** `npm run check` and the tests stop you if a
translation is missing a field, has a list of a different length, or leaves one blank — so
a half-translated page never ships. If you don't have a translation yet, put the English
text in the other two blocks for now.

**News is the exception.** A news post goes up in English the day it is written and its
translations catch up later; a story is worth reading while it is still news. Every other
row in that table has to be translated before it ships.

> **Some fields are not text, and do not get translated.** A dive site keeps its English
> `name` because the calendar finds a trip by matching it. A `details.ts`'s `marineLife` list
> stays English because each creature's name is what links it to its photos. A course's
> `next` and `matchCodes` are ids, not words. None of these may appear in a `ja` or
> `'zh-TW'` block — the types refuse them, and a test checks they came through the merge
> untouched. Copying them in would break a link or a lookup on that language's pages only,
> while the page still looked perfectly fine.

---

## Words you can't change here

Trip names, class dates and prices on the Calendar come from the booking app's database,
not from this project. Changing text here will not change them. See
[How it works](how-it-works.md).
