# Start here

This is the FunDivers TW website — the one at **fundiverstw.com**. It shows courses,
dive sites, photos, a calendar, and the team. It does **not** take bookings or
payments; those live in a separate program called `app-fundivers`.

You do not need to understand the whole thing to change it. Almost everything you'll
want to edit is text sitting in one folder.

> **New to this kind of work?** Read **[What is all this?](what-is-all-this.md)** first.
> It explains what a server is, what Cloudflare is, what Svelte is, and every other word
> used on these pages. It assumes you have never built a website before.

---

## The five folders

Everything lives in a folder called `src`. Inside it there are five folders, and each
one holds one kind of thing.

| Folder | What's in it | How often you'll open it |
| --- | --- | --- |
| **`src/content/`** | The words, the facts, the links, the photos | **All the time** |
| **`src/styles/`** | Colours, fonts, the reusable "looks" | Sometimes |
| **`src/pages/`** | One file per page of the website | Sometimes |
| **`src/components/`** | Pieces of a page, reused in several places | Sometimes |
| **`src/engine/`** | The machinery — routing, database, maths | **Almost never** |

If you remember one thing, remember this: **words and facts go in `content`. Colours go
in `styles`. Don't touch `engine`.**

You can tell which folder a piece of code came from just by reading the import line at
the top of a file. `$content/dive-sites` means "the dive-site list, in the content
folder". `$engine/router` means "the router, in the engine folder".

---

## "I want to change ___". Where do I go?

| I want to change… | Open this file |
| --- | --- |
| The shop's phone number, email, or address | `src/content/settings.ts` |
| The yellow promo banner by the octopus | `src/content/settings.ts` |
| Instagram / Facebook / LINE links | `src/content/settings.ts` |
| Any word or sentence on a page | `src/content/text/en.ts` — see [Changing words](changing-words.md) |
| The Chinese or Japanese translation | `src/content/text/zh-TW.ts` or `ja.ts` |
| The list of dive sites | `src/content/dive-sites.ts` |
| The long write-up for one dive site | `src/content/dive-site-guides.ts` |
| The list of courses | `src/content/courses.ts` |
| The long write-up for one course | `src/content/course-guides.ts` |
| Which photos appear on the Photos page | `src/content/photo-gallery.ts` — see [Adding photos](adding-photos.md) |
| The photo on a dive-site or event card | Drop a file in `src/content/photos/` — see [Adding photos](adding-photos.md) |
| The questions in the octopus's maze game | `src/content/quiz-questions.ts` |
| A colour, a font, or how round the corners are | `src/styles/theme.css` — see [Changing how it looks](changing-look.md) |
| The frosted-glass panel look | `src/styles/components.css` |
| The underwater background | `src/styles/background.css` |
| The layout of one particular page | That page's file in `src/pages/` |

### Things you **cannot** change here

Some things look like they belong to this website but don't. They come from a database
that the **booking app** owns, and this site only reads them.

| Thing | Where it really lives |
| --- | --- |
| Course **prices** | The booking app's database (`EO_prices`) |
| What's on the **calendar** — trips, class dates, spaces left | The booking app's database (`EO_dives`, `EO_courses`) |
| Travel destination covers on the Travel page | The booking app's database (`travel_destinations`) |

Editing this website will never change a price. If a price is wrong, it must be fixed in
the booking app. See [How it works](how-it-works.md) for why.

---

## The only three commands you need

Open a terminal in the project folder and type these.

```bash
npm install       # once, the first time, to download the pieces
npm run dev       # start the website on your own computer
```

Then open **http://localhost:5173** in a browser. Change a file, save it, and the page
updates by itself. Nothing you do here affects the real website.

When you're happy:

```bash
npm run check     # asks the computer to look for mistakes
npm run deploy    # puts your changes on the real website
```

> **Always run `npm run check` before `npm run deploy`.**
> It takes about twenty seconds and it catches the kind of mistake — a missing comma, a
> word translated into English but not Japanese — that would otherwise break the live
> site. If it prints `0 errors`, you're safe.

More detail in [Publishing your changes](publishing.md).

---

## The rules

1. **Never edit anything in the `dist` folder.** It is thrown away and rebuilt every
   time. Your changes there will vanish.
2. **Never edit `src/engine/`** unless you know exactly why. Nothing in there is
   something a normal edit needs.
3. **Run `npm run check` before you publish.** Every time.
4. **If it breaks, you can always undo.** Nothing is permanent until you publish. In the
   terminal, `git restore <the-file>` puts a file back the way it was.

---

## Step-by-step guides

- [What is all this?](what-is-all-this.md) — servers, Cloudflare, Svelte, git, explained from zero
- [Changing words](changing-words.md) — text on any page, in any language
- [Changing how it looks](changing-look.md) — colours, fonts, spacing
- [Adding a dive site](adding-a-dive-site.md) — the full four steps
- [Adding photos](adding-photos.md) — gallery photos and card photos
- [Publishing your changes](publishing.md) — getting it onto the real website
- [How it works](how-it-works.md) — for when you're curious about the machinery
