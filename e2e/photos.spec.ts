import { test, expect } from '@playwright/test'
import { visit, watchForProblems } from './helpers'

// The Photos page opens a full-screen viewer when you tap a picture, and you
// move through the gallery with the arrow keys. None of that was tested.

const viewer = (page: import('@playwright/test').Page) => page.locator('[role="presentation"] img')

test.describe('the photo viewer', () => {
  test('opens on the picture you clicked', async ({ page }) => {
    const problems = watchForProblems(page)
    await visit(page, '/photos')

    await expect(viewer(page)).toHaveCount(0)

    const thumb = page.locator('section img').first()
    const thumbSrc = await thumb.getAttribute('src')
    await thumb.click()

    await expect(viewer(page)).toBeVisible()
    expect(await viewer(page).getAttribute('src')).toBe(thumbSrc)

    expect(problems.pageErrors).toEqual([])
    expect(problems.consoleErrors).toEqual([])
  })

  test('moves to the next and previous photo with the arrow keys', async ({ page }) => {
    await visit(page, '/photos')
    await page.locator('section img').first().click()

    const first = await viewer(page).getAttribute('src')

    await page.keyboard.press('ArrowRight')
    const second = await viewer(page).getAttribute('src')
    expect(second, 'ArrowRight did not advance').not.toBe(first)

    await page.keyboard.press('ArrowLeft')
    expect(await viewer(page).getAttribute('src'), 'ArrowLeft did not go back').toBe(first)
  })

  test('wraps around at the start of the gallery', async ({ page }) => {
    await visit(page, '/photos')
    await page.locator('section img').first().click()
    const first = await viewer(page).getAttribute('src')

    // Stepping back from the first photo must land on the LAST one. Clamping to
    // zero instead would leave you stuck on the first, which still "works".
    await page.keyboard.press('ArrowLeft')
    await expect(viewer(page)).toBeVisible()
    const wrapped = await viewer(page).getAttribute('src')
    expect(wrapped, 'ArrowLeft from the first photo did not wrap to the last').not.toBe(first)

    // And forward from there returns to the first.
    await page.keyboard.press('ArrowRight')
    expect(await viewer(page).getAttribute('src')).toBe(first)
  })

  test('moves with the on-screen buttons too', async ({ page }) => {
    await visit(page, '/photos')
    await page.locator('section img').first().click()
    const first = await viewer(page).getAttribute('src')

    await page.getByRole('button', { name: 'Next' }).click()
    expect(await viewer(page).getAttribute('src')).not.toBe(first)

    await page.getByRole('button', { name: 'Previous' }).click()
    expect(await viewer(page).getAttribute('src')).toBe(first)
  })

  test('closes with Escape and with the close button', async ({ page }) => {
    await visit(page, '/photos')

    await page.locator('section img').first().click()
    await expect(viewer(page)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(viewer(page)).toHaveCount(0)

    await page.locator('section img').first().click()
    await expect(viewer(page)).toBeVisible()
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(viewer(page)).toHaveCount(0)
  })

  test('ignores the arrow keys when the viewer is shut', async ({ page }) => {
    await visit(page, '/photos')
    await page.keyboard.press('ArrowRight')
    await expect(viewer(page)).toHaveCount(0)
  })
})
