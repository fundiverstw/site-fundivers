# Adding a news post

[← Back to start](index.md)

The **News** page is the growing list of things the team turns up to — conferences,
volunteer days, community outreach, teaching. Newest at the top.

Each post is **one folder**. Make the folder, put an `article.ts` in it, drop in up to
three photos, and you are done: nothing else in the project needs editing, and the feed
sorts itself.

---

## The short version

```
src/content/news/
  2026-09-20-reef-cleanup/       ← the date and the address, in the folder name
    article.ts                   ← the words
    1-briefing.jpg               ← up to three photos
    2-hauling-nets.jpg
```

That publishes on **20 September 2026** at **`/news/reef-cleanup`**.

---

## Step 1 — make the folder

Name it `YYYY-MM-DD-some-slug`.

| Part | What it does |
| --- | --- |
| `2026-09-20` | The date shown on the post, and what the list is sorted by |
| `reef-cleanup` | The web address: `fundiverstw.com/news/reef-cleanup` |

**The folder name is the only place the date and the address are written.** There is no
`date:` field to disagree with it. If you get the date wrong, rename the folder and both
fix themselves.

Use the date the *event* happened, not the day you write it up. That is what a reader
expects the list to be ordered by.

> `npm run test:unit` refuses a folder that is not shaped this way, or one dated
> `2026-02-30`. A folder it cannot read is a post that does not appear at all — so it is
> better to be stopped than to publish nothing and not know.

---

## Step 2 — write `article.ts`

Copy this whole block into `article.ts` inside your new folder and edit it:

```ts
import type { NewsArticleFile } from '$content/news'

export const article: NewsArticleFile = {
  // One of: conference · volunteering · outreach · education
  kind: 'volunteering',

  title: 'Reef cleanup at Longdong',

  // One line. This is all that shows on the card in the list.
  summary: 'Eleven of us, four hours, and ninety kilos of ghost net off the reef.',

  // The write-up. Blank line between paragraphs by typing \n\n.
  body: `We met at the harbour at seven, which everybody agreed was too early.

The nets had been snagged on the wall since the typhoon, and it took three dives to get them all up.`,

  // Optional. Keyed by the photo's exact filename, including the extension.
  captions: {
    '2-hauling-nets.jpg': 'The last of the ghost net coming up.',
  },
}
```

Only four things are required: `kind`, `title`, `summary` and `body`.

### About `kind`

It draws the little label on the card. The four values are fixed, because each one has a
translation written for it in `src/content/text/`:

`conference` · `volunteering` · `outreach` · `education`

If you need a fifth, add it to `NEWS_KINDS` in `src/content/news.ts` **and** to
`news.kinds` in all three files in `src/content/text/`. The tests will tell you if you
miss one.

### About the apostrophe

The body is wrapped in backticks (`` ` ``), so ordinary apostrophes are safe there. In
`title` and `summary`, which use straight quotes, use the curly apostrophe `’` — see
[Changing words](changing-words.md#if-your-text-has-an-apostrophe).

---

## Step 3 — the photos

Drop up to **three** image files into the same folder. Any `.jpg`, `.png`, `.webp` or
`.avif`. They do not need resizing — the build makes the small copies, exactly as it does
for the gallery ([Adding photos](adding-photos.md)).

**They appear in filename order**, so name them so they sort the way you want them read:

```
1-briefing.jpg
2-hauling-nets.jpg
3-the-haul.jpg
```

Three is the limit the article page is built for: one photo fills the column, two or
three share a row. A fourth is refused by the tests rather than quietly wrapping onto a
second row.

### Captions

Optional, and worth writing anyway. A caption is shown under the photo **and** used as
its description for screen readers. A photo with no caption is described by the article
title instead — which is better than nothing, but not by much.

The key must be the filename **exactly**, extension included. Rename a photo and its
caption stops matching; the tests catch that and name the file for you.

---

## Step 4 — look at it

```bash
npm run dev
```

Open <http://localhost:5173/news>. The new post is at the top if it is the most recent.

---

## Translations

**A post goes up in English the moment you write it.** This is the one kind of content on
the site that does not wait for its translations — news is worth reading while it is news.

Japanese and Chinese readers see the English text until a translation exists. To add one,
put an entry in `src/content/news.ja.ts` or `src/content/news.zh-TW.ts`, keyed by the
slug — the part of the folder name after the date:

```ts
export const newsJa: Record<string, NewsText> = {
  'reef-cleanup': {
    title: '龍洞でのリーフクリーンアップ',
    summary: '11 人、4 時間、そしてリーフから 90 キロのゴーストネット。',
    body: `朝七時に漁港に集合しました。…`,
  },
}
```

Every time you run `npm run test:unit` it prints which posts are still waiting:

```
  1 news article(s) not yet translated to ja — readers see the English until then:
    · reef-cleanup
```

Two things *are* enforced, because both mean writing that never reaches a reader:

- **A slug that matches no post.** Usually a typo, or a folder that has been renamed.
- **A half-filled entry.** All three of `title`, `summary` and `body`, or none. The
  fallback to English is per-post, not per-field — otherwise one story would come out
  half in Japanese and half in English.

---

## Deleting a post

Delete the folder. That is the whole job.

---

## When something does not appear

| What you see | Almost always |
| --- | --- |
| The post is missing entirely | The folder name is not `YYYY-MM-DD-slug`. Run `npm run test:unit`. |
| The post appears with no photos | The photos are in the wrong folder, or have an extension the build does not read |
| A caption is missing | Its key does not match the filename exactly — check the extension |
| The date is a day off what you typed | You are looking at a real bug; please say so |

`npm run test:unit` names all of these. It is faster than looking.
