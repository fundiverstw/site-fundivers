# Publishing your changes

[← Back to start](index.md)

Nothing you do on your own computer touches the real website until you run one specific
command. Until then you can experiment freely.

---

## The order of things

```bash
npm run dev       # 1. look at it on your own computer
npm run verify    # 2. ask the computer to find your mistakes
npm run deploy    # 3. put it on the real website
```

### 1. Look at it

```bash
npm run dev
```

Opens the site at **http://localhost:5173**. Edit a file, hit save, and the page updates
without you reloading. Press `Ctrl+C` in the terminal to stop it.

This is a private copy running on your machine. Nobody else can see it.

### 2. Check it

```bash
npm run verify
```

This runs five checks in about thirty seconds: the types, the linter, the formatter, the
unit tests, and the browser tests. Wait for it to finish. If nothing is red, you're done.

If something fails, read the last few lines — they name the file and usually say exactly
what is wrong. **Do not publish with errors.** [How we check the site still
works](testing.md) explains each check and what a failure usually means.

### 3. Publish it

```bash
npm run deploy
```

This rebuilds the site and uploads it to Cloudflare. It takes about a minute. When it
finishes it prints the address it published to:

```
https://site-fundiverstw.<account>.workers.dev
```

Refresh the real website and your change is there.

---

## Three things worth knowing

**Pushing to GitHub does not publish the website.** There is no automation. `git push`
saves your work; `npm run deploy` publishes it. They are unrelated. You can do either
without the other.

**`npm run deploy` publishes what is on your computer right now** — including edits you
haven't committed, and *not* including a colleague's work you haven't pulled. Run these
three in order:

```bash
git pull
npm run verify
npm run deploy
```

**Prices and calendar dates don't come from here.** Deploying will never change a price
or add a trip to the calendar. Those live in the booking app's database. See
[How it works](how-it-works.md).

---

## Saving your work in git

Publishing and saving are different jobs. To save:

```bash
git add -A
git commit -m "Add Turtle Cove dive site"
git push
```

If you want to throw away a change and start over, before committing:

```bash
git restore src/content/dive-sites.ts    # one file
git restore .                            # everything
```

---

## If deploy fails

| The error says | What to do |
| --- | --- |
| `Missing VITE_SUPABASE_URL…` | You have no `.env` file. Copy `.env.example` to `.env` and fill it in. Ask whoever set the project up for the values. |
| `Authentication error` / `10000` | The Cloudflare token in `.env` is missing, wrong, or expired. |
| Errors, then it stops before uploading | `npm run deploy` runs `npm run verify` first, on purpose. Fix what it names and try again. |
| It worked, but the site looks unchanged | Hard-refresh the browser: `Ctrl+Shift+R`. |

The `.env` file holds passwords. It is deliberately excluded from git — never commit it,
and never paste its contents into a chat or an issue.
