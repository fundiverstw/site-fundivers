# Changing how it looks

[← Back to start](index.md)

There are two halves to this, and it's worth knowing which is which before you start.

- **The theme** — colours, fonts, corner roundness. Defined in **one place**. Change the
  teal once and every button, border and link changes with it.
- **The layout** — spacing, widths, how things sit next to each other. Written **on each
  element**, in the page or component that draws it.

There is no single "layout file", and there is no way to make one. That's normal for
this kind of project, and it's explained at the bottom.

---

## Colours, fonts, roundness → `src/styles/theme.css`

Open it. You'll see lines like this:

```css
--color-reef-400: #2cd0c5;
--color-brand-600: #2474eb;
--font-sans: "Inter", …;
--radius-lg: 1.1rem;
```

Change `#2cd0c5` to another colour and **every teal thing on the site changes at once**.
That's the whole point of the file.

Each line also becomes a name you can use in the markup. `--color-reef-400` gives you:

| Write this class | And you get |
| --- | --- |
| `bg-reef-400` | that colour as the background |
| `text-reef-400` | that colour as the text |
| `border-reef-400` | that colour as the border |

The numbers go from `50` (nearly white) to `950` (nearly black). `brand` is the blue,
`reef` is the teal, and `mauve` / `sky` / `peach` / `green` are the accent colours.

> Pick colours by editing the hex codes here, never by typing a raw `#2cd0c5` into a
> page. If you scatter hex codes around, changing the brand colour later means hunting
> through thirty files.

---

## How big text is → the four sizes

Every piece of text on the site is one of **four sizes**, and nothing else. They live in
`theme.css` beside the colours, and you use them the same way — by name, in a `class`.

| Write this class | What it is for | How big |
| --- | --- | --- |
| `text-t1` | the title of a page, or a banner heading that carries a whole band | 30px, growing to 36px on a wide screen |
| `text-t2` | a heading inside a page — a card, a panel, a group of cards | 20px |
| `text-t3` | body text: paragraphs, links, form fields, buttons | 16px |
| `text-t4` | the small print — dates, prices, chips, captions | 14px |

```svelte
<h2 class="text-t2 font-bold text-white">Domestic</h2>
<p class="text-t3 text-brand-100">From shore dives in the north…</p>
<span class="text-t4 text-brand-200">Sat, Sep 12 · 13:00</span>
```

Two rules keep it uniform:

- **Never type a size that is not one of the four** — no `text-sm`, no `text-[11px]`. If
  something looks like it wants a fifth size, it wants one of these four. The site had
  eleven sizes once, chosen a component at a time, and the small end of that range was
  hard to read on a desktop.
- **14px is the floor.** A date or a price nobody can read costs more than the room it
  saves.

The one exception is an emoji or a glyph used as a picture — the icons on the hub cards,
the big quote mark on the reputation page. Those are sized like pictures (`text-4xl`),
because they are not text.

Making everything a step bigger is one edit: change the four values in `theme.css`.

---

## The reusable looks → `src/styles/components.css`

Four named looks. Put the name in a `class` and the element takes on that look:

| Class | What it does |
| --- | --- |
| `glass` | Frosted, translucent panel. Every card uses it. |
| `glow-teal` | A neon teal edge. |
| `mono` | The monospace font, for dates, prices and labels. |
| `waybar` | The rounded bar the navigation sits in. |

```svelte
<div class="glass glow-teal">A frosted card with a teal glow</div>
```

If you want *every* card to be less see-through, change `.glass` here once.

## The underwater background → `src/styles/background.css`

The static caustic light veins, the deep blue gradient, the corner glows, the scrollbar.
It is a plain painted backdrop with no animation, so it is cheap and rarely needs
touching.

---

## Spacing and layout → the page itself

Here is the honest part.

Spacing is written directly on each element, as a list of short words in a `class`.
Real line from `src/pages/Gear.svelte`:

```svelte
<div class="grid gap-6 md:grid-cols-3">
```

That reads: *a grid, with a gap of 6 between items, and on medium-and-wider screens,
three columns.*

To change how the Gear page is spaced, you edit that line, in that file. There is no
Gear-page stylesheet somewhere else. This is called Tailwind. It means you never have to
search for which stylesheet applies to an element — but it also means **"the styling" is
not in one place, because it is written on the element it styles.**

### How to find the line you want

Find a word you can see on the real page — say "Rental" — and search the project for it.
That leads you to the page file. The `class` on the surrounding element is its styling.

### The dozen words you'll actually use

| Class | Meaning |
| --- | --- |
| `p-4` | padding (space inside) — bigger number, more space |
| `m-4` / `mt-4` | margin (space outside) / just the top |
| `gap-6` | space between items in a row or grid |
| `flex` | lay children out in a row |
| `grid grid-cols-3` | lay children out in 3 columns |
| `items-center` | line children up in the middle, across |
| `justify-between` | push children to opposite ends |
| `text-lg` / `text-sm` | bigger / smaller text |
| `font-bold` | bold text |
| `rounded-xl` | round the corners |
| `hidden` | don't show this at all |
| `max-w-[1600px]` | never grow wider than 1600 pixels |

### Different sizes of screen

A prefix means "only on this size screen and wider":

```svelte
<div class="grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
```

*One column on a phone, two on a tablet, four on a big monitor.* The prefixes are `sm:`
(640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px).

### One rule to remember

Only class names **written out in full, in a file under `src`**, end up in the finished
site. Building a class name out of pieces does not work:

```svelte
<!-- ✗ this silently produces no colour at all -->
<div class="bg-{colour}-400">

<!-- ✓ write the whole name -->
<div class={colour === 'teal' ? 'bg-reef-400' : 'bg-brand-400'}>
```

The tool that finds your classes reads your files as plain text before the site ever
runs. It can't guess what `{colour}` will be, so it never packages that colour.
