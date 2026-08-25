import { test, expect } from '@playwright/test'
import { visit, clickNavLink, watchForProblems } from './helpers'

// This site swaps the page contents with JavaScript rather than asking the
// server for a new page. Two things can break: the swap, and the reload.

test('clicking the navigation swaps the page without reloading it', async ({ page, isMobile }) => {
  await visit(page, '/')

  // If the browser reloads, this marker is wiped. If the router works, it survives.
  await page.evaluate(() => ((window as unknown as { __kept: boolean }).__kept = true))

  await clickNavLink(page, 'Courses', isMobile)

  await expect(page).toHaveURL('/courses')
  await expect(page.getByRole('heading', { name: 'PADI Courses' })).toBeVisible()

  const survived = await page.evaluate(() => (window as unknown as { __kept?: boolean }).__kept)
  expect(survived, 'the page did a full reload instead of a client-side swap').toBe(true)
})

// Cloudflare is configured to answer an unknown address with the main page so
// the router can take over (not_found_handling = single-page-application).
// `vite preview` does the same. Without it, reloading /calendar gives a 404.
test('a deep link opens directly, on a fresh load', async ({ page }) => {
  const problems = watchForProblems(page)
  await visit(page, '/calendar')

  await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible()
  expect(problems.pageErrors).toEqual([])
})

test('a dive-site card leads to that dive site', async ({ page }) => {
  await visit(page, '/sites')

  await page.getByRole('link', { name: 'Bat Cave' }).first().click()

  await expect(page).toHaveURL('/sites/bat-cave')
  await expect(page.getByRole('heading', { name: 'Bat Cave', level: 1 })).toBeVisible()
})

test('going back returns to the previous page', async ({ page, isMobile }) => {
  await visit(page, '/')
  await clickNavLink(page, 'Sites', isMobile)
  await expect(page).toHaveURL('/sites')

  await page.goBack()
  await expect(page).toHaveURL('/')
  await expect(page.locator('header')).toBeVisible()
})

// Adding a ninth link to the nav widened the bar until it slid underneath the
// promo banner that hangs off the logo, which then swallowed the click on the
// first link. Nothing failed except this: the page simply did not change.
// Tagged rather than skipped: the desktop bar does not exist on a phone.
test('nothing covers the navigation links', { tag: '@desktop-only' }, async ({ page }) => {
  await visit(page, '/')

  const covered = await page.evaluate(() => {
    const bad: string[] = []
    for (const link of document.querySelectorAll('nav a')) {
      const r = link.getBoundingClientRect()
      if (!r.width || !r.height) continue
      const onTop = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      if (onTop !== link && !link.contains(onTop)) {
        bad.push(`${link.textContent?.trim()} is covered by <${onTop?.tagName.toLowerCase()}>`)
      }
    }
    return bad
  })

  expect(covered, 'a nav link cannot be clicked').toEqual([])
})

// Accounts live in the booking app, not here. The bar's only job is to hand the
// visitor over to it — in whichever layout is on screen, and without the site
// pretending it can sign anyone in itself.
test('the navigation offers a way in to the booking app', async ({ page, isMobile }) => {
  await visit(page, '/')

  if (isMobile) await page.locator('button[data-testid="menu-toggle"]:visible').click()

  const signIn = page.locator('header [data-testid="sign-in"]:visible').first()
  await expect(signIn).toBeVisible()

  // Found by test id, not by its words: the label is translated. What matters
  // is where it goes — the app's login page, on the app's own origin.
  const href = await signIn.getAttribute('href')
  const url = new URL(href!)
  expect(url.pathname).toBe('/login')
  expect(url.origin).not.toBe(new URL(page.url()).origin)

  // It leaves the site, so it opens in its own tab and cannot reach back
  // through window.opener.
  await expect(signIn).toHaveAttribute('target', '_blank')
  await expect(signIn).toHaveAttribute('rel', /noopener/)
})

// The desktop bar used to appear at 768px, where nine links and the logo do not
// fit: the page scrolled sideways on every tablet and small laptop. It now
// starts at 1280px, and below that the menu button takes over.
test('the whole navigation fits, at every width', { tag: '@desktop-only' }, async ({ page }) => {
  for (const width of [768, 1024, 1280, 1366, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await visit(page, '/')

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, `the page scrolls sideways at ${width}px`).toBe(0)

    // The globe is in both layouts, so it is checked at every width. Below the
    // breakpoint the sign-in link is inside the closed menu and has no box at
    // all; above it, it is the last thing in the bar, so if it is on screen so
    // is everything before it.
    const ends = [['language button', page.locator('button[aria-label="Language"]:visible')]] as [
      string,
      ReturnType<typeof page.locator>,
    ][]
    if (width >= 1280) {
      ends.push(['sign-in link', page.locator('header [data-testid="sign-in"]:visible')])
    }

    for (const [what, end] of ends) {
      const box = await end.first().boundingBox()
      expect(box, `no visible ${what} at ${width}px`).not.toBeNull()
      expect(
        box!.x + box!.width,
        `the bar runs off the screen at ${width}px (${what})`,
      ).toBeLessThanOrEqual(width)
    }
  }
})
