import { test, expect } from '@playwright/test'
import { ROUTES, visit, stubDatabase, calmMotion, watchForProblems, brokenImages } from './helpers'

// The cheapest test that would have caught every serious bug this site has had:
// open each page and check nothing threw, nothing 404'd, and something rendered.

test.describe('every page', () => {
  for (const route of ROUTES) {
    test(`${route} renders without errors`, async ({ page }) => {
      const problems = watchForProblems(page)
      await stubDatabase(page)
      await calmMotion(page)

      await page.goto(route)
      await page.waitForLoadState('networkidle')

      expect(problems.pageErrors, `uncaught exception on ${route}`).toEqual([])
      expect(problems.consoleErrors, `console error on ${route}`).toEqual([])
      expect(problems.failedRequests, `failed request on ${route}`).toEqual([])

      // Something must actually be on the page. The header is the one element
      // present in both the desktop and the mobile layout.
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('h1, h2').first()).toBeVisible()

      expect(await brokenImages(page), `broken image on ${route}`).toEqual([])
    })
  }
})

test('a dive-site detail page renders its sections', async ({ page }) => {
  const problems = watchForProblems(page)
  await visit(page, '/sites/bat-cave')
  await page.waitForLoadState('networkidle')

  await expect(page.getByRole('heading', { name: 'Bat Cave', level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Below the Surface' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'How to Get There' })).toBeVisible()

  expect(problems.pageErrors).toEqual([])
  expect(problems.consoleErrors).toEqual([])
  expect(await brokenImages(page)).toEqual([])
})

test('an unknown address shows the not-found page, not a blank screen', async ({ page }) => {
  await visit(page, '/this-page-does-not-exist')

  await expect(page.getByText('404')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
})

test('an unknown dive site says so instead of rendering an empty page', async ({ page }) => {
  await visit(page, '/sites/no-such-dive-site')

  await expect(page.getByText(/that dive site couldn.t be found/i)).toBeVisible()
})

test('an unknown course says so instead of rendering an empty page', async ({ page }) => {
  await visit(page, '/courses/no-such-course')

  await expect(page.getByText(/that course couldn.t be found/i)).toBeVisible()
})
