# What every file in the project is for

[← Back to start](index.md)

Open the project folder and about twenty-five things stare back at you. Most of them are
settings for tools, and you will never touch them.

Here is every one, sorted by how much you should care.

---

## The three you will actually open

| Name | What it is |
| --- | --- |
| **`src/`** | The website. Everything you edit lives in here. It has its own five folders — see [the front page](index.md). |
| **`public/`** | Files served exactly as they are: the logo and the favicon. A file at `public/imgs/x.png` is reachable at `fundiverstw.com/imgs/x.png`. (Photos live in `src/content/` — see [Adding photos](adding-photos.md).) |
| **`docs/`** | These pages. Markdown, published to the web by GitHub. |

---

## The site's own settings

| Name | What it is |
| --- | --- |
| **`index.html`** | The one page the browser downloads. It is nearly empty on purpose — it has an empty `<div id="app">`, and the JavaScript fills it in. Its `<title>` and description are what Google shows. |
| **`wrangler.toml`** | Tells Cloudflare how to serve the site: hand out the files in `dist/`, and answer an unknown address with the main page. Eight lines. |
| **`.env`** | Passwords and addresses, kept out of git. **Never commit this.** It probably is not there when you first clone the project. |
| **`.env.example`** | A copy of `.env` with the real values removed, so you can see which ones you need. Copy it to `.env` and fill it in. |
| **`package.json`** | Which borrowed code the project needs, and every `npm run …` command. If you want to know what `npm run verify` actually does, read it here. |
| **`package-lock.json`** | Records the exact version of every borrowed piece, so everyone gets the same. Never edit it by hand; `npm install` writes it. |

---

## Settings for the tools

You will open these roughly never. Each one is commented at the top.

| Name | Belongs to | What it decides |
| --- | --- | --- |
| **`vite.config.ts`** | Vite | How the site is built. |
| **`vite.alias.ts`** | Vite + Vitest | The folder shortcuts, so `$content/dive-sites` means `src/content/dive-sites`. |
| **`svelte.config.js`** | Svelte | Two lines. Leave it. |
| **`tsconfig.json`** | TypeScript | How strict the type checking is. It also repeats the folder shortcuts — **if you add one, add it in both places.** |
| **`eslint.config.js`** | ESLint | Which mistakes the linter complains about. Two rules are off, each with a comment saying why. |
| **`.prettierrc`** | Prettier | Quote marks, line length, semicolons. |
| **`.prettierignore`** | Prettier | Which files the formatter must not touch — these docs, and the big data files. |
| **`vitest.config.ts`** | Vitest | Where the unit tests are. |
| **`vitest.contract.config.ts`** | Vitest | Where the live-database test is, and how long it may take. |
| **`playwright.config.ts`** | Playwright | Which browsers the end-to-end tests use, and how the site gets built and served for them. |

See [How we check the site still works](testing.md) for what the last four are actually for.

---

## Folders of code that is not the website

| Name | What it is |
| --- | --- |
| **`e2e/`** | The browser tests. "e2e" is short for end-to-end: they use the finished site the way a visitor would. |
| **`contract/`** | The one test that talks to the real database, to check the booking app has not renamed a column the site reads. |
| **`.github/`** | Contains one file, `workflows/ci.yml`, which tells GitHub to run all the checks every time somebody pushes. |
| **`.vscode/`** | Two small files that set your editor up: which extensions to offer you, and "tidy my file when I save". |
| **`reference/`** | Dead code. An old version of the map page, written in React, copied from the booking app when the map was moved here. It is **never** part of the site, and its tests never run — the test runner only looks inside `src/` — so it exists to be read, not run. |

---

## Made by the computer — leave them alone

None of these are in git. Deleting any of them is safe; they come back.

| Name | Where it comes from | Can I delete it? |
| --- | --- | --- |
| **`node_modules/`** | `npm install` | Yes. It is enormous. `npm install` rebuilds it. Deleting it and reinstalling is the standard fix when things go strange. |
| **`dist/`** | `npm run build` | Yes. It is the finished site, rebuilt every time. **Editing anything in here is always pointless** — the next build overwrites it. |
| **`test-results/`**, **`playwright-report/`** | `npm run test:e2e` | Yes. Screenshots and recordings from the last browser-test run. |
| **`.wrangler/`** | Cloudflare's tool | Yes. |
| **`.git/`** | git | **No.** This one holds the entire history of the project. Deleting it throws away every save point. |

---

## The two files that hide

Files whose names start with a dot are hidden by default. In a file manager, press
`Ctrl+H`. In the terminal, `ls -a`.

| Name | What it is |
| --- | --- |
| **`.gitignore`** | The list of things git must not save: `.env`, `node_modules/`, `dist/`. This is what keeps the passwords out of GitHub. |
| **`.env`** | Your copy of the secrets, from Bitwarden. See [Setting up](setting-up.md), step 9. |
| **`README.md`** | The page GitHub shows when you open the project. A short summary for developers, and a link to these docs. |

---

## A rule of thumb

If a file's name ends in **`.config.ts`**, **`.config.js`**, or starts with a **dot**, it
is a setting for a tool, not part of the website. You can read it — they are all
commented — but you almost certainly do not need to change it.

The website is in **`src/`**. Everything else is scaffolding around it.
