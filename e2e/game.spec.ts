import { test, expect } from '@playwright/test'
import { visit, watchForProblems } from './helpers'

// The Wreck Maze easter egg. It is opened by clicking the octopus that lives
// beside the logo, and it draws itself on a <canvas>, so nothing about it is
// visible to a unit test. It has broken silently before: a Svelte effect that
// re-triggered itself left the canvas blank while the type checker stayed happy.

const title = (page: import('@playwright/test').Page) =>
  page.getByText('WRECK MAZE', { exact: true })

// Tagged, not skipped: playwright.config.ts stops the mobile project from
// collecting these at all, so they never show up as "5 skipped" in the report.
test.describe('desktop', { tag: '@desktop-only' }, () => {
  test('the octopus opens the Wreck Maze', async ({ page }) => {
    const problems = watchForProblems(page)
    await visit(page, '/')

    const octopus = page.getByRole('button', { name: 'Play Wreck Maze' })
    await octopus.click()

    await expect(title(page)).toBeVisible()
    await expect(page.getByRole('button', { name: /Enter the wreck/ })).toBeVisible()

    expect(problems.pageErrors, 'the game threw while opening').toEqual([])
    expect(problems.consoleErrors).toEqual([])
  })

  test('entering the wreck draws the corridor', async ({ page }) => {
    const problems = watchForProblems(page)
    await visit(page, '/')

    await page.getByRole('button', { name: 'Play Wreck Maze' }).click()
    await page.getByRole('button', { name: /Enter the wreck/ }).click()

    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()

    // A blank canvas is the failure this test exists to catch, so look at the
    // pixels rather than trusting that the element is present.
    const litPixels = await canvas.evaluate((el: HTMLCanvasElement) => {
      const data = el.getContext('2d')!.getImageData(0, 0, el.width, el.height).data
      let lit = 0
      for (let i = 0; i < data.length; i += 4000) {
        if (data[i] + data[i + 1] + data[i + 2] > 40) lit++
      }
      return lit
    })
    expect(litPixels, 'the game canvas is blank').toBeGreaterThan(20)

    expect(problems.pageErrors).toEqual([])
    expect(problems.consoleErrors).toEqual([])
  })

  // Nothing else here presses a key, and the whole game is played with them.
  // The minimap arrow is drawn from `facing`, so it is the visible proof that a
  // key reached the game.
  test('turning left points the diver a quarter-turn anticlockwise', async ({ page }) => {
    await visit(page, '/')
    await page.getByRole('button', { name: 'Play Wreck Maze' }).click()
    await page.getByRole('button', { name: /Enter the wreck/ }).click()

    const arrow = page.locator('svg g[transform*="rotate"]')
    await expect(arrow).toHaveAttribute('transform', /rotate\(0\)/)

    await page.keyboard.press('ArrowLeft')
    await expect(arrow).toHaveAttribute('transform', /rotate\(270\)/)

    await page.keyboard.press('ArrowRight')
    await expect(arrow).toHaveAttribute('transform', /rotate\(0\)/)
  })

  test('escape closes the game and returns you to the site', async ({ page }) => {
    await visit(page, '/')

    await page.getByRole('button', { name: 'Play Wreck Maze' }).click()
    await expect(title(page)).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(title(page)).toBeHidden()
  })
})

// Not an aspiration — a statement of what the site does today. The octopus is
// `hidden xl:block`, and it is the only way in, so the game is unreachable on a
// phone. If you make it reachable, this test will fail and should be rewritten.
test.describe('mobile', { tag: '@mobile-only' }, () => {
  test('has no way to open the game', async ({ page }) => {
    await visit(page, '/')
    await expect(page.getByRole('button', { name: 'Play Wreck Maze' })).toBeHidden()
  })
})
