import { test, expect } from '@playwright/test'
import { visit, stubDatabase } from './helpers'

// Dive-site pages list what you might see as chips. Each one links to its
// section of the photo gallery. There are about sixty sections, one per
// creature, and all but nudibranchs start shut — opening them all would mean
// loading every photo on the site to show you the one you asked for.

test('a marine-life chip links to its gallery section', async ({ page }) => {
  await visit(page, '/sites/82-5')

  const chips = page.locator('a[href^="/photos#"]')
  await expect(chips.first()).toBeVisible()

  // Every chip is a link, and every link names a section that exists.
  const hrefs = await chips.evaluateAll((els) => els.map((e) => e.getAttribute('href')))
  expect(hrefs.length).toBeGreaterThan(3)
  expect(hrefs).toContain('/photos#moray_eels')

  await page.goto('/photos')
  const keys = await page
    .locator('[id][class*="scroll-mt"]')
    .evaluateAll((els) => els.map((e) => e.id))
  for (const href of hrefs) {
    expect(keys, `${href} points at a section that does not exist`).toContain(
      href!.replace('/photos#', ''),
    )
  }
})

test('the photos page opens one section and no more', async ({ page }) => {
  await visit(page, '/photos')
  // Scoped to main: the nav's language button also carries aria-expanded.
  const headers = page.locator('main [aria-expanded]')
  await expect(headers.first()).toBeVisible()

  // Nudibranchs is open on arrival; every other section is shut. This is the
  // whole point of the collapsing: the page costs one folder of pictures, not
  // sixty.
  const openKeys = await headers.evaluateAll((els) =>
    els
      .filter((e) => e.getAttribute('aria-expanded') === 'true')
      .map((e) => e.closest('[id]')?.id ?? '?'),
  )
  expect(openKeys).toEqual(['nudibranchs'])
})

test('a shortcut exists for every group, including the empty ones', async ({ page }) => {
  await visit(page, '/photos')
  const shortcuts = page.locator('nav[aria-label] a[href^="#"]')
  const sections = page.locator('main [id][class*="scroll-mt"]')

  // One shortcut per section — an empty group is still something you should be
  // able to find.
  expect(await shortcuts.count()).toBe(await sections.count())
  expect(await shortcuts.count()).toBeGreaterThan(50)

  const hrefs = await shortcuts.evaluateAll((els) => els.map((e) => e.getAttribute('href')))
  expect(hrefs).toContain('#whale_sharks') // no photos yet
  expect(hrefs).toContain('#nudibranchs') // has photos
})

test('the shortcuts read alphabetically', async ({ page }) => {
  await visit(page, '/photos')
  // The shortcuts are an index, so they sort by name. The sections they point
  // at keep the vocabulary's own order, which is a different thing on purpose.
  const labels = await page
    .locator('nav[aria-label] a[href^="#"]')
    .evaluateAll((els) => els.map((e) => e.textContent?.trim() ?? ''))

  expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b)))
})

test('a shortcut scrolls to its group and opens it', async ({ page }) => {
  await visit(page, '/photos')
  // Collapse the one that starts open, then reopen it from its shortcut. This
  // is the case where the hash is already in the address bar, so the browser
  // fires no event and only the click handler can do the work.
  await page.locator('#nudibranchs button').first().click()
  await expect(page.locator('#nudibranchs button').first()).toHaveAttribute(
    'aria-expanded',
    'false',
  )

  await page.locator('nav[aria-label] a[href="#nudibranchs"]').click()
  await expect(page.locator('#nudibranchs button').first()).toHaveAttribute('aria-expanded', 'true')
})

test('opening a section shows its photos', async ({ page }) => {
  await visit(page, '/photos')
  // 'scorpionfish' has photos but, unlike nudibranchs, does not start open.
  const header = page.locator('#scorpionfish button').first()
  await expect(header).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('#scorpionfish img')).toHaveCount(0)

  await header.click()
  await expect(header).toHaveAttribute('aria-expanded', 'true')
  expect(await page.locator('#scorpionfish img').count()).toBeGreaterThan(0)
})

test('a section with no photos says so and does not open', async ({ page }) => {
  await visit(page, '/photos')
  const header = page.locator('#whale_sharks button').first()
  // aria-disabled, not disabled: a `disabled` button is skipped by screen
  // readers, and "coming soon" is the thing worth hearing.
  await expect(header).toHaveAttribute('aria-disabled', 'true')
  await expect(header).not.toHaveAttribute('aria-expanded')
  await expect(header).toContainText('coming soon')

  // `force` because Playwright refuses to click an aria-disabled control —
  // which is the point. Forcing it through proves the handler is a no-op too,
  // not just that the button is hard to reach.
  await header.click({ force: true })
  await expect(page.locator('#whale_sharks img')).toHaveCount(0)
  await expect(header).not.toHaveAttribute('aria-expanded')
})

test('arriving at an anchor opens that section', async ({ page }) => {
  await stubDatabase(page)
  await page.goto('/photos#nudibranchs')
  const header = page.locator('#nudibranchs button').first()
  await expect(header).toHaveAttribute('aria-expanded', 'true')
  expect(await page.locator('#nudibranchs img').count()).toBeGreaterThan(0)
})

test('clicking a chip carries the anchor across the navigation', async ({ page }) => {
  // The router moves between pages with pushState, which does not fire
  // hashchange — so this is the case that silently does nothing if the photos
  // page only listens for that one event.
  await visit(page, '/sites/82-5')
  await page.locator('a[href="/photos#nudibranchs"]').first().click()

  await expect(page).toHaveURL(/\/photos#nudibranchs$/)
  await expect(page.locator('#nudibranchs button').first()).toHaveAttribute('aria-expanded', 'true')
})
