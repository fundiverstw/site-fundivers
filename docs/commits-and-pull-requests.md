# Commits and pull requests

[← Back to the front page](index.md)

Several people change this site now. This page is about the manners of that: how to record
your work so the next person understands it, and how to hand it over.

None of it is difficult. Most of it is about writing a sentence explaining *why*.

---

## The shape of a change

```bash
git switch -c add-turtle-cove     # 1. start a branch
                                  # 2. do the work
npm run verify                    # 3. check it
git add -A                        # 4. select your changes
git commit                        # 5. record them, with a message
git push -u origin add-turtle-cove   # 6. send them to GitHub
gh pr create                      # 7. ask for them to be merged
```

Steps 1 and 7 are the parts a beginner usually skips. Do not skip them.

---

## Work on a branch, never on `main`

`main` is the version everyone else has. If you change it directly and get something wrong,
everyone gets your mistake.

A **branch** is your own copy of `main` to make a mess in. When the mess turns out well,
you propose merging it back.

```bash
git switch -c add-turtle-cove
```

Name it after what you are doing, in lowercase with hyphens: `add-turtle-cove`,
`fix-broken-photo`, `translate-gear-page`. That is the whole convention.

When you're done and it's merged, delete the branch and start a fresh one from `main`:

```bash
git switch main
git pull
```

---

## One change per commit

A commit is a save point. Make one per idea, not one per day.

If you added a dive site *and* fixed an unrelated typo, that is two commits. Somebody may
one day want to undo one and keep the other, and they will only be able to if you kept them
apart.

---

## Writing the message

```
Add Turtle Cove dive site

Requested by the shop after the June trip. Coordinates are from the boat's
GPS rather than Google Maps, which puts the pin on the beach rather than the
entry point.

The guide has no "How to get there" section yet — the shop is checking
whether the coast road is open.
```

Two parts:

**The first line** is a summary, under about 60 characters. Write it as an instruction, as
though ordering the code around: *Add* Turtle Cove, *Fix* the broken photo, *Remove* the
dead code. Not "Added", not "Fixing", and no full stop at the end.

**Then a blank line, then the rest** — as many sentences as it takes. This is where the
value is.

Type `git commit` on its own and an editor opens for you to write both parts. (`git commit
-m "..."` only lets you write the first line, which is why so many projects have nothing
but first lines.)

### Say why, not what

The list of changed files already says *what* you changed. Nobody needs the message to
repeat it. What the files cannot say is **why**, and what you tried, and what you decided
against.

| Not this | This |
| --- | --- |
| `Update dive-sites.ts` | `Add Turtle Cove dive site` |
| `fixed bug` | `Fix the Bat Cave photo not loading` |
| `changes` | `Translate the Gear page into Japanese` |
| `Add international: true to palau` | `Group Palau under International on the Sites page` |

Real examples from this project's history, if you want the tone:

- `Docs: npm run check takes ~5s, not ~20s`
- `Restructure src/ into content / styles / engine / pages`
- `Remove dead code and de-duplicate the markup`

### Things worth putting in the body

- Why the change was needed, and who asked for it.
- Anything surprising you found.
- Anything you tried that did not work.
- Anything you *deliberately did not do*, and why. This is the most useful sentence you
  can write, and almost nobody writes it.

---

## Before you push

```bash
npm run verify
```

Every check that will run on GitHub runs here first, in about thirty seconds. Pushing a red
branch is not a disaster — that is what the checks are for — but it wastes the reviewer's
time and yours.

Never commit `.env`. Git is set up to ignore it. Never `git add -f` it.

---

## Opening a pull request

A **pull request** ("PR") says: *here are my commits, please look at them, and if you agree,
put them into `main`.* It is a conversation, not a form.

```bash
git push -u origin add-turtle-cove
gh pr create
```

Or push, then open github.com/fundiverstw/site-fundivers and click the button it offers you.

**The title** is the same kind of sentence as a commit's first line.

**The description** should answer three questions:

```markdown
## What
Adds Turtle Cove to the dive-site list, with a guide and one photo.

## Why
The shop started running trips there in June and it isn't on the site.

## How I checked it
npm run verify passes. Looked at /sites/turtle-cove and /map in the browser;
the pin is in the right bay.
```

That last heading matters more than the other two. "I ran the checks and I looked at the
page" is a complete answer. "I assume it works" is not.

### Keep it small

A pull request with three files gets read carefully. One with sixty gets skimmed and
approved, which is the same as not being reviewed. If your change is big, split it.

### The checks must be green

GitHub runs everything automatically and puts a green tick or a red cross on your pull
request. **A red cross is not a suggestion.** Click "Details", read what failed, fix it,
and push again to the same branch — the pull request updates itself.

---

## Getting it reviewed, and merging

Ask someone to look. Wait for them. Do not merge your own pull request without a second
pair of eyes, even for a one-word change — especially not for a one-word change, because
that is when nobody is paying attention.

When it is approved and green, use **"Squash and merge"**. That folds your branch's commits
into one tidy commit on `main`, so the project's history reads as a list of changes rather
than a list of typo fixes.

### If you are the reviewer

Read the code, then say something. "Looks good to me" is a real answer. So is "why did you
do it this way?" — asking is not an accusation, and the answer often belongs in the commit
message.

Be kind about the code. It is the code being reviewed, not the person.

---

## Things you should never do

| Never | Because |
| --- | --- |
| `git push --force` on `main` | It destroys other people's work permanently. |
| Commit `.env`, or any password | It is then in the history forever, even if you delete it later. |
| Commit `dist/` or `node_modules/` | They are generated. Git already ignores them. |
| Merge a red pull request | The checks are the only thing standing between a mistake and a customer. |
| Delete a failing test to make it pass | The test is telling you something. If it is genuinely wrong, say so in the message. |

---

## If you get stuck

Nothing is unrecoverable once you have committed.

```bash
git status                 # what have I changed?
git restore some-file.ts   # undo my changes to this file
git restore .              # undo everything not yet committed
git switch main            # go back to everyone else's version
```

And if you have made a mess of a branch, the branch can simply be abandoned. Start a new
one from `main`. Nobody will mind, and nobody else was affected.

---

## What next

- [How we check the site still works](testing.md) — what `npm run verify` is actually doing
- [Publishing your changes](publishing.md) — how the site gets onto the internet
