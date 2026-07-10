# How we check the site still works

[← Back to start](index.md)

Several people now change this site. Nobody can hold all of it in their head, and
nobody reads every page after every edit. So the computer does it instead.

Four separate checks run, each catching a different kind of mistake. You can run all
four with one command:

```bash
npm run verify
```

It takes about thirty seconds. If it prints nothing red, your change is safe to publish.

> **New here?** [What is all this?](what-is-all-this.md) explains what TypeScript, a
> linter and a browser test actually are.

---

## The four checks

| Command | What it looks at | How long |
| --- | --- | --- |
| `npm run check` | Do the types agree with each other? | ~5 s |
| `npm run lint` | Are there mistakes in the code the types cannot see? | ~10 s |
| `npm run format:check` | Is everything laid out the same way? | ~2 s |
| `npm run test:unit` | Do the small functions and the content still hold together? | ~1 s |
| `npm run test:e2e` | Does the real site, in a real browser, still work? | ~12 s |

`npm run test` runs the last two. `npm run verify` runs all of them.

**They also run by themselves.** Every time anyone pushes to GitHub, the same checks run
there, on a fresh machine. If they fail you get an email, and the pull request is marked
red. That file is `.github/workflows/ci.yml`.

**And they run before you publish.** `npm run deploy` will not upload anything until
`npm run verify` has passed. You cannot publish a broken site by accident.

---

## The linter — `npm run lint`

The linter reads your code and complains about mistakes that are legal but wrong: a
variable you declared and never used, a `console.log` left over from debugging, an
accessibility problem in the markup.

If it complains about spacing or quote marks, that is a different tool — see below.

```bash
npm run lint       # tell me what is wrong
npm run lint:fix   # fix what you can, automatically
```

Its settings are in `eslint.config.js`. Two of its standard rules are switched off there,
each with a comment explaining exactly why. **Read the comment before turning one back
on.** The rules were not switched off to make the errors go away; they were switched off
because obeying them would have made this particular site worse.

## The formatter — `npm run format`

Prettier decides where the line breaks go, whether quotes are single or double, and
whether there is a space before the bracket. Nobody argues about it, and diffs stop
filling up with whitespace changes.

```bash
npm run format        # rewrite my files properly
npm run format:check  # just tell me if anything is wrong
```

Set your editor to run Prettier when you save, and you will never think about this again.
Markdown is left alone, so these documentation pages keep their hand-aligned tables.

---

## The unit tests — `npm run test:unit`

These run in about a second and never open a browser. They test two things.

**The small functions.** Given this date, does it print `Tue, Jul 14`? Given
`Advanced Open Water`, does it pick the orange colour rather than the blue one used for
`Open Water`?

**The content.** This is the part that will save you. The tests read
`src/content/` and check:

- no two dive sites share an `id`
- every dive site sits in a region that actually exists
- every latitude and longitude lands somewhere near Taiwan, not in the wrong ocean
- every guide in `dive-site-guides.ts` is keyed to a dive site that exists — a typo
  there means the page renders with none of the text you wrote, and no error
- every photo folder is named after a real dive site
- every photo listed in `photo-gallery.ts` exists on disk
- the three language files hold **exactly** the same words, and none of them is blank

So if you add a dive site and misspell the id in one place out of three, you find out in
one second, on your own computer.

### Where they live

Next to the file they test, with `.test.ts` on the end:

```
src/engine/format.ts        the code
src/engine/format.test.ts   the tests for it
```

### Running just one

```bash
npx vitest run src/content/dive-sites.test.ts   # one file
npx vitest                                      # watch mode: re-runs as you type
```

---

## The browser tests — `npm run test:e2e`

These build the site exactly as `npm run deploy` would, open it in a real Chrome, and use
it. They take about twelve seconds and they test what a visitor would notice:

- every page loads with no crash, no error in the console, no missing file, no broken image
- clicking a link changes the page **without reloading the browser**
- pasting `fundiverstw.com/calendar` into a fresh tab works
- switching to 中文 changes the menu, and is still 中文 after a refresh
- the octopus opens the Wreck Maze, the maze actually draws, and the arrow keys turn you

They run twice: once at desktop size, once at phone size.

```bash
npm run test:e2e                          # all of them
npx playwright test e2e/game.spec.ts      # one file
npx playwright test --ui                  # watch them run, click through them
npx playwright show-report                # look at the last failure in detail
```

When one fails, Playwright saves a screenshot and a recording. `npx playwright show-report`
opens them. This is much faster than guessing.

### What these tests do not do

**They never talk to the real database.** Every request to the booking app's database is
intercepted and answered with an empty list. That makes the tests fast, repeatable, and
free of passwords — but it means **no test proves the site can still read the live
database.** If somebody changes the database in the booking app, these tests stay green
and the real calendar goes blank.

Nothing automatic protects you there. Open the site with `npm run dev` and look at the
calendar. That is the only check that exists.

---

## When something is red

**Read the last few lines first.** All these tools print the actual problem — the file, the
line, and usually the fix. It is almost never as bad as the wall of text suggests.

| It says | It usually means |
| --- | --- |
| `Property 'x' is missing in type` | You added a word to `en.ts` and not to `zh-TW.ts` or `ja.ts` |
| `no dive site with id 'bat-caves'` | A guide or photo folder is misspelled |
| `missing file: /imgs/gallery/…` | A photo is listed in the code but not on disk |
| `expected [] to equal [ 'HTTP 404' ]` | A page asks for a file that is not there |
| `the game canvas is blank` | The Wreck Maze stopped drawing |
| `Delete `··`` (from Prettier) | Run `npm run format` |

If a test fails and you are sure the site is fine, the test may be the thing that is
wrong. That is allowed. Change it — but write down in the commit message why the old
expectation was wrong, because the next person will wonder.

---

## Adding a test

Copy the nearest existing one. The pattern is always the same:

```ts
import { describe, it, expect } from 'vitest'
import { twd } from './format'

describe('twd', () => {
  it('groups thousands', () => {
    expect(twd(15400)).toBe('NT$15,400')
  })
})
```

Then, and this is the important part: **make sure it can fail.** Break the thing on
purpose, run the test, and check it goes red. A test that passes no matter what is worse
than no test, because it looks like safety.

That is how every test here was checked. Reordering two lines in the event-title table,
repeating a word in a marine-life list, deleting a photo, forgetting to save the chosen
language — each one was tried, and each one turned exactly one test red.
