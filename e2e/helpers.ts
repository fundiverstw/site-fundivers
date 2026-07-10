import type { Page, Request } from '@playwright/test'

/** Every page of the site, in the order they appear in the navigation. */
export const ROUTES = [
  '/',
  '/courses',
  '/sites',
  '/map',
  '/photos',
  '/travel',
  '/gear',
  '/calendar',
  '/team',
] as const

/**
 * Answer every call to the booking app's database with an empty list.
 *
 * The calendar, the prices and the travel covers come from a Supabase database
 * this project does not own. Letting the tests talk to it would make them slow,
 * dependent on the network, and liable to fail because somebody added a trip.
 * So they never reach it. What is tested is that each page renders correctly
 * when the database has nothing to say — which is also what a visitor sees on a
 * quiet week, and is where the empty-state text lives.
 *
 * The trade-off is real and worth knowing: **no test here proves the site can
 * read the live database.** That is what `npm run dev` and your own eyes are for.
 */
export async function stubDatabase(page: Page): Promise<void> {
  await page.route('**/rest/v1/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'content-range': '0-0/0' },
      body: '[]',
    }),
  )
}

/**
 * Ask the page for less motion, and wait for it to settle.
 *
 * Without this the octopus beside the logo stays hidden for 12 seconds, slides
 * out, wiggles for 2 seconds and hides again for up to 90 — so a test that
 * clicks it either waits 14 seconds or misses the window entirely. With reduced
 * motion the octopus simply sits out, and the background stops animating.
 *
 * This has to be called on the page rather than set in playwright.config.ts:
 * the config's `use: { reducedMotion: 'reduce' }` resolves correctly in
 * testInfo but never reaches matchMedia in this Playwright version.
 */
export async function calmMotion(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' })
}

/** stubDatabase + calmMotion + goto. What almost every test wants. */
export async function visit(page: Page, route: string): Promise<void> {
  await stubDatabase(page)
  await calmMotion(page)
  await page.goto(route)
}

/**
 * Open the hamburger menu, but only if it is shut.
 *
 * Below 768px the navigation bar is replaced by a hamburger button. The button
 * toggles, so calling it twice hides the menu again — this checks first. The
 * href is used as the probe because the link text changes with the language.
 */
async function ensureMobileMenuOpen(page: Page): Promise<void> {
  const aLink = page.locator('header a[href="/courses"]:visible')
  if ((await aLink.count()) === 0) {
    await page.locator('button[aria-label="Toggle menu"]:visible').click()
    await aLink.first().waitFor({ state: 'visible' })
  }
}

/**
 * A navigation link, in whichever layout is on screen.
 *
 * Both layouts exist in the DOM at once and only one is visible, hence
 * `:visible` rather than `.first()`, which would find the hidden one.
 */
export async function navLink(page: Page, name: string, isMobile: boolean) {
  if (isMobile) await ensureMobileMenuOpen(page)
  return page.locator('header a:visible').filter({ hasText: new RegExp(`^${name}$`) })
}

/** Click a link in the site navigation. */
export async function clickNavLink(page: Page, name: string, isMobile: boolean): Promise<void> {
  const link = await navLink(page, name, isMobile)
  await link.click()
}

/** Choose a language from the globe menu, in whichever layout is on screen. */
export async function chooseLanguage(page: Page, label: string): Promise<void> {
  await page.locator('button[aria-label="Language"]:visible').click()
  await page
    .locator('button:visible')
    .filter({ hasText: new RegExp(`^${label}$`) })
    .click()
}

export type PageProblems = {
  consoleErrors: string[]
  pageErrors: string[]
  failedRequests: string[]
}

/**
 * Watch a page for the three ways it can be broken without looking broken:
 * an uncaught exception, something logged to console.error, and a request for a
 * file that isn't there. Call before navigating.
 */
export function watchForProblems(page: Page): PageProblems {
  const problems: PageProblems = { consoleErrors: [], pageErrors: [], failedRequests: [] }

  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => problems.pageErrors.push(err.message))
  page.on('requestfailed', (req: Request) => {
    // A navigation the test itself aborted is not a failure.
    if (req.failure()?.errorText === 'net::ERR_ABORTED') return
    problems.failedRequests.push(`${req.url()} — ${req.failure()?.errorText}`)
  })
  page.on('response', (res) => {
    if (res.status() >= 400) problems.failedRequests.push(`${res.url()} — HTTP ${res.status()}`)
  })

  return problems
}

/** Images that finished loading but have no pixels — a wrong path, usually. */
export async function brokenImages(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.getAttribute('src') ?? '(no src)'),
  )
}
