# What is all this?

[← Back to start](index.md)

This page explains the words used in the other pages. It assumes you have never built a
website before.

You do not need this page to change the site. You can follow the step-by-step guides
without it. Read it when a word confuses you, or read it once from top to bottom and the
other pages will make more sense.

There is nothing to type on this page. Nothing here can break anything.

---

## The short version

Someone in Taipei types **fundiverstw.com** into their phone.

1. Their phone asks a computer on the internet for the website.
2. That computer sends back a set of files.
3. Their phone reads the files and draws the page on screen.

Our job is to **write those files** and to **put them on that computer**.

Every tool named below helps with one of those two jobs.

---

## What is a server?

A server is **a computer that stays switched on and sends files to other computers that
ask for them**.

That is the whole definition. The word describes the job, not the machine. A computer is
a server while it is doing that job, and stops being one when it isn't.

Your own laptop can do this job. When you type `npm run dev`, your laptop starts sending
out the website's files, and prints the address to ask at:

```
http://localhost:5173
```

- **`localhost`** means *this computer*. It is not on the internet. A colleague at the
  next desk cannot open that address and see your work.
- **`5173`** is a **port number**. One computer can run several servers at the same time,
  and the port number says which one you want. Vite uses port 5173.

Press `Ctrl+C` in the terminal and your laptop stops sending out files.

---

## What is a browser?

A browser is the program that asks servers for files and draws them on screen. Chrome,
Safari, Firefox and Edge are browsers.

A browser understands three languages, and each one has a separate job.

| Language | Its job | Example |
| --- | --- | --- |
| **HTML** | Says what is on the page | "There is a heading here, and a photo below it" |
| **CSS** | Says what it looks like | "The heading is large and teal" |
| **JavaScript** | Says what happens when you interact with it | "When this button is clicked, open the menu" |

Every website is made of these three. Everything else in this project exists to help us
write these three files more easily.

---

## What is Svelte?

This site has 24 dive-site pages. Each one has the same arrangement — a photo, a title,
paragraphs, a facts panel — and different words inside it.

Writing 24 separate HTML files would mean fixing every layout change 24 times. Instead we
describe the arrangement **once** and supply different words to it each time.

That reusable description is called a **component**. A component is a file ending in
**`.svelte`**, with two parts:

```svelte
<script>
  let name = 'Bat Cave'
</script>

<h1>{name}</h1>
```

The `<script>` part holds values and logic. The part below it describes what appears on
screen. `{name}` means *put the current value of `name` here*.

If `name` changes later, Svelte updates the heading on screen automatically. You never
write instructions to find the heading and change its text. That is the main thing Svelte
does for you.

**Svelte is not a language the browser knows.** It is a tool that converts `.svelte` files
into ordinary HTML, CSS and JavaScript before the site is published.

In this project, components are in `src/components/`. A whole page is also a component;
those are in `src/pages/`.

---

## What is Vite?

Vite is a build tool. It does two jobs.

| Command | What Vite does |
| --- | --- |
| `npm run dev` | Runs the preview server on your laptop. Save a file and the browser updates within a second. |
| `npm run build` | Converts the roughly one hundred source files into the few compressed files a browser downloads, and writes them into a folder called **`dist/`**. |

`dist/` is produced by the build. It is deleted and written again every time you build, it
is not stored in git, and changing it by hand has no lasting effect.

---

## What is Tailwind?

Usually CSS is written in a separate file from the HTML it applies to. Tailwind works
differently: you write short class names directly on the element.

```svelte
<div class="flex gap-4 rounded-xl p-6">
```

That line means: arrange the children in a row, leave a gap of 4 between them, round the
corners, and leave padding of 6 inside.

The advantage is that the styling for an element sits next to that element, so you always
know where to look. The disadvantage is real and worth stating: **there is no single file
that contains the site's layout**, because the layout is written on each element. See
[Changing how it looks](changing-look.md).

---

## What is TypeScript? What does `npm run check` do?

JavaScript allows you to write instructions that make no sense, and does not complain
until a visitor is on the page:

```js
let price = 'seventy'
price + 10          // gives the text "seventy10", and nothing warns you
```

TypeScript is JavaScript with **labels stating what kind of value each thing holds**:
this is a number, this is text, this list holds dive sites. Files ending in `.ts` are
TypeScript.

`npm run check` reads those labels and reports every place where they disagree. It does
this before the site is published, so the mistakes are found on your laptop instead of by
a customer.

This is why the site refuses to build when you add an English word without a Japanese
translation. `en.ts` states which words must exist, so a missing Japanese word is a
disagreement, and the check reports it by name.

> `0 ERRORS` means nothing contradicts anything else. It does not mean the page looks
> right. Always look at the page as well.

---

## What is npm? What is `node_modules`?

Svelte, Vite and Tailwind were written by other people. We download and use them rather
than writing our own.

| Name | What it is |
| --- | --- |
| **npm** | The tool that downloads code written by other people |
| **`package.json`** | A file listing which of that code this project needs, and defining the `npm run …` commands |
| **`npm install`** | The command that downloads it all |
| **`node_modules/`** | The folder it gets downloaded into |

`node_modules/` is very large, is not stored in git, and can always be recreated by running
`npm install` again. If the project starts behaving strangely, deleting `node_modules/` and
running `npm install` again is a normal thing to do.

**Node** is the program that runs JavaScript on your laptop rather than inside a browser.
npm and Vite need it. You will rarely think about it.

---

## What is the terminal?

The terminal is a window where you type commands instead of clicking. Three things cover
most of what you need:

| Type this | It does this |
| --- | --- |
| `cd some-folder` | Move into that folder |
| `Ctrl+C` | Stop whatever is running now |
| Up arrow | Bring back the command you typed before |

Commands act on the folder you are currently in. If a command reports that something is
not found, check which folder you are in first. That is the most common cause.

---

## What is git? What is GitHub?

**Git** records the state of the whole project at a moment you choose, together with a
note saying what changed. Each recorded state is called a **commit**.

| Command | What it does |
| --- | --- |
| `git add -A` | Select all your changes |
| `git commit -m "Add Turtle Cove"` | Record them, with that note |
| `git push` | Send your commits to GitHub |
| `git pull` | Get other people's commits from GitHub |
| `git restore some-file.ts` | Undo your changes to that file |

**GitHub** is a website that stores those commits so several people can work on the same
project. This project is at `github.com/fundiverstw/site-fundivers`.

Once you have committed, your work is very difficult to lose. You can change anything and
put it back afterwards.

> **`git push` does not publish the website.** It only sends your work to GitHub.
> Publishing is a different command, described below.

---

## What is Cloudflare? What is a Worker?

We do not own a server. We rent one from **Cloudflare**, a company that operates computers
in hundreds of cities. A visitor in Taipei receives our files from a Cloudflare computer
near Taipei, which is faster than sending them from far away.

Cloudflare calls what we rent a **Worker**. In general, a Worker is a small program that
Cloudflare runs on those computers.

**Our Worker runs no program of ours.** This is the whole of our configuration, in
`wrangler.toml`:

```toml
name = "site-fundiverstw"

[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

It says: name this `site-fundiverstw`, send out the files in `dist/`, and if a visitor
asks for an address you do not recognise, send the main page instead.

That last setting matters. It is what makes `fundiverstw.com/calendar` work when someone
pastes that address into a new browser tab. The next section explains why.

**`npm run deploy`** copies `dist/` to Cloudflare. It is the only command in this project
that changes what the public sees. Every other command affects only your laptop.

---

## What is a "single-page app"?

There are two ways to build a website.

**The older way.** Every click asks the server for a complete new page. The screen goes
blank for a moment and then redraws.

**The way this site works.** The browser downloads the site once. After that, clicking
"Courses" causes JavaScript to replace the middle of the page with the courses. Nothing is
downloaded again and the screen does not go blank. This is called a **single-page app**:
one page, whose contents are replaced as you move around.

This creates one problem. The address bar says `/calendar`, but there is no file named
`calendar` on the server. If the visitor reloads, the server is asked for a file that does
not exist.

`not_found_handling = "single-page-application"` solves it. Cloudflare sends the main page,
our JavaScript reads the address, and shows the calendar. So the server stores one page and
a large amount of JavaScript, and no other pages.

The code that reads the address and decides what to show is `src/engine/router.ts`. It is
about 40 lines long.

---

## What is a database? What is Supabase?

A **database** is a program that stores information and lets several other programs read
and change it at the same time. It stores information in **tables**. A table has
**columns** (the fields, such as amount and currency) and **rows** (one price per row).

**Supabase** is a company that runs a database for you, so nobody has to keep a server
running themselves.

The following point causes the most confusion, so it is worth reading twice.

> **The database does not belong to this website.** It belongs to the **booking app**, a
> separate program where customers log in and pay. This website is only allowed to read a
> few tables from it — prices, and the calendar of trips — and is not allowed to change
> anything.

Therefore **you cannot correct a price by editing this project**. Deploying will not do it
either. A wrong price has to be corrected in the booking app.

Everything the marketing site says about itself — dive sites, courses, photos, and every
word of text — is stored in this project, in `src/content/`. This is deliberate: it means a
change made in the booking app cannot empty a page on this site.

### Is it safe that the key is inside the website?

The website contains a password-like string called the **anon key**, and anyone who visits
can read it. This is intended.

Supabase has a feature called **row-level security**, which controls what each key is
allowed to do. This key may read a small number of public tables, and may not write
anything at all. It cannot read customers, bookings, or payments.

The keys that would be dangerous — the Cloudflare token that can publish the site — are
kept in a file called **`.env`**, which git is configured to ignore. Never commit that
file and never paste its contents anywhere.

### What is an environment variable?

A value given to a program when it starts, rather than written inside the code. `.env`
holds these values. Keeping them outside the code means passwords are never stored in the
shared project, and the same code can use a test database on your laptop and the real one
when it is published.

---

## How a change reaches a visitor

```
   you edit                     npm run build              npm run deploy
src/content/…      ───────►      dist/            ───────►   Cloudflare
   .svelte  .ts  .css          (plain HTML,               (a computer near
                               CSS, JavaScript)            the visitor)
                                                                 │
                                                                 ▼
                                                          the visitor's phone
                                                                 │
                              prices and calendar                │ asks for
                              dates are fetched      ◄───────────┘ extra data
                              separately from the
                              booking app's
                              Supabase database
```

`git push` is not part of this. It sends your work to GitHub and publishes nothing.

---

## Glossary

| Word | What it means here |
| --- | --- |
| **anon key** | The read-only key the website uses on the database. Safe to be public. |
| **branch** | A separate line of commits in git. Ours is called `main`. |
| **build** | Converting the source files into the files a browser downloads. |
| **Cloudflare** | The company whose computers send our files to visitors. |
| **commit** | A recorded state of the project in git. |
| **component** | A reusable piece of a page. A `.svelte` file. |
| **CSS** | The language that says what things look like. |
| **database** | A program that stores information in tables. Ours belongs to the booking app. |
| **deploy** | Publish the site. `npm run deploy`. |
| **`dist/`** | The built site. Produced by `npm run build`. Do not edit. |
| **`.env`** | A file holding passwords. Not stored in git. |
| **git** | The tool that records the state of the project over time. |
| **GitHub** | The website that stores those recorded states. |
| **HTML** | The language that says what is on the page. |
| **JavaScript** | The language that says what happens when you interact with the page. |
| **localhost** | This computer. Your private preview, not on the internet. |
| **`node_modules/`** | The folder of downloaded code. Not in git; recreate with `npm install`. |
| **npm** | The tool that downloads code written by other people. |
| **port** | A number identifying one server on a computer. Ours is 5173. |
| **repository (repo)** | The project folder together with its whole history. |
| **row-level security** | The database feature that limits what the anon key may read. |
| **server** | A computer that sends files to other computers that ask for them. |
| **single-page app** | One page whose contents are replaced, instead of loading new pages. |
| **Supabase** | The company that runs the booking app's database. |
| **Svelte** | The tool we use to write components. |
| **Tailwind** | Styling by writing short class names on each element. |
| **terminal** | The window where you type commands. |
| **TypeScript** | JavaScript with labels, so mistakes are found before publishing. |
| **Vite** | The tool that runs the preview and performs the build. |
| **Worker** | What Cloudflare calls what we rent. Ours only sends out files. |
| **Wrangler** | Cloudflare's command-line tool, used by `npm run deploy`. |

---

Next, read [Start here](index.md).
