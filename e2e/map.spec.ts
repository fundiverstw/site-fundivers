import { test, expect } from '@playwright/test'
import { visit, watchForProblems } from './helpers'

// The map zooms into a region when you click it, and back out again. It is an
// inline SVG driven by map-layout.ts, whose maths is unit-tested — but nothing
// checked that clicking anything did something.

const KEELUNG = 'Keelung / Badouzi'
const BACK = '← Back to overview'

// The region name appears twice: on the SVG shape (which overlaps its
// neighbours' hit areas and slides during the zoom animation) and on a stable
// button in the list underneath. Click the list; the shape is for the keyboard
// test, where focus() does not need to hit-test.
const regionShape = (page: import('@playwright/test').Page, name: string) =>
  page.getByRole('button', { name, exact: true }).first()
const regionButton = (page: import('@playwright/test').Page, name: string) =>
  page.getByRole('button', { name, exact: true }).last()

test.describe('the dive-site map', () => {
  test('zooms into a region when you click it, and back out again', async ({ page }) => {
    const problems = watchForProblems(page)
    await visit(page, '/map')

    await expect(page.getByRole('button', { name: BACK })).toHaveCount(0)

    await regionButton(page, KEELUNG).click()
    const back = page.getByRole('button', { name: BACK })
    await expect(back).toBeVisible()

    await back.click()
    await expect(page.getByRole('button', { name: BACK })).toHaveCount(0)

    expect(problems.pageErrors).toEqual([])
    expect(problems.consoleErrors).toEqual([])
  })

  // The regions are SVG shapes with a click handler, so they need to answer the
  // keyboard too. This is exactly what the a11y check in `npm run check` is for,
  // and it is worth asserting that the handler actually works.
  test('can be zoomed with the keyboard', async ({ page }) => {
    await visit(page, '/map')

    await regionShape(page, KEELUNG).focus()
    await page.keyboard.press('Enter')

    await expect(page.getByRole('button', { name: BACK })).toBeVisible()
  })

  test('lists the dive sites of the region you zoomed into', async ({ page }) => {
    await visit(page, '/map')
    await regionButton(page, KEELUNG).click()

    // Iron House / Iron Reef is a Keelung site in the bundled catalog.
    await expect(page.getByText(/iron house/i).first()).toBeVisible()
  })

  test('does not lose the map when you zoom in and out twice', async ({ page }) => {
    const problems = watchForProblems(page)
    await visit(page, '/map')

    for (let i = 0; i < 2; i++) {
      await regionButton(page, KEELUNG).click()
      await page.getByRole('button', { name: BACK }).click()
    }

    // Not `svg` — the first svg on the page is a background caustics layer,
    // which is hidden on a phone. The map carries its own label.
    await expect(page.locator('svg[aria-label="Dive Sites of Taiwan"]')).toBeVisible()
    expect(problems.pageErrors).toEqual([])
  })
})
