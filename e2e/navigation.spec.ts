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
