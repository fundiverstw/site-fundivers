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

/** The tables the site reads. Anything not listed answers with an empty list. */
export type FakeDb = Record<string, Array<Record<string, unknown>>>

/**
 * Apply the PostgREST filters supabase-js puts in the query string.
 *
 * Only the handful this site uses. Without them, a query for `kind=eq.dive`
 * would get the courses back too and the test would be exercising a fantasy.
 */
function applyFilters(rows: Array<Record<string, unknown>>, params: URLSearchParams) {
  const skip = new Set(['select', 'order', 'limit', 'offset'])
  let out = rows
  for (const [column, expr] of params) {
    if (skip.has(column)) continue
    const [op, ...rest] = expr.split('.')
    const value = rest.join('.')
    const get = (r: Record<string, unknown>) => r[column]

    if (op === 'eq') out = out.filter((r) => String(get(r)) === value)
    else if (op === 'neq') out = out.filter((r) => String(get(r)) !== value)
    else if (op === 'is')
      out = out.filter((r) => (value === 'null' ? get(r) == null : String(get(r)) === value))
    else if (op === 'gte') out = out.filter((r) => String(get(r)) >= value)
    else if (op === 'lte') out = out.filter((r) => String(get(r)) <= value)
    else if (op === 'gt') out = out.filter((r) => String(get(r)) > value)
    else if (op === 'lt') out = out.filter((r) => String(get(r)) < value)
    else if (op === 'in') {
      const list = value
        .replace(/^\(|\)$/g, '')
        .split(',')
        .map((v) => v.replace(/^"|"$/g, ''))
      out = out.filter((r) => list.includes(String(get(r))))
    } else if (op === 'ov') {
      // Array overlap, e.g. course_days=ov.{2026-07-20,2026-07-21}
      const list = value.replace(/^\{|\}$/g, '').split(',')
      out = out.filter((r) => ((get(r) as string[]) ?? []).some((d) => list.includes(d)))
    }
    // Anything else is ignored rather than silently dropping every row.
  }
  return out
}

/**
 * Answer every call to the booking app's database from `db`, in memory.
 *
 * The calendar, the prices and the travel covers come from a Supabase database
 * this project does not own. Letting the tests talk to it would make them slow,
 * dependent on the network, and liable to fail because somebody added a trip.
 * So they never reach it.
 *
 * Called with no `db`, every table answers with an empty list — which is what a
 * visitor sees on a quiet week, and is where the empty-state text lives. Pass
 * fixtures (see fixtures.ts) to exercise the calendar with rows in it.
 *
 * The trade-off is real and worth knowing: **no test here proves the site can
 * read the live database.** That is what `npm run dev` and your own eyes are for.
 */
export async function stubDatabase(page: Page, db: FakeDb = {}): Promise<void> {
  await page.route('**/rest/v1/**', (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const table = url.pathname.split('/rest/v1/')[1]?.split('?')[0] ?? ''
    const rows = applyFilters(db[table] ?? [], url.searchParams)

    // .maybeSingle() / .single() ask for one object rather than an array.
    const accept = request.headers()['accept'] ?? ''
    const wantsOne = accept.includes('pgrst.object')
    const body = wantsOne ? JSON.stringify(rows[0] ?? null) : JSON.stringify(rows)

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'content-range': `0-${Math.max(rows.length - 1, 0)}/${rows.length}` },
      body,
    })
  })
}

/** stubDatabase + goto. What almost every test wants.
 *  Reduced motion is set for every page in playwright.config.ts. */
export async function visit(page: Page, route: string, db: FakeDb = {}): Promise<void> {
  await stubDatabase(page, db)
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
