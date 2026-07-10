# Setting up your computer

[← Back to the front page](index.md)

This page is for someone who has never done development work before. It assumes nothing.
You will install four things, prove to GitHub that your computer is yours, download the
project, and see the website running on your own machine.

Set aside an hour. Nothing here can break the real website.

If a word confuses you, [What is all this?](what-is-all-this.md) explains every one.

---

## What you are installing, and why

| Thing | What it is for |
| --- | --- |
| **VSCodium** | The program you write in. A text editor that understands code. |
| **Git** | Records your changes and shares them with everyone else. |
| **Node** | Runs the website on your own computer. |
| **An SSH key** | Proves to GitHub that this computer belongs to you. |

VSCodium is Visual Studio Code with Microsoft's tracking and branding removed. It works
the same way. If you already have VS Code, that is fine too — use it and skip step 1.

---

## Step 1 — Install VSCodium

### Windows

Open **PowerShell** from the Start menu and type:

```powershell
winget install vscodium
```

Or download the installer from [vscodium.com](https://vscodium.com/) and double-click it.

### macOS

If you have [Homebrew](https://brew.sh/):

```bash
brew install --cask vscodium
```

Otherwise download the `.dmg` from [vscodium.com](https://vscodium.com/) and drag VSCodium
into Applications.

> The first time you open it, macOS may say the app is from an unidentified developer.
> Right-click the app → **Open** → **Open**. You only do this once.

### Linux (Debian / Ubuntu)

```bash
wget -qO - https://gitlab.com/paulcarroty/vscodium-deb-rpm-repo/raw/master/pub.gpg \
    | gpg --dearmor \
    | sudo dd of=/usr/share/keyrings/vscodium-archive-keyring.gpg

echo 'deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/vscodium-archive-keyring.gpg] https://download.vscodium.com/debs vscodium main' \
    | sudo tee /etc/apt/sources.list.d/vscodium.list

sudo apt update && sudo apt install codium
```

On Debian 13 or Ubuntu 24.04 and newer, use the `.sources` form shown on
[vscodium.com](https://vscodium.com/) instead of the `.list` line above.

---

## Step 2 — Install Git

### Windows

```powershell
winget install Git.Git
```

This also installs **Git Bash**, a terminal window. **Use Git Bash for every command on
this page**, not PowerShell — the commands below are written for it, and it comes with
`ssh` already.

### macOS

```bash
brew install git
```

No Homebrew? Type `git --version` in Terminal. macOS offers to install it for you.

### Linux

```bash
sudo apt install git
```

---

## Step 3 — Install Node

The project needs **Node 20 or newer**.

| System | Command |
| --- | --- |
| Windows | `winget install OpenJS.NodeJS.LTS` |
| macOS | `brew install node` |
| Linux | Follow [nodejs.org/en/download](https://nodejs.org/en/download) — the version in `apt` is often too old |

**Close your terminal and open a new one.** Then check both:

```bash
node --version    # should print v20. or higher
npm --version
```

If `node` is "not found" after installing, the new terminal is the fix. It has to reload
where programs live.

---

## Step 4 — Tell Git who you are

Every change you record carries your name. Set it once:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Use the same email you will use for GitHub.

---

## Step 5 — Make a GitHub account and an SSH key

Sign up at [github.com](https://github.com/) if you have not.

An **SSH key** is a pair of files: a private one that never leaves your computer, and a
public one you give to GitHub. Together they prove you are you, without typing a password
every time.

**Make the key.** Press Enter at every prompt to accept the defaults. When it asks for a
passphrase you may leave it blank, or set one — you will be asked for it occasionally.

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

**Tell your computer to remember it.**

| System | Commands |
| --- | --- |
| Windows (Git Bash) | `eval "$(ssh-agent -s)"` then `ssh-add ~/.ssh/id_ed25519` |
| macOS | `eval "$(ssh-agent -s)"` then `ssh-add --apple-use-keychain ~/.ssh/id_ed25519` |
| Linux | `eval "$(ssh-agent -s)"` then `ssh-add ~/.ssh/id_ed25519` |

**Copy the public half.** Note the `.pub` — that is the half you are allowed to share.

| System | Command |
| --- | --- |
| Windows (Git Bash) | `clip < ~/.ssh/id_ed25519.pub` |
| macOS | `pbcopy < ~/.ssh/id_ed25519.pub` |
| Linux | `cat ~/.ssh/id_ed25519.pub` then select and copy the output |

**Give it to GitHub.** On github.com: your avatar → **Settings** → **SSH and GPG keys** →
**New SSH key**. Title it something like "work laptop". Paste into the Key box. Save.

**Check it worked:**

```bash
ssh -T git@github.com
```

The first time it asks whether to trust `github.com` — type `yes`. Then you should see:

```
Hi yourname! You've successfully authenticated, but GitHub does not provide shell access.
```

That sentence looks like a rejection. **It is success.** GitHub is saying "I know who you
are, and no, you cannot log in to my computer" — which is exactly right.

> **Never share the file without `.pub`.** `id_ed25519` is your private key. `id_ed25519.pub`
> is the public one. Only the `.pub` goes anywhere.

---

## Step 6 — Get access to the project

Ask whoever runs the project to add you to **github.com/fundiverstw/site-fundivers**.

Anyone can *read* the project — it is public. You need to be added before you can *send*
your changes back. If you skip this, everything below still works until the moment you
push, which then fails with `Permission denied`.

---

## Step 7 — Download the project

Pick a folder to keep your work in, then:

```bash
cd ~                       # or wherever you want it
git clone git@github.com:fundiverstw/site-fundivers.git
cd site-fundivers
```

`clone` means "make me a complete copy, with all its history".

---

## Step 8 — Open it in VSCodium

```bash
codium .
```

The `.` means "this folder". If `codium` is not found, open VSCodium normally and use
**File → Open Folder**.

VSCodium will offer to install the project's **recommended extensions**. Say yes. They are:

| Extension | What it does |
| --- | --- |
| **Svelte for VS Code** | Understands `.svelte` files. Underlines mistakes as you type. |
| **Prettier** | Tidies your file's layout when you save it. |
| **ESLint** | Shows the linter's complaints in the editor, not just the terminal. |

> VSCodium gets extensions from **Open VSX**, not Microsoft's marketplace. All three above
> are there. A few extensions you may read about elsewhere are not — that is the one real
> difference from VS Code.

---

## Step 9 — Get the secrets

The project needs a file called **`.env`** in its top folder. It holds the addresses and
passwords the site uses. It is deliberately not in GitHub, so cloning does not give it to you.

**The values live in Bitwarden, as a secure note.** Ask for access, open the note, and copy
its contents into a new file named exactly `.env` in the `site-fundivers` folder.

> ### Read this part twice
>
> That file contains the keys to the castle. One of them is a **Cloudflare token** that
> can publish anything to the live website.
>
> - **Never** commit it. Git is already told to ignore it — do not fight that.
> - **Never** paste its contents into a chat, an email, a GitHub issue, or a screenshot.
> - **Never** send it over anything but Bitwarden. Not Slack, not LINE, not attachments.
> - If you think it has leaked, say so immediately. The token gets replaced. Nobody will
>   be cross with you — they will be cross if you stay quiet.

Without `.env` the site will not start, and the browser console says
`Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars`.

---

## Step 10 — Install and run

```bash
npm install     # downloads the code the project borrows. A few minutes, once.
npm run dev     # starts the website on your computer
```

Open **http://localhost:5173**. That is the site, running on your machine, visible only to
you. Change a file, save it, and the page updates by itself.

Press `Ctrl+C` in the terminal to stop it.

**Now check the whole thing works:**

```bash
npm run verify
```

The first time, this downloads a small browser (about 100 MB) so it can test the real
pages. That takes a couple of minutes. After that, `verify` takes about thirty seconds.

If it ends with nothing red, your setup is finished.

---

## When it goes wrong

| It says | What to do |
| --- | --- |
| `node: command not found` | Close the terminal and open a new one. |
| `git@github.com: Permission denied (publickey)` | The SSH key is not on GitHub, or the agent has forgotten it. Redo step 5 and run `ssh -T git@github.com`. |
| `Permission denied` when you push | Your key is fine, but you have not been added to the project. Step 6. |
| `Missing VITE_SUPABASE_URL…` | There is no `.env` file. Step 9. |
| `npm install` fails oddly | Delete the `node_modules` folder and run it again. This is normal and everybody does it. |
| The page is blank | Look at the terminal, and at the browser's console (`F12`). The error is usually named plainly. |

---

## What next

- [How to maintain a self-hosted static site](index.md) — the lookup table: "I want to change ___"
- [Commits and pull requests](commits-and-pull-requests.md) — how to share your work with the others
- [What is all this?](what-is-all-this.md) — what a server, Cloudflare and Svelte actually are
