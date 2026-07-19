import { test, expect } from '@playwright/test'
import { visit, stubDatabase } from './helpers'

// Dive-site pages list what you might see as chips. Each one links to its
// section of the photo gallery, and every section on that page starts shut —
// there are about sixty, one per creature, and opening them all would mean
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

test('the photos page starts with every section shut', async ({ page }) => {
  let galleryImages = 0
  page.on('response', (res) => {
    if (res.request().resourceType() === 'image' && res.url().includes('/assets/')) galleryImages++
  })

  await visit(page, '/photos')
  // Scoped to main: the nav's language button also carries aria-expanded.
  const headers = page.locator('main [aria-expanded]')
  await expect(headers.first()).toBeVisible()

  // Nothing is open...
  const expanded = await headers.evaluateAll(
    (els) => els.filter((e) => e.getAttribute('aria-expanded') === 'true').length,
  )
  expect(expanded).toBe(0)

  // ...so no gallery photo has been fetched. This is the whole point of the
  // change: the page costs a list of headings, not sixty folders of pictures.
  expect(galleryImages, 'a collapsed gallery still downloaded photos').toBe(0)
})

test('opening a section shows its photos', async ({ page }) => {
  await visit(page, '/photos')
  const header = page.locator('#nudibranchs button').first()
  await expect(header).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('#nudibranchs img')).toHaveCount(0)

  await header.click()
  await expect(header).toHaveAttribute('aria-expanded', 'true')
  expect(await page.locator('#nudibranchs img').count()).toBeGreaterThan(0)
})

test('a section with no photos says so and does not open', async ({ page }) => {
  await visit(page, '/photos')
  const header = page.locator('#moray_eels button').first()
  await expect(header).toBeDisabled()
  await expect(header).toContainText('coming soon')
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
